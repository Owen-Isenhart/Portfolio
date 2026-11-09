#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export KUBECONFIG="${KUBECONFIG:-$HOME/.kube/home-k3s.yaml}"
tofu="${TOFU:-tofu}"

tunnel_token="$("$tofu" -chdir="$root/infra/cloudflare" output -raw cloudflared_token)"
: "${tunnel_token:?OpenTofu returned an empty tunnel token}"

kubectl apply -f "$root/deploy/cloudflared/namespace.yaml"
printf '%s' "$tunnel_token" \
  | kubectl -n portfolio-cloudflare create secret generic portfolio-cloudflared-token \
      --from-file=token=/dev/stdin --dry-run=client -o yaml \
  | kubectl apply --server-side -f -
unset tunnel_token

kubectl apply -k "$root/deploy/cloudflared"
kubectl -n portfolio-cloudflare rollout restart deployment/portfolio-cloudflared
kubectl -n portfolio-cloudflare rollout status deployment/portfolio-cloudflared --timeout=180s
