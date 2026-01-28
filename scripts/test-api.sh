#!/bin/bash

# GrowAI-MAP API 테스트 스크립트
# 주요 API 엔드포인트를 테스트합니다

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080"

echo -e "${BLUE}=== GrowAI-MAP API 테스트 ===${NC}"
echo ""

# 1. Health Check API
echo -e "${YELLOW}[Test 1/3] Health Check API${NC}"
echo "GET $BASE_URL/api/health"
RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/api/health)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ Status: $HTTP_CODE${NC}"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Status: $HTTP_CODE${NC}"
fi
echo ""

# 2. Self Diagnosis API
echo -e "${YELLOW}[Test 2/3] Self Diagnosis API${NC}"
echo "POST $BASE_URL/api/diagnosis/self"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/diagnosis/self \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "test-company-001",
    "industryType": "ELECTRONICS",
    "employeeCount": 150,
    "annualRevenue": 50000000000,
    "answers": [
      {"questionId": "Q001", "agonyType": "QUALITY", "score": 4},
      {"questionId": "Q002", "agonyType": "EQUIPMENT", "score": 3},
      {"questionId": "Q003", "agonyType": "PROCESS", "score": 5},
      {"questionId": "Q004", "agonyType": "SAFETY", "score": 2},
      {"questionId": "Q005", "agonyType": "LABOR", "score": 4}
    ]
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ Status: $HTTP_CODE${NC}"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Status: $HTTP_CODE${NC}"
    echo "$BODY"
fi
echo ""

# 3. ROI Simulation API
echo -e "${YELLOW}[Test 3/3] ROI Simulation API${NC}"
echo "POST $BASE_URL/api/diagnosis/roi-simulation"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/diagnosis/roi-simulation \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosisId": "test-diagnosis-001",
    "laborCost": 5000,
    "defectRate": 5.5,
    "energyCost": 800,
    "carbonEmission": 120,
    "solutionType": "CUSTOM"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ Status: $HTTP_CODE${NC}"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Status: $HTTP_CODE${NC}"
    echo "$BODY"
fi
echo ""

echo -e "${BLUE}=== API 테스트 완료 ===${NC}"
