#!/bin/bash
API_URL="https://warp.proctor.haus"
CREDENTIALS="Om1pa2VAcHJvY3RvcmlvLmNvbTpoaTBLQVVNMndhbCpjcnVo"

# Get auth token
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/api/public/authenticate" \
  -H "Authorization: Basic $CREDENTIALS" -H "Content-Type: application/json")
TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Raw spaces response:"
curl -s -X GET "$API_URL/api/spaces" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "Raw search response:"
curl -s -X POST "$API_URL/api/search" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keywords":"test"}'
