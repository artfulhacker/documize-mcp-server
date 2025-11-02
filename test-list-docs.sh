#!/bin/bash
API_URL="https://warp.proctor.haus"
CREDENTIALS="Om1pa2VAcHJvY3RvcmlvLmNvbTpoaTBLQVVNMndhbCpjcnVo"

# Get auth token
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/api/public/authenticate" \
  -H "Authorization: Basic $CREDENTIALS" -H "Content-Type: application/json")
TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Checking what data exists..."
echo ""

# List spaces
echo "Spaces:"
curl -s -X GET "$API_URL/api/spaces" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -50
echo ""

# Try to get documents from first space
SPACE_ID=$(curl -s -X GET "$API_URL/api/spaces" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "import sys, json; spaces = json.load(sys.stdin); print(spaces[0]['id'] if spaces else '')" 2>/dev/null)

if [ -n "$SPACE_ID" ]; then
    echo "Documents in space $SPACE_ID:"
    curl -s -X GET "$API_URL/api/spaces/$SPACE_ID/documents" \
      -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -30
fi
