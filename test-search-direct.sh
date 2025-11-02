#!/bin/bash
API_URL="https://warp.proctor.haus"
CREDENTIALS="Om1pa2VAcHJvY3RvcmlvLmNvbTpoaTBLQVVNMndhbCpjcnVo"

echo "🔍 Testing Documize Search API"
echo ""

# Get auth token
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/api/public/authenticate" \
  -H "Authorization: Basic $CREDENTIALS" -H "Content-Type: application/json")
TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to authenticate"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Test different search approaches
echo "Test 1: POST /api/search with JSON body"
curl -v -X POST "$API_URL/api/search" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keywords":"test"}' 2>&1 | grep -E "< HTTP|keywords"
echo ""

echo "Test 2: GET /api/search?keywords=test"
curl -v -X GET "$API_URL/api/search?keywords=test" \
  -H "Authorization: Bearer $TOKEN" 2>&1 | grep -E "< HTTP"
echo ""

echo "Test 3: POST /api/search with form data"
curl -v -X POST "$API_URL/api/search" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'keywords=test' 2>&1 | grep -E "< HTTP"
echo ""

echo "Test 4: Check if it's /api/searches (plural)"
curl -v -X POST "$API_URL/api/searches" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keywords":"test"}' 2>&1 | grep -E "< HTTP"
