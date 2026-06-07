'use client';

import { useMemo, useState } from 'react';

type TraitKey = 'iq' | 'c' | 'n' | 'a' | 'e' | 'o' | 'h' | 'b' | 'ses_c';
type TraitMode = 'raw' | 'percentile' | 'zscore' | 'impute' | 'proxy';
type Gender = 'male' | 'female';

type TraitInput = {
  mode: TraitMode;
  value: number;
};

type IngestionRow = {
  trait: TraitKey;
  source: string;
  entered: string;
  z: number;
  percentile: number;
  imputed: boolean;
};

const TRAITS: TraitKey[] = ['iq', 'c', 'n', 'a', 'e', 'o', 'h', 'b', 'ses_c'];

const TRAIT_LABELS: Record<TraitKey, string> = {
  iq: 'Cognitive Ability (IQ)',
  c: 'Conscientiousness (C)',
  n: 'Neuroticism (N)',
  a: 'Agreeableness (A)',
  e: 'Extraversion (E)',
  o: 'Openness to Experience (O)',
  h: 'Physical Stature (Height)',
  b: 'Physical Attractiveness (Beauty)',
  ses_c: 'Childhood Socioeconomic Status (SES)',
};

const CORRELATION_MATRIX: number[][] = [
  [1.0, -0.04, -0.09, -0.02, 0.01, 0.1, 0.15, 0.1, 0.33],
  [-0.04, 1.0, -0.41, 0.31, 0.03, 0.09, 0.05, 0.12, 0.03],
  [-0.09, -0.41, 1.0, -0.39, -0.43, 0.04, -0.02, -0.08, -0.08],
  [-0.02, 0.31, -0.39, 1.0, -0.01, 0.21, 0.01, 0.15, 0.03],
  [0.01, 0.03, -0.43, -0.01, 1.0, 0.08, 0.06, 0.14, 0.07],
  [0.1, 0.09, 0.04, 0.21, 0.08, 1.0, 0.05, 0.18, 0.08],
  [0.15, 0.05, -0.02, 0.01, 0.06, 0.05, 1.0, 0.12, 0.1],
  [0.1, 0.12, -0.08, 0.15, 0.14, 0.18, 0.12, 1.0, 0.15],
  [0.33, 0.03, -0.08, 0.03, 0.07, 0.08, 0.1, 0.15, 1.0],
];

const BASE_TRAITS: Record<TraitKey, TraitInput> = {
  iq: { mode: 'raw', value: 100 },
  c: { mode: 'percentile', value: 50 },
  n: { mode: 'percentile', value: 50 },
  a: { mode: 'percentile', value: 50 },
  e: { mode: 'percentile', value: 50 },
  o: { mode: 'percentile', value: 50 },
  h: { mode: 'raw', value: 64 },
  b: { mode: 'raw', value: 7 },
  ses_c: { mode: 'percentile', value: 50 },
};

function zToPercentile(z: number) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.5 * x);
  const erfc =
    t *
    Math.exp(
      -x * x -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));

  const p = z >= 0 ? 1 - 0.5 * erfc : 0.5 * erfc;
  return p * 100;
}

function percentileToZ(percentile: number) {
  const clamped = Math.max(0.1, Math.min(99.9, percentile));
  const p = clamped / 100;
  const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;
  const z = t - ((c2 * t + c1) * t + c0) / (((d3 * t + d2) * t + d1) * t + 1);
  return p < 0.5 ? -z : z;
}

function invertMatrix(matrix: number[][]): number[][] | null {
  const n = matrix.length;
  const a = Array.from({ length: n }, (_, i) => {
    const row = Array.from({ length: 2 * n }, () => 0);

    for (let j = 0; j < n; j += 1) {
      row[j] = matrix[i][j];
      row[j + n] = i === j ? 1 : 0;
    }

    return row;
  });

  for (let i = 0; i < n; i += 1) {
    let maxRow = i;

    for (let k = i + 1; k < n; k += 1) {
      if (Math.abs(a[k][i]) > Math.abs(a[maxRow][i])) {
        maxRow = k;
      }
    }

    [a[i], a[maxRow]] = [a[maxRow], a[i]];

    const pivot = a[i][i];
    if (Math.abs(pivot) < 1e-9) {
      return null;
    }

    for (let j = i; j < 2 * n; j += 1) {
      a[i][j] /= pivot;
    }

    for (let k = 0; k < n; k += 1) {
      if (k === i) {
        continue;
      }

      const factor = a[k][i];
      for (let j = i; j < 2 * n; j += 1) {
        a[k][j] -= factor * a[i][j];
      }
    }
  }

  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => a[i][j + n]));
}

