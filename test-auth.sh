#!/bin/bash

# Test Authentication Flow
# This script demonstrates how the Documize API authentication works

echo "🔐 Documize API Authentication Test"
echo "===================================="
echo ""

# Check if credentials are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: ./test-auth.sh <org-id> <email> <password> <api-url>"
    echo ""
    echo "Example:"
    echo "  ./test-auth.sh demo api@example.org test https://demo.documize.com"
    echo ""
    exit 1
fi

ORG_ID="$1"
EMAIL="$2"
PASSWORD="$3"
API_URL="${4:-https://demo.documize.com}"

echo "📝 Credentials:"
echo "  Org ID: $ORG_ID"
echo "  Email: $EMAIL"
echo "  Password: ${PASSWORD:0:3}***"
echo "  API URL: $API_URL"
echo ""

# Step 1: Encode credentials
echo "🔧 Step 1: Encoding credentials..."
CREDENTIALS=$(echo -n "$ORG_ID:$EMAIL:$PASSWORD" | base64)
echo "  Format: $ORG_ID:$EMAIL:$PASSWORD"
echo "  Base64: $CREDENTIALS"
echo ""

# Step 2: Authenticate
echo "🔑 Step 2: Authenticating to get Bearer token..."
AUTH_RESPONSE=$(curl -s -X POST \
  "$API_URL/api/public/authenticate" \
  -H "Authorization: Basic $CREDENTIALS" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$AUTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$AUTH_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" != "200" ]; then
    echo "  ❌ Authentication failed!"
    echo "  HTTP Status: $HTTP_STATUS"
    echo "  Response: $RESPONSE_BODY"
    echo ""
    echo "  Common issues:"
    echo "  - Wrong organization ID"
    echo "  - Incorrect email or password"
    echo "  - API URL is incorrect"
    echo "  - Account doesn't have API access"
    exit 1
fi

TOKEN=$(echo "$RESPONSE_BODY" | jq -r '.token' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "  ❌ Could not extract token from response"
    echo "  Response: $RESPONSE_BODY"
    exit 1
fi

echo "  ✅ Authentication successful!"
echo "  Token: ${TOKEN:0:20}..."
echo ""

# Step 3: Test API call with Bearer token
echo "📋 Step 3: Testing API call with Bearer token..."
SPACES_RESPONSE=$(curl -s -X GET \
  "$API_URL/api/space" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$SPACES_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$SPACES_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" != "200" ]; then
    echo "  ❌ API call failed!"
    echo "  HTTP Status: $HTTP_STATUS"
    echo "  Response: $RESPONSE_BODY"
    exit 1
fi

echo "  ✅ API call successful!"
echo "  Spaces found: $(echo "$RESPONSE_BODY" | jq '. | length' 2>/dev/null || echo "N/A")"
echo ""

# Step 4: Show how to use with MCP server
echo "🚀 Step 4: How to use with MCP server"
echo ""
echo "  Set these environment variables:"
echo ""
echo "  export DOCUMIZE_API_URL=\"$API_URL\""
echo "  export DOCUMIZE_API_CREDENTIALS=\"$CREDENTIALS\""
echo ""
echo "  Or add to .env file:"
echo ""
echo "  DOCUMIZE_API_URL=$API_URL"
echo "  DOCUMIZE_API_CREDENTIALS=$CREDENTIALS"
echo ""
echo "  Then run:"
echo "  npm run inspector"
echo ""

echo "✅ Authentication test completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "  1. Copy the credentials above to your .env file"
echo "  2. Run: npm run inspector"
echo "  3. Try the 'list_spaces' tool"
