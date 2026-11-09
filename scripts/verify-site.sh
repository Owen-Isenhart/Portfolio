#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-https://oisenhart.com}"
base_url="${base_url%/}"
curl_options=(--fail --silent --show-error --max-time 15)

if [[ -n "${SITE_HOST:-}" ]]; then
  curl_options+=(--header "Host: $SITE_HOST")
fi

[[ "$(curl "${curl_options[@]}" "$base_url/healthz")" == ok ]]
for path in / /about /projects /notes /lens; do
  curl "${curl_options[@]}" --output /dev/null "$base_url$path"
done

# Exercise the native image optimizer and its writable cache.
curl "${curl_options[@]}" --output /dev/null \
  "$base_url/_next/image?url=%2Fimages%2Fheadshot.avif&w=640&q=75"
echo "Portfolio smoke checks passed at $base_url."
