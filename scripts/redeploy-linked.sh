#!/bin/bash

# Get canister IDs
EVENT_BUS_ID=$(dfx canister id event_bus_backend)
REPUTE_ID=$(dfx canister id repute_backend)
COLLATERAL_ID=$(dfx canister id collateral_backend)
TRUST_AI_ID=$(dfx canister id trust_ai_backend)
LOANS_ID=$(dfx canister id loans_backend)

# Deploy each canister with proper links
echo "Deploying event_bus_backend..."
dfx deploy event_bus_backend --network local

echo "Deploying trust_ai_backend..."
dfx deploy trust_ai_backend --network local

echo "Deploying repute_backend..."
dfx deploy repute_backend --network local --argument "(opt record { event_bus = opt principal \"$EVENT_BUS_ID\"; loans = opt principal \"$LOANS_ID\" })"

echo "Deploying collateral_backend..."
dfx deploy collateral_backend --network local --argument "(opt record { event_bus = opt principal \"$EVENT_BUS_ID\"; loans = opt principal \"$LOANS_ID\" })"

echo "Deploying loans_backend..."
dfx deploy loans_backend --network local --argument "(opt record { event_bus = opt principal \"$EVENT_BUS_ID\"; repute = opt principal \"$REPUTE_ID\"; collateral = opt principal \"$COLLATERAL_ID\"; trust_ai = opt principal \"$TRUST_AI_ID\" })"

echo "All canisters deployed with proper links"