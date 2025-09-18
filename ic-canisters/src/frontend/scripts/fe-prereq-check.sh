#!/usr/bin/env bash
set -euo pipefail

echo "== Node & npm =="
node -v || echo "node: MISSING"
npm -v  || echo "npm:  MISSING"
command -v pnpm >/dev/null && pnpm -v || true

echo "== DFX =="
dfx --version || echo "dfx: MISSING"

echo "== Replica status (http://127.0.0.1:4943) =="
if command -v jq >/dev/null; then
  curl -s http://127.0.0.1:4943/api/v2/status | jq . || echo "replica not responding"
else
  curl -s http://127.0.0.1:4943/api/v2/status || echo "replica not responding"
fi

echo "== Canister IDs =="
for c in event_bus_backend repute_backend collateral_backend trust_ai_backend loans_backend; do
  printf "  %-20s: " "$c"
  dfx canister id "$c" || true
done

echo "== Declarations present? =="
ls -1 src/declarations 2>/dev/null || echo "src/declarations missing"

echo "OK."
