#!/bin/bash
set -e

echo "🧪 ICRoots Canister Testing Suite"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "\n${YELLOW}Test $TOTAL_TESTS: $test_name${NC}"
    echo "Command: $test_command"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
    fi
}

# Get canister IDs
echo "📋 Getting canister IDs..."
COLLATERAL_ID=$(dfx canister id collateral_backend)
EVENT_BUS_ID=$(dfx canister id event_bus_backend)
LOANS_ID=$(dfx canister id loans_backend)
REPUTE_ID=$(dfx canister id repute_backend)
TRUST_AI_ID=$(dfx canister id trust_ai_backend)

echo "Collateral Backend: $COLLATERAL_ID"
echo "Event Bus Backend: $EVENT_BUS_ID"
echo "Loans Backend: $LOANS_ID"
echo "Repute Backend: $REPUTE_ID"
echo "Trust AI Backend: $TRUST_AI_ID"

# Test 1: Event Bus Backend
echo -e "\n🚌 Testing Event Bus Backend"
echo "============================="
run_test "Emit test event" "dfx canister call event_bus_backend emit '(\"Test event from script\")'"
run_test "List recent events" "dfx canister call event_bus_backend list_recent '(5)'"

# Test 2: Repute Backend  
echo -e "\n⭐ Testing Repute Backend"
echo "========================="
ANONYMOUS_PRINCIPAL=$(dfx identity get-principal)
echo "Using principal: $ANONYMOUS_PRINCIPAL"
run_test "Get anonymous user level" "dfx canister call repute_backend get_level '(principal \"$ANONYMOUS_PRINCIPAL\")'"
run_test "Set user level to 5" "dfx canister call repute_backend set_level '(principal \"$ANONYMOUS_PRINCIPAL\", 5)'"
run_test "Verify level was set" "dfx canister call repute_backend get_level '(principal \"$ANONYMOUS_PRINCIPAL\")'"

# Test 3: Collateral Backend
echo -e "\n💰 Testing Collateral Backend"
echo "============================="
run_test "Get initial collateral" "dfx canister call collateral_backend get_collateral '(principal \"$ANONYMOUS_PRINCIPAL\")'"
run_test "Deposit mock collateral" "dfx canister call collateral_backend deposit_mock '(principal \"$ANONYMOUS_PRINCIPAL\", 50000)'"
run_test "Verify collateral deposit" "dfx canister call collateral_backend get_collateral '(principal \"$ANONYMOUS_PRINCIPAL\")'"

# Test 4: Trust AI Backend
echo -e "\n🤖 Testing Trust AI Backend"
echo "============================"
run_test "Get AI recommendation" "dfx canister call trust_ai_backend recommend '(principal \"$ANONYMOUS_PRINCIPAL\", 10000, 5)'"

# Test 5: Loans Backend
echo -e "\n🏦 Testing Loans Backend"
echo "========================"
run_test "Ping loans service" "dfx canister call loans_backend ping"
run_test "Register user" "dfx canister call loans_backend register_user"
run_test "Get user summary" "dfx canister call loans_backend get_summary '(principal \"$ANONYMOUS_PRINCIPAL\")'"
run_test "Request loan" "dfx canister call loans_backend request_loan '(25000)'"

# Test Results Summary
echo -e "\n📊 Test Results Summary"
echo "======================="
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $((TOTAL_TESTS - PASSED_TESTS))${NC}"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Canisters are ready for deployment.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️ Some tests failed. Please check the issues above.${NC}"
    exit 1
fi