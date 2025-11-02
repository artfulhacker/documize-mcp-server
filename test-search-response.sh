#!/bin/bash
API_URL="https://warp.proctor.haus"
CREDENTIALS="Om1pa2VAcHJvY3RvcmlvLmNvbTpoaTBLQVVNMndhbCpjcnVo"

# Get auth token
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/api/public/authenticate" \
  -H "Authorization: Basic $CREDENTIALS" -H "Content-Type: application/json")
TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Testing search with actual response..."
echo ""

# Test search and show full response
echo "Search for 'test':"
curl -s -X POST "$API_URL/api/search" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keywords":"test"}' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Try with empty search
echo "Search with empty keywords:"
curl -s -X POST "$API_URL/api/search" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keywords":""}' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Try searching for something that definitely exists
echo "Search for 'documize':"
curl -s -X POST "$API_URL/api/search" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keywords":"documize"}' | python3 -m json.tool