function multiplyMatrixVector(matrix: number[][], vector: number[]) {
  const rows = matrix.length;
  const cols = vector.length;

  return Array.from({ length: rows }, (_, i) => {
    let sum = 0;
    for (let j = 0; j < cols; j += 1) {
      sum += matrix[i][j] * vector[j];
    }
    return sum;
  });
}

function heightMeanAndSd(gender: Gender) {
  return gender === 'male' ? { mean: 70.3, sd: 2.8 } : { mean: 64.5, sd: 2.6 };
}

function defaultTraitsForGender(gender: Gender): Record<TraitKey, TraitInput> {
  const defaults = structuredClone(BASE_TRAITS);
  defaults.h.value = gender === 'male' ? 70.3 : 64.5;
  return defaults;
}

function numberFromString(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export default function SuccessPredictorDashboard() {
  const [gender, setGender] = useState<Gender>('female');
  const [complexity, setComplexity] = useState<number>(3);
  const [volatility, setVolatility] = useState<number>(0);
  const [parentalIncome, setParentalIncome] = useState<string>('');
  const [partnerActive, setPartnerActive] = useState<boolean>(true);
  const [partnerAttr, setPartnerAttr] = useState<number>(7);
  const [pdParanoid, setPdParanoid] = useState<number>(0.5);
  const [pdHistrionic, setPdHistrionic] = useState<number>(0.5);
  const [pdAvoidant, setPdAvoidant] = useState<number>(0.5);
  const [traitInputs, setTraitInputs] = useState<Record<TraitKey, TraitInput>>(defaultTraitsForGender('female'));

  const [iqProxy, setIqProxy] = useState<{ type: 'sat' | 'act' | 'edu'; sat: number; act: number; edu: number }>({ type: 'sat', sat: 1060, act: 20, edu: 3 });
  const [cProxy, setCProxy] = useState<{ q1: number; q2: number; q3: number }>({ q1: 3, q2: 3, q3: 3 });
  const [nProxy, setNProxy] = useState<{ q1: number; q2: number; q3: number }>({ q1: 3, q2: 3, q3: 3 });
  const [aProxy, setAProxy] = useState<{ q1: number; q2: number; q3: number }>({ q1: 3, q2: 3, q3: 3 });
  const [eProxy, setEProxy] = useState<{ q1: number; q2: number; q3: number }>({ q1: 3, q2: 3, q3: 3 });
  const [oProxy, setOProxy] = useState<{ q1: number; q2: number; q3: number }>({ q1: 3, q2: 3, q3: 3 });
  const [sesProxy, setSesProxy] = useState<{ edu: number; housing: number }>({ edu: 3, housing: 3 });

  const model = useMemo(() => {
    const inputZ: Array<number | null> = Array.from({ length: TRAITS.length }, () => null);
    const enteredData: string[] = Array.from({ length: TRAITS.length }, () => '');

    TRAITS.forEach((trait, index) => {
      const control = traitInputs[trait];
      if (control.mode === 'impute') {
        inputZ[index] = null;
        enteredData[index] = 'Auto-Imputed';
        return;
      }

      const entered = control.value;
      enteredData[index] = entered.toString();

      if (control.mode === 'zscore') {
        inputZ[index] = entered;
      } else if (control.mode === 'percentile') {
        inputZ[index] = percentileToZ(entered);
      } else if (control.mode === 'raw') {
        if (trait === 'iq') {
          inputZ[index] = (entered - 100) / 15;
        }

        if (trait === 'h') {
          const { mean, sd } = heightMeanAndSd(gender);
          inputZ[index] = (entered - mean) / sd;
        }

        if (trait === 'b') {
          const zSelf = (entered - 6.65) / 1.38;
          inputZ[index] = 0.25 * zSelf;
        }
      } else if (control.mode === 'proxy') {
        if (trait === 'iq') {
          if (iqProxy.type === 'sat') {
            inputZ[index] = (iqProxy.sat - 1060) / 210;
            enteredData[index] = `SAT: ${iqProxy.sat}`;
          } else if (iqProxy.type === 'act') {
            inputZ[index] = (iqProxy.act - 20) / 5.5;
            enteredData[index] = `ACT: ${iqProxy.act}`;
          } else {
            const zMap: Record<number, number> = { 1: -0.67, 2: -0.13, 3: 0.2, 4: 0.8, 5: 1.13, 6: 1.6 };
            inputZ[index] = zMap[iqProxy.edu] ?? 0;
            const eduLabels: Record<number, string> = { 1: '< HS', 2: 'HS/GED', 3: 'Some Coll', 4: 'BA/BS', 5: 'MA/MS', 6: 'PhD/MD' };
            enteredData[index] = `Edu: ${eduLabels[iqProxy.edu]}`;
          }
        } else if (trait === 'c') {
          const r = cProxy.q1 + cProxy.q2 + (6 - cProxy.q3);
          inputZ[index] = (r - 11.1) / 2.4;
          enteredData[index] = `TIPI: ${r}`;
        } else if (trait === 'n') {
          const r = nProxy.q1 + nProxy.q2 + (6 - nProxy.q3);
          inputZ[index] = (r - 8.7) / 2.6;
          enteredData[index] = `TIPI: ${r}`;
        } else if (trait === 'a') {
          const r = aProxy.q1 + aProxy.q2 + (6 - aProxy.q3);
          inputZ[index] = (r - 11.4) / 2.1;
          enteredData[index] = `TIPI: ${r}`;
        } else if (trait === 'e') {
          const r = eProxy.q1 + eProxy.q2 + (6 - eProxy.q3);
          inputZ[index] = (r - 10.5) / 2.5;
          enteredData[index] = `TIPI: ${r}`;
        } else if (trait === 'o') {
          const r = oProxy.q1 + oProxy.q2 + (6 - oProxy.q3);
          inputZ[index] = (r - 11.2) / 2.3;
          enteredData[index] = `TIPI: ${r}`;
        } else if (trait === 'ses_c') {
          const r = sesProxy.edu + sesProxy.housing;
          inputZ[index] = (r - 6.2) / 1.8;
          enteredData[index] = `Idx: ${r}`;
        }
      }
    });

    const observedIndices = inputZ.map((value, idx) => (value === null ? -1 : idx)).filter(idx => idx >= 0);
    const missingIndices = inputZ.map((value, idx) => (value === null ? idx : -1)).filter(idx => idx >= 0);

    const resolvedZ = inputZ.map(value => value ?? 0);

    if (missingIndices.length > 0 && observedIndices.length > 0) {
      const rOO = observedIndices.map(obsRow => observedIndices.map(obsCol => CORRELATION_MATRIX[obsRow][obsCol]));
      const rMO = missingIndices.map(missRow => observedIndices.map(obsCol => CORRELATION_MATRIX[missRow][obsCol]));
      const zObserved = observedIndices.map(obsIdx => inputZ[obsIdx] ?? 0);
      const rOOInverse = invertMatrix(rOO);

      if (rOOInverse) {
        const temp = multiplyMatrixVector(rOOInverse, zObserved);
        const zPredicted = multiplyMatrixVector(rMO, temp);

        missingIndices.forEach((missingIndex, idx) => {
          resolvedZ[missingIndex] = zPredicted[idx];
        });
      }
    }

    const zIq = resolvedZ[0];
    const zC = resolvedZ[1];
    const zN = resolvedZ[2];
    const zA = resolvedZ[3];
    const zE = resolvedZ[4];
    const zO = resolvedZ[5];
    const zH = resolvedZ[6];
    const zB = resolvedZ[7];
    const zSesC = resolvedZ[8];

    let parentalIncomeValue = numberFromString(parentalIncome);
    if (!Number.isFinite(parentalIncomeValue) || parentalIncomeValue <= 0) {
      parentalIncomeValue = 70400 * Math.exp(0.7 * zSesC);
    }

    const { mean: meanH, sd: sdH } = heightMeanAndSd(gender);
    const rawHeight = meanH + zH * sdH;
    const threshold = gender === 'male' ? 74 : 69;
    const excess = Math.max(0, rawHeight - threshold);
    const fH = 0.097 * zH - 0.01 * excess * excess;
    const complexityBoost = 0.015 * zIq * (complexity - 3);

    const lnY =
      Math.log(40000) +
      0.5 * Math.log(parentalIncomeValue / 70400) +
      0.046 * zIq +
      0.039 * zC +
      0.039 * zO +
      fH +
      0.029 * zB +
      complexityBoost;

    const volatilitySpread = 1.645 * 0.7 * (volatility / 100);
    const earnings = Math.exp(lnY);
    const earningsLow = volatility > 0 ? Math.exp(lnY - volatilitySpread) : earnings;
    const earningsHigh = volatility > 0 ? Math.exp(lnY + volatilitySpread) : earnings;

    const zSesAdult = (Math.log(earnings) - Math.log(40000)) / 0.7;
    const hazardRatio = Math.exp(-0.274 * zIq - 0.186 * zC - 0.128 * zA - 0.073 * zE + 0.199 * zN - 0.1 * zSesAdult);
    const longevity = Math.min(100, Math.max(50, 78.5 - 6 * Math.log(hazardRatio)));
    const hrAtLow = Math.exp(-0.274 * zIq - 0.186 * zC - 0.128 * zA - 0.073 * zE + 0.199 * zN - 0.1 * ((Math.log(earningsLow) - Math.log(40000)) / 0.7));
    const hrAtHigh = Math.exp(-0.274 * zIq - 0.186 * zC - 0.128 * zA - 0.073 * zE + 0.199 * zN - 0.1 * ((Math.log(earningsHigh) - Math.log(40000)) / 0.7));
    const longevityLow = Math.min(100, Math.max(50, 78.5 - 6 * Math.log(hrAtLow)));
    const longevityHigh = Math.min(100, Math.max(50, 78.5 - 6 * Math.log(hrAtHigh)));

    let logitDivorce = -0.405 + 0.31 * zN - 0.15 * zC - 0.2 * zA + 0.1 * zO + 0.223 * zB;
    if (partnerActive) {
      const zPartnerSelf = (partnerAttr - 6.65) / 1.38;
      const zPartnerObjectified = 0.25 * zPartnerSelf;
      logitDivorce += 0.18 * Math.abs(zB - zPartnerObjectified);
    }

    logitDivorce += 0.15 * pdParanoid + 0.12 * pdHistrionic - 0.1 * pdAvoidant;
    const divorceProbability = 1 / (1 + Math.exp(-logitDivorce));

    const wageBlind = 50000 + 5000 * zIq;
    const communicationSkills = zB;
    const confidenceSignal = zIq + 0.25 * zB;
    const wageOral = wageBlind + 2000 * confidenceSignal + 2500 * communicationSkills;
    const wageVisual = wageOral + 3000 * zB;
    const wageSpread = volatility > 0 ? Math.round(volatilitySpread * Math.abs(wageOral)) : 0;

    const ingestionRows: IngestionRow[] = TRAITS.map((trait, index) => {
      const mode = traitInputs[trait].mode;
      const entered =
        mode === 'impute'
          ? '--'
          : mode === 'proxy'
            ? enteredData[index]
            : mode === 'percentile'
              ? `${enteredData[index]}th pct`
              : mode === 'raw' && trait === 'b'
                ? `${enteredData[index]}/10`
                : enteredData[index];

      return {
        trait,
        source: mode === 'impute' ? 'GAUSSIAN IMPUTE' : mode === 'proxy' ? 'PROXY MAPPING' : mode.toUpperCase(),
        entered,
        z: resolvedZ[index],
        percentile: Math.round(zToPercentile(resolvedZ[index])),
        imputed: mode === 'impute',
      };
    });

    const earningsFeedback =
      earnings > 85000
        ? 'Elite/Top bracket sorting. Strong compounding potential.'
        : earnings > 50000
          ? 'Solid upper-middle earnings trajectory.'
          : earnings > 30000
            ? 'Middle cohort baseline.'
            : 'Sub-median sorting with high developmental friction.';

    const longevityFeedback =
      hazardRatio < 0.8
        ? 'High protective profile across cognition and personality channels.'
        : hazardRatio > 1.25
          ? 'Elevated stress-linked and chronic-disease risk class.'
          : 'Near-cohort epidemiological survival profile.';

    const stability =
      divorceProbability < 0.25
        ? {
            label: 'Highly Stable',
            color: 'text-emerald-500',
            text: 'Strong emotional regulation and agreeableness shielding.',
          }
        : divorceProbability > 0.55
          ? {
              label: 'Relational Liability',
              color: 'text-red-500',
              text: 'Trait and symptom load substantially increase dissolution risk.',
            }
          : {
              label: 'Baseline Norm',
              color: 'text-[var(--accent)]',
              text: 'Standard relationship stability parameters.',
            };

    const negotiationFeedback =
      zB > 1
        ? 'Visual and oral channels strongly amplify negotiation leverage.'
        : zB < -1
          ? 'Blind process protects against appearance penalties.'
          : 'Returns are mostly driven by cognitive and confidence signals.';

    return {
      ingestionRows,
      earnings,
      earningsLow,
      earningsHigh,
      earningsFeedback,
      longevity,
      longevityLow,
      longevityHigh,
      hazardRatio,
      longevityFeedback,
      divorceProbability,
      stability,
      wageBlind,
      wageOral,
      wageVisual,
      wageSpread,
      negotiationFeedback,
    };
  }, [
    complexity,
    gender,
    parentalIncome,
    partnerActive,
    partnerAttr,
    pdAvoidant,
    pdHistrionic,
    pdParanoid,
    traitInputs,
    volatility,
    iqProxy,
    cProxy,
    nProxy,
    aProxy,
    eProxy,
    oProxy,
    sesProxy,
  ]);

  const resetToMedians = () => {
    setTraitInputs(defaultTraitsForGender(gender));
    setParentalIncome('');
    setVolatility(0);
    setPartnerActive(true);
    setPartnerAttr(7);
    setPdParanoid(0.5);
    setPdHistrionic(0.5);
    setPdAvoidant(0.5);
    setIqProxy({ type: 'sat', sat: 1060, act: 20, edu: 3 });
    setCProxy({ q1: 3, q2: 3, q3: 3 });
    setNProxy({ q1: 3, q2: 3, q3: 3 });
    setAProxy({ q1: 3, q2: 3, q3: 3 });
    setEProxy({ q1: 3, q2: 3, q3: 3 });
    setOProxy({ q1: 3, q2: 3, q3: 3 });
    setSesProxy({ edu: 3, housing: 3 });
  };

  const setTraitMode = (trait: TraitKey, mode: TraitMode) => {
    setTraitInputs(prev => {
      const next = { ...prev };
      const baseline = defaultTraitsForGender(gender)[trait];

      if (trait === 'h' && mode === 'raw') {
        next[trait] = { mode, value: gender === 'male' ? 70 : 64 };
      } else if (mode === 'zscore') {
        next[trait] = { mode, value: 0 };
      } else {
        next[trait] = { mode, value: baseline.value };
      }

      return next;
    });
  };

  const setTraitValue = (trait: TraitKey, value: number) => {
    setTraitInputs(prev => ({
      ...prev,
      [trait]: { ...prev[trait], value },
    }));
  };

  return (
    <section className="my-7 w-full rounded-sm border border-dashed border-[var(--outline)] bg-[var(--background)]">
      <div className="border-b border-dashed border-[var(--outline)] bg-light-background/50 px-4 py-3 sm:px-5">
        <h3 className="font-space text-base sm:text-lg">Quantitative Success Predictor</h3>
        <p className="text-xs text-light-foreground sm:text-sm">Interactive model for earnings, longevity, marital stability, and negotiation outcomes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-4 border-b border-dashed border-[var(--outline)] p-4 md:border-b-0 md:border-r md:p-5">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-wide text-light-foreground">Demographic Baselines</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="text-xs">
                <span className="mb-1 block text-light-foreground">Biological Sex</span>
                <select
                  className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5"
                  value={gender}
                  onChange={event => setGender(event.target.value as Gender)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="text-xs">
                <span className="mb-1 block text-light-foreground">Occupational Complexity</span>
                <select
                  className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5"
                  value={complexity}
                  onChange={event => setComplexity(Number.parseInt(event.target.value, 10))}
                >
                  <option value={1}>Low (Routine)</option>
                  <option value={3}>Medium (Professional)</option>
                  <option value={5}>High (Elite/Abstract)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="border-t border-[var(--outline)]/40 pt-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold tracking-wide text-light-foreground">Core Profile Variables</p>
              <button
                type="button"
                onClick={resetToMedians}
                className="text-xs underline decoration-dotted underline-offset-4 hover:text-[var(--accent)]"
              >
                Reset to Medians
              </button>
            </div>

            <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
              {TRAITS.map(trait => {
                const current = traitInputs[trait];
                const showRaw = trait === 'iq' || trait === 'h' || trait === 'b';

                return (
                  <div key={trait} className="border-b border-[var(--outline)]/30 pb-2 last:border-0 last:pb-0">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-1.5">
                      <p className="text-[11px] font-medium">{TRAIT_LABELS[trait]}</p>
                      <select
                        value={current.mode}
                        onChange={event => setTraitMode(trait, event.target.value as TraitMode)}
                        className="rounded-sm border border-[var(--outline)] bg-[var(--background)] px-1.5 py-0.5 text-[10px]"
                      >
                        {showRaw ? <option value="raw">Raw</option> : null}
                        <option value="percentile">Percentile</option>
                        <option value="zscore">Z-Score</option>
                        <option value="impute">Auto-Impute</option>
                        {['iq', 'c', 'n', 'a', 'e', 'o', 'ses_c'].includes(trait) ? <option value="proxy">Proxy Mapping</option> : null}
                      </select>
                    </div>

                    {current.mode === 'impute' ? (
                      <p className="text-[10px] italic text-light-foreground">Estimated via Gaussian covariance.</p>
                    ) : null}

                    {current.mode === 'raw' && trait === 'iq' ? (
                      <input
                        type="number"
                        min={50}
                        max={150}
                        step={1}
                        value={current.value}
                        onChange={event => setTraitValue(trait, Number.parseFloat(event.target.value) || 50)}
                        className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5 text-xs"
                      />
                    ) : null}

                    {current.mode === 'raw' && trait === 'h' ? (
                      <input
                        type="number"
                        min={50}
                        max={85}
                        step={0.5}
                        value={current.value}
                        onChange={event => setTraitValue(trait, Number.parseFloat(event.target.value) || 50)}
                        className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5 text-xs"
                      />
                    ) : null}

                    {current.mode === 'raw' && trait === 'b' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={1}
                          max={10}
                          step={0.5}
                          value={current.value}
                          onChange={event => setTraitValue(trait, Number.parseFloat(event.target.value))}
                          className="w-full accent-[var(--accent)]"
                        />
                        <span className="w-10 text-right text-[10px] text-light-foreground">{current.value}/10</span>
                      </div>
                    ) : null}

                    {current.mode === 'percentile' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={1}
                          max={99}
                          step={1}
                          value={current.value}
                          onChange={event => setTraitValue(trait, Number.parseFloat(event.target.value))}
                          className="w-full accent-[var(--accent)]"
                        />
                        <span className="w-10 text-right text-[10px] text-light-foreground">{Math.round(current.value)}th</span>
                      </div>
                    ) : null}

                    {current.mode === 'zscore' ? (
                      <input
                        type="number"
                        min={-3}
                        max={3}
                        step={0.1}
                        value={current.value}
                        onChange={event => setTraitValue(trait, Number.parseFloat(event.target.value) || 0)}
                        className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5 text-xs"
                      />
                    ) : null}

                    {current.mode === 'proxy' && trait === 'iq' ? (
                      <div className="space-y-2 text-xs">
                        <select
                          value={iqProxy.type}
                          onChange={e => setIqProxy({ ...iqProxy, type: e.target.value as 'sat' | 'act' | 'edu' })}
                          className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5"
                        >
                          <option value="sat">SAT Score (Post-2016)</option>
                          <option value="act">ACT Composite</option>
                          <option value="edu">Educational Attainment</option>
                        </select>
                        {iqProxy.type === 'sat' && (
                          <input type="number" min={400} max={1600} step={10} value={iqProxy.sat} onChange={e => setIqProxy({ ...iqProxy, sat: Number.parseInt(e.target.value) || 400 })} className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5" />
                        )}
                        {iqProxy.type === 'act' && (
                          <input type="number" min={1} max={36} step={1} value={iqProxy.act} onChange={e => setIqProxy({ ...iqProxy, act: Number.parseInt(e.target.value) || 1 })} className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5" />
                        )}
                        {iqProxy.type === 'edu' && (
                          <select value={iqProxy.edu} onChange={e => setIqProxy({ ...iqProxy, edu: Number.parseInt(e.target.value) })} className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5">
                            <option value={1}>Did Not Finish High School</option>
                            <option value={2}>High School Diploma / GED</option>
                            <option value={3}>Some College / Associate Degree</option>
                            <option value={4}>Bachelor&apos;s Degree (BA/BS)</option>
                            <option value={5}>Master&apos;s Degree (MA/MS/MBA)</option>
                            <option value={6}>Doctorate / Professional (PhD, MD, JD)</option>
                          </select>
                        )}
                      </div>
                    ) : null}

                    {current.mode === 'proxy' && ['c', 'n', 'a', 'e', 'o'].includes(trait) ? (
                      <div className="space-y-2 text-[10px]">
                        {trait === 'c' && (
                          <>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Dependable, organized, thorough.</span>
                                <span>{cProxy.q1}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={cProxy.q1} onChange={e => setCProxy({ ...cProxy, q1: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Rarely makes mistakes, follows through.</span>
                                <span>{cProxy.q2}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={cProxy.q2} onChange={e => setCProxy({ ...cProxy, q2: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Lazy, easily distracted. (Reverse)</span>
                                <span>{cProxy.q3}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={cProxy.q3} onChange={e => setCProxy({ ...cProxy, q3: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                          </>
                        )}
                        {trait === 'n' && (
                          <>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Worries a lot, easily stressed.</span>
                                <span>{nProxy.q1}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={nProxy.q1} onChange={e => setNProxy({ ...nProxy, q1: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Rapid mood swings, emotional volatility.</span>
                                <span>{nProxy.q2}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={nProxy.q2} onChange={e => setNProxy({ ...nProxy, q2: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Calm, stable, rarely upset. (Reverse)</span>
                                <span>{nProxy.q3}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={nProxy.q3} onChange={e => setNProxy({ ...nProxy, q3: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                          </>
                        )}
                        {trait === 'a' && (
                          <>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Cares about others, empathetic.</span>
                                <span>{aProxy.q1}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={aProxy.q1} onChange={e => setAProxy({ ...aProxy, q1: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Prefers cooperation and compromise.</span>
                                <span>{aProxy.q2}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={aProxy.q2} onChange={e => setAProxy({ ...aProxy, q2: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Critical, skeptical. (Reverse)</span>
                                <span>{aProxy.q3}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={aProxy.q3} onChange={e => setAProxy({ ...aProxy, q3: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                          </>
                        )}
                        {trait === 'e' && (
                          <>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Outgoing, sociable, thrives in groups.</span>
                                <span>{eProxy.q1}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={eProxy.q1} onChange={e => setEProxy({ ...eProxy, q1: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Enthusiastic, talkative, draws energy.</span>
                                <span>{eProxy.q2}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={eProxy.q2} onChange={e => setEProxy({ ...eProxy, q2: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Quiet, reserved. (Reverse)</span>
                                <span>{eProxy.q3}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={eProxy.q3} onChange={e => setEProxy({ ...eProxy, q3: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                          </>
                        )}
                        {trait === 'o' && (
                          <>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Imaginative, creative, abstract ideas.</span>
                                <span>{oProxy.q1}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={oProxy.q1} onChange={e => setOProxy({ ...oProxy, q1: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Seeks out new experiences, challenges.</span>
                                <span>{oProxy.q2}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={oProxy.q2} onChange={e => setOProxy({ ...oProxy, q2: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex justify-between text-light-foreground">
                                <span>Prefers routine, traditional. (Reverse)</span>
                                <span>{oProxy.q3}</span>
                              </div>
                              <input type="range" min={1} max={5} step={1} value={oProxy.q3} onChange={e => setOProxy({ ...oProxy, q3: Number.parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}

                    {current.mode === 'proxy' && trait === 'ses_c' ? (
                      <div className="space-y-2 text-xs">
                        <select value={sesProxy.edu} onChange={e => setSesProxy({ ...sesProxy, edu: Number.parseInt(e.target.value) })} className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5">
                          <option value={1}>Parent Edu: No High School</option>
                          <option value={2}>Parent Edu: High School</option>
                          <option value={3}>Parent Edu: Some College / Assoc.</option>
                          <option value={4}>Parent Edu: Bachelor&apos;s</option>
                          <option value={5}>Parent Edu: Graduate / Prof.</option>
                        </select>
                        <select value={sesProxy.housing} onChange={e => setSesProxy({ ...sesProxy, housing: Number.parseInt(e.target.value) })} className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5">
                          <option value={1}>Housing: Insecurity / Welfare</option>
                          <option value={2}>Housing: Rented lower-income</option>
                          <option value={3}>Housing: Rented middle-class / stable</option>
                          <option value={4}>Housing: Owned suburban home</option>
                          <option value={5}>Housing: Owned premium / multiple</option>
                        </select>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-dashed border-[var(--outline)] p-4 md:p-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-light-foreground">Additional Parameters</p>

            <label className="block text-xs">
              <span className="mb-1 block text-light-foreground">Parental Household Income (optional)</span>
              <input
                type="number"
                min={0}
                step={100}
                placeholder="70400"
                value={parentalIncome}
                onChange={event => setParentalIncome(event.target.value)}
                className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1.5"
              />
            </label>

            <div>
              <label className="mb-1 flex items-center justify-between text-xs text-light-foreground">
                <span>
                  <input
                    type="checkbox"
                    checked={partnerActive}
                    onChange={event => setPartnerActive(event.target.checked)}
                    className="mr-2 accent-[var(--accent)]"
                  />
                  Include Partner in Mating Gap
                </span>
                <span>{partnerActive ? `Self-Rating: ${partnerAttr}/10` : 'Not Included'}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={partnerAttr}
                onChange={event => setPartnerAttr(Number.parseFloat(event.target.value))}
                disabled={!partnerActive}
                className="w-full accent-[var(--accent)] disabled:opacity-40"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <label className="text-[11px] text-light-foreground">
                <span className="mb-1 block">Paranoid (0-5)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={pdParanoid}
                  onChange={event => setPdParanoid(Number.parseFloat(event.target.value) || 0)}
                  className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1"
                />
              </label>
              <label className="text-[11px] text-light-foreground">
                <span className="mb-1 block">Histrionic (0-5)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={pdHistrionic}
                  onChange={event => setPdHistrionic(Number.parseFloat(event.target.value) || 0)}
                  className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1"
                />
              </label>
              <label className="text-[11px] text-light-foreground">
                <span className="mb-1 block">Avoidant (0-5)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={pdAvoidant}
                  onChange={event => setPdAvoidant(Number.parseFloat(event.target.value) || 0)}
                  className="w-full rounded-sm border border-[var(--outline)] bg-[var(--background)] px-2 py-1"
                />
              </label>
            </div>

            <div>
              <label className="mb-1 flex justify-between text-xs text-light-foreground">
                <span>Environmental Volatility / Luck Factor</span>
                <span>{volatility}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volatility}
                onChange={event => setVolatility(Number.parseInt(event.target.value, 10))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        <div className="hidden border-t border-dashed border-[var(--outline)] p-4 md:col-span-2 md:block md:p-5">
          <div className="overflow-x-auto">
            <p className="mb-2 text-[10px] font-semibold tracking-widest uppercase text-light-foreground">Ingestion Engine Status</p>
            <table className="w-full min-w-[36rem] text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--outline)]/70 text-light-foreground">
                  <th className="pb-2">Trait</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Entered</th>
                  <th className="pb-2 text-right">Z-Score</th>
                  <th className="pb-2 text-right">Percentile</th>
                </tr>
              </thead>
              <tbody>
                {model.ingestionRows.map(row => (
                  <tr key={row.trait} className="border-b border-[var(--outline)]/25 last:border-0">
                    <td className="py-1.5 pr-3 text-[11px]">{TRAIT_LABELS[row.trait]}</td>
                    <td className="py-1.5 pr-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                          row.imputed
                            ? 'border-[var(--accent)]/60 bg-[var(--accent)]/10 text-[var(--accent)]'
                            : 'border-[var(--outline)]/70 bg-light-background/60 text-light-foreground'
                        }`}
                      >
                        {row.source}
                      </span>
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-[11px] text-light-foreground">{row.entered}</td>
                    <td className="py-1.5 pr-3 text-right font-mono text-[11px]">{row.z.toFixed(2)}</td>
                    <td className="py-1.5 text-right font-mono text-[11px] text-[var(--accent)]">{row.percentile}th</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-dashed border-[var(--outline)] p-4 md:col-span-2 md:p-5">
          <div className="grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-4">
            <div>
              <p className="mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-light-foreground">Earnings Projection</p>
              {volatility > 0 ? (
                <p className="text-lg font-semibold leading-snug">
                  ${Math.round(model.earningsLow).toLocaleString()}
                  <span className="mx-1 text-xs font-normal text-light-foreground">–</span>
                  ${Math.round(model.earningsHigh).toLocaleString()}
                </p>
              ) : (
                <p className="text-2xl font-semibold">${Math.round(model.earnings).toLocaleString()}</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-light-background/60">
                <div className="h-full bg-[var(--accent)]" style={{ width: `${Math.max(0, Math.min(100, (model.earnings / 150000) * 100))}%` }} />
              </div>
              <p className="mt-1.5 text-[10px] text-light-foreground">{model.earningsFeedback}</p>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-light-foreground">Longevity Model</p>
              {volatility > 0 ? (
                <p className="text-lg font-semibold leading-snug">
                  {model.longevityLow.toFixed(1)}
                  <span className="mx-1 text-xs font-normal text-light-foreground">–</span>
                  {model.longevityHigh.toFixed(1)} yrs
                </p>
              ) : (
                <p className="text-2xl font-semibold">{model.longevity.toFixed(1)} yrs</p>
              )}
              <p className="text-[10px] text-light-foreground">HR {model.hazardRatio.toFixed(2)}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-light-background/60">
                <div className="h-full bg-[var(--accent)]" style={{ width: `${Math.min(100, Math.max(5, (1 / model.hazardRatio) * 50))}%` }} />
              </div>
              <p className="mt-1.5 text-[10px] text-light-foreground">{model.longevityFeedback}</p>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-light-foreground">Marital Stability</p>
                <p className={`text-[10px] font-semibold ${model.stability.color}`}>{model.stability.label}</p>
              </div>
              <p className="text-2xl font-semibold">{(model.divorceProbability * 100).toFixed(1)}%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-light-background/60">
                <div className="h-full bg-[var(--accent)]" style={{ width: `${model.divorceProbability * 100}%` }} />
              </div>
              <p className="mt-1.5 text-[10px] text-light-foreground">{model.stability.text}</p>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-light-foreground">Wage Negotiation</p>
              <div className="space-y-1.5 text-xs">
                <p className="flex justify-between gap-2">
                  <span className="text-light-foreground">Blind / Resume</span>
                  <span className="font-mono font-semibold">${Math.round(model.wageBlind).toLocaleString()}</span>
                </p>
                <p className="flex justify-between gap-2">
                  <span className="text-light-foreground">Oral Contact</span>
                  <span className="font-mono font-semibold text-[var(--accent)]">
                    {model.wageSpread > 0
                      ? `$${Math.round(model.wageOral - model.wageSpread).toLocaleString()} – $${Math.round(model.wageOral + model.wageSpread).toLocaleString()}`
                      : `$${Math.round(model.wageOral).toLocaleString()}`}
                  </span>
                </p>
                <p className="flex justify-between gap-2">
                  <span className="text-light-foreground">Visual + Oral</span>
                  <span className="font-mono font-semibold">${Math.round(model.wageVisual).toLocaleString()}</span>
                </p>
              </div>
              <p className="mt-2 text-[10px] text-light-foreground">{model.negotiationFeedback}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
