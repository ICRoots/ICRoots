#!/bin/bash
set -e

echo "🚀 Deploying ICP canisters and storing contract addresses..."

# Check if dfx is running
dfx ping &>/dev/null || {
  echo "⚠️ DFX is not running. Starting dfx in the background..."
  dfx start --background
  sleep 5
}

# Deploy canisters
if [ "$1" != "" ]; then
  echo "📦 Deploying specific canister: $1"
  dfx deploy "$1"
else
  echo "📦 Deploying all canisters..."
  dfx deploy
fi

# Create the directory for storing canister IDs if it doesn't exist
mkdir -p ./config

# Get the network (local or ic)
NETWORK=${DFX_NETWORK:-"local"}
echo "🌐 Network: $NETWORK"

# Initialize the JSON structure
echo "{" > ./config/canister-ids-$NETWORK.json
echo "  \"network\": \"$NETWORK\"," >> ./config/canister-ids-$NETWORK.json

# Get all canister names from dfx.json
CANISTER_NAMES=$(jq -r '.canisters | keys[]' dfx.json)
LAST_CANISTER=$(jq -r '.canisters | keys[-1]' dfx.json)

# For each canister, get its ID and add to the JSON file
for CANISTER in $CANISTER_NAMES; do
  ID=$(dfx canister id $CANISTER)
  if [ "$CANISTER" = "$LAST_CANISTER" ]; then
    echo "  \"$CANISTER\": \"$ID\"" >> ./config/canister-ids-$NETWORK.json
  else
    echo "  \"$CANISTER\": \"$ID\"," >> ./config/canister-ids-$NETWORK.json
  fi
  echo "🔑 $CANISTER canister ID: $ID"
done

# Close the JSON structure
echo "}" >> ./config/canister-ids-$NETWORK.json

echo "✅ Deployment complete! Canister IDs stored in ./config/canister-ids-$NETWORK.json"

# Create a convenient link for the latest deployment
if [ "$NETWORK" = "local" ]; then
  cp ./config/canister-ids-local.json ./config/canister-ids-latest.json
  echo "📝 Latest canister IDs also available at ./config/canister-ids-latest.json"
  
  # Also create a markdown file for easy reference
  echo "# Local Canister IDs (deployed on $(date))" > ./docs/local-canister-ids.md
  echo "" >> ./docs/local-canister-ids.md
  echo "Use these IDs for local development and testing." >> ./docs/local-canister-ids.md
  echo "" >> ./docs/local-canister-ids.md
  
  for CANISTER in $CANISTER_NAMES; do
    ID=$(dfx canister id $CANISTER)
    echo "- **$CANISTER**: \`$ID\`" >> ./docs/local-canister-ids.md
  done
  
  echo "" >> ./docs/local-canister-ids.md
  echo "Frontend URL: http://$(dfx canister id frontend).localhost:8080/" >> ./docs/local-canister-ids.md
  echo "✅ Markdown reference created at ./docs/local-canister-ids.md"
fi