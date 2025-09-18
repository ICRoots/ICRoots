#!/bin/bash

# ICPNinja Mainnet Deployment Script
# This script deploys the ICRoots canisters to ICPNinja's free mainnet

set -e

echo "🚀 Deploying ICRoots to ICPNinja Mainnet"
echo "=========================================="

# Check if dfx is logged in
if ! dfx identity whoami > /dev/null 2>&1; then
    echo "❌ Please login to dfx first:"
    echo "   dfx identity login"
    exit 1
fi

# Set network to ICPNinja
export DFX_NETWORK=icpninja

# Get current identity
IDENTITY=$(dfx identity whoami)
echo "📝 Using identity: $IDENTITY"

# Deploy canisters in order (dependencies first)
echo -e "\n📦 Deploying Event Bus Backend..."
dfx deploy event_bus_backend --network icpninja

echo -e "\n🤖 Deploying Trust AI Backend..."
dfx deploy trust_ai_backend --network icpninja

echo -e "\n⭐ Deploying Repute Backend..."
dfx deploy repute_backend --network icpninja

echo -e "\n💰 Deploying Collateral Backend..."
dfx deploy collateral_backend --network icpninja

# Get canister IDs for linking
echo -e "\n🔗 Getting canister IDs for linking..."
EVENT_BUS_ID=$(dfx canister id event_bus_backend --network icpninja)
TRUST_AI_ID=$(dfx canister id trust_ai_backend --network icpninja)
REPUTE_ID=$(dfx canister id repute_backend --network icpninja)
COLLATERAL_ID=$(dfx canister id collateral_backend --network icpninja)

echo "Event Bus: $EVENT_BUS_ID"
echo "Trust AI: $TRUST_AI_ID"
echo "Repute: $REPUTE_ID"
echo "Collateral: $COLLATERAL_ID"

# Redeploy with proper links
echo -e "\n🔄 Redeploying with proper inter-canister links..."

echo "Redeploying Repute Backend with links..."
dfx deploy repute_backend --network icpninja --argument "(opt record {
  event_bus = opt principal \"$EVENT_BUS_ID\";
  loans = opt principal \"$LOANS_ID\"
})"

echo "Redeploying Collateral Backend with links..."
dfx deploy collateral_backend --network icpninja --argument "(opt record {
  event_bus = opt principal \"$EVENT_BUS_ID\";
  loans = opt principal \"$LOANS_ID\"
})"

# Deploy Loans Backend last (depends on others)
echo -e "\n🏦 Deploying Loans Backend with full links..."
LOANS_ID=$(dfx canister id loans_backend --network icpninja 2>/dev/null || echo "")
if [ -z "$LOANS_ID" ]; then
    # First deployment
    dfx deploy loans_backend --network icpninja --argument "(opt record {
      event_bus = opt principal \"$EVENT_BUS_ID\";
      repute = opt principal \"$REPUTE_ID\";
      collateral = opt principal \"$COLLATERAL_ID\";
      trust_ai = opt principal \"$TRUST_AI_ID\"
    })"
else
    # Redeployment with links
    dfx deploy loans_backend --network icpninja --argument "(opt record {
      event_bus = opt principal \"$EVENT_BUS_ID\";
      repute = opt principal \"$REPUTE_ID\";
      collateral = opt principal \"$COLLATERAL_ID\";
      trust_ai = opt principal \"$TRUST_AI_ID\"
    })"
fi

# Get final canister IDs
LOANS_ID=$(dfx canister id loans_backend --network icpninja)

echo -e "\n✅ Deployment Complete!"
echo "=========================="
echo "🚀 Canister URLs:"
echo "Event Bus: https://$EVENT_BUS_ID.icp0.io"
echo "Trust AI: https://$TRUST_AI_ID.icp0.io"
echo "Repute: https://$REPUTE_ID.icp0.io"
echo "Collateral: https://$COLLATERAL_ID.icp0.io"
echo "Loans: https://$LOANS_ID.icp0.io"

echo -e "\n📋 Environment Variables for Frontend:"
echo "export CANISTER_ID_EVENT_BUS_BACKEND=$EVENT_BUS_ID"
echo "export CANISTER_ID_TRUST_AI_BACKEND=$TRUST_AI_ID"
echo "export CANISTER_ID_REPUTE_BACKEND=$REPUTE_ID"
echo "export CANISTER_ID_COLLATERAL_BACKEND=$COLLATERAL_ID"
echo "export CANISTER_ID_LOANS_BACKEND=$LOANS_ID"
echo "export DFX_NETWORK=icpninja"

echo -e "\n🧪 Run tests on mainnet:"
echo "npm run test:canisters"

echo -e "\n🎉 Ready for production!"