'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

const GISCUS_ORIGIN = 'https://giscus.app';

function isTruthy(value: string | undefined) {
  if (typeof value !== 'string') {
    return false;
  }

  return value.toLowerCase() !== 'false' && value !== '';
}

export default function NoteComments({ slug }: { slug: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const config = useMemo(() => {
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO ?? 'Owen-Isenhart/Portfolio';
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General';
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
    const mapping = process.env.NEXT_PUBLIC_GISCUS_MAPPING ?? 'pathname';
    const strict = process.env.NEXT_PUBLIC_GISCUS_STRICT ?? '0';
    const reactionsEnabled = process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED ?? '1';
    const emitMetadata = process.env.NEXT_PUBLIC_GISCUS_EMIT_METADATA ?? '0';
    const inputPosition = process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION ?? 'bottom';
    const loading = process.env.NEXT_PUBLIC_GISCUS_LOADING ?? 'lazy';

    return {
      repo,
      repoId,
      category,
      categoryId,
      mapping,
      strict,
      reactionsEnabled,
      emitMetadata,
      inputPosition,
      loading,
    };
  }, []);

  const hasRequiredConfig = Boolean(config.repo && config.repoId && config.category && config.categoryId);
  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !hasRequiredConfig || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-giscus-script', 'true');
    script.setAttribute('data-repo', config.repo);
    script.setAttribute('data-repo-id', config.repoId ?? '');
    script.setAttribute('data-category', config.category);
    script.setAttribute('data-category-id', config.categoryId ?? '');
    script.setAttribute('data-mapping', config.mapping);
    script.setAttribute('data-strict', config.strict);
    script.setAttribute('data-reactions-enabled', isTruthy(config.reactionsEnabled) ? '1' : '0');
    script.setAttribute('data-emit-metadata', isTruthy(config.emitMetadata) ? '1' : '0');
    script.setAttribute('data-input-position', config.inputPosition);
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', config.loading);

    container.appendChild(script);
  }, [config, hasRequiredConfig, mounted, giscusTheme]);

  useEffect(() => {
    if (!mounted || !hasRequiredConfig) {
      return;
    }

    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');

    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: giscusTheme,
          },
        },
      },
      GISCUS_ORIGIN
    );
  }, [giscusTheme, hasRequiredConfig, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <section className="mt-10 w-full border-t border-dashed border-[var(--outline)] pt-6">
      <div className="mb-4">
        <h2 className="font-space pb-1 text-lg sm:text-xl md:text-2xl">Comments</h2>
        <p className="font-sans text-sm text-light-foreground sm:text-base">
          Join the discussion on this note below.
        </p>
      </div>

      {hasRequiredConfig ? (
        <div ref={containerRef} className="giscus-container w-full overflow-hidden rounded-sm border border-dashed border-[var(--outline)] bg-[var(--light-background)] p-3 sm:p-4" />
      ) : (
        <div className="rounded-sm border border-dashed border-[var(--outline)] bg-[var(--light-background)] p-4 font-sans text-sm text-light-foreground sm:text-base">
          Giscus is not configured yet. Add the public Giscus repo and category IDs to enable comments for {slug}.
        </div>
      )}
    </section>
  );
}