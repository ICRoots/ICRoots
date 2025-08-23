#!/usr/bin/env bash
set -euo pipefail

echo "Node: $(node -v)"
echo "NPM:  $(npm -v)"

# Vite plugin presence (react)
node -e "require('@vitejs/plugin-react'); console.log('vite react plugin: OK')" || { echo "Install @vitejs/plugin-react"; exit 1; }

# Declarations exist?
for d in event_bus_backend repute_backend collateral_backend trust_ai_backend loans_backend; do
  if [ ! -f "src/declarations/$d/index.js" ]; then
    echo "❌ missing src/declarations/$d/index.js — run: dfx generate --network local"
    exit 1
  fi
done
echo "Declarations: OK"

# Local replica reachable?
curl -sSf "http://127.0.0.1:4943/api/v2/status" >/dev/null && echo "Replica: OK" || { echo "❌ Replica not reachable. Run: dfx start --background"; exit 1; }
