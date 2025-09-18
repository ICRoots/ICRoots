#!/bin/bash

# Test ICPNinja deployment
# This script tests the deployed canisters on ICPNinja mainnet

set -e

echo "🧪 Testing ICPNinja Deployment"
echo "=============================="

# Set network
export DFX_NETWORK=icpninja

# Get canister IDs
echo "📋 Getting canister IDs..."
COLLATERAL_ID=$(dfx canister id collateral_backend --network icpninja)
EVENT_BUS_ID=$(dfx canister id event_bus_backend --network icpninja)
LOANS_ID=$(dfx canister id loans_backend --network icpninja)
REPUTE_ID=$(dfx canister id repute_backend --network icpninja)
TRUST_AI_ID=$(dfx canister id trust_ai_backend --network icpninja)

echo "Collateral Backend: $COLLATERAL_ID"
echo "Event Bus Backend: $EVENT_BUS_ID"
echo "Loans Backend: $LOANS_ID"
echo "Repute Backend: $REPUTE_ID"
echo "Trust AI Backend: $TRUST_AI_ID"

# Test basic functionality
echo -e "\n🧪 Running basic tests..."

# Test Event Bus
echo "Testing Event Bus..."
dfx canister call event_bus_backend emit '("ICPNinja test")' --network icpninja

# Test Repute Backend
echo "Testing Repute Backend..."
dfx canister call repute_backend get_level '(principal "2vxsx-fae")' --network icpninja

# Test Collateral Backend
echo "Testing Collateral Backend..."
dfx canister call collateral_backend get_collateral '(principal "2vxsx-fae")' --network icpninja

# Test Trust AI Backend
echo "Testing Trust AI Backend..."
dfx canister call trust_ai_backend recommend '(principal "2vxsx-fae", 10000, 5)' --network icpninja

# Test Loans Backend
echo "Testing Loans Backend..."
dfx canister call loans_backend ping --network icpninja

echo -e "\n✅ ICPNinja deployment test complete!"
echo "🌐 Your canisters are live on the Internet Computer mainnet!"
echo "📱 Frontend URL: https://$LOANS_ID.icp0.io"