#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export KUBECONFIG="${KUBECONFIG:-$HOME/.kube/home-k3s.yaml}"
image="${1:-}"

if [[ ! "$image" =~ ^ghcr\.io/owen-isenhart/portfolio@sha256:[0-9a-f]{64}$ ]]; then
  echo "Pass the portfolio GHCR image digest from the release workflow summary." >&2
  exit 1
fi

previous_image="$(kubectl -n portfolio get deployment portfolio --ignore-not-found \
  -o jsonpath='{.spec.template.spec.containers[?(@.name=="website")].image}')"

kubectl kustomize "$root/deploy/kubernetes" \
  | sed "s|ghcr.io/owen-isenhart/portfolio:IMAGE_TAG|$image|" \
  | kubectl apply -f -

if ! kubectl -n portfolio rollout status deployment/portfolio --timeout=180s; then
  if [[ -n "$previous_image" && "$previous_image" != "$image" ]]; then
    echo "Rollout failed. Restoring $previous_image." >&2
    kubectl -n portfolio set image deployment/portfolio "website=$previous_image"
    kubectl -n portfolio rollout status deployment/portfolio --timeout=180s || true
  fi
  kubectl -n portfolio get pods -o wide >&2
  exit 1
fi
