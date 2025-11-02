# Quick Start Guide

Get up and running with Documize MCP Server in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Documize instance with API access
- Organization ID, email, and password

## Installation

### Global Installation

```bash
npm install -g documize-mcp-server
```

### Local Development

```bash
git clone https://github.com/artfulhacker/documize-mcp-server.git
cd documize-mcp-server
npm install
npm run build
```

## Configuration

### Step 1: Encode Credentials

```bash
echo -n "org-id:email:password" | base64
```

Example:
```bash
echo -n "my-org:user@example.com:password123" | base64
# Output: bXktb3JnOnVzZXJAZXhhbXBsZS5jb206cGFzc3dvcmQxMjM=
```

### Step 2: Create .env File

```bash
DOCUMIZE_API_URL=https://your-instance.documize.com
DOCUMIZE_API_CREDENTIALS=bXktb3JnOnVzZXJAZXhhbXBsZS5jb206cGFzc3dvcmQxMjM=
```

## Claude Desktop Setup

Edit your Claude Desktop config:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "documize": {
      "command": "documize-mcp-server",
      "env": {
        "DOCUMIZE_API_URL": "https://your-instance.documize.com",
        "DOCUMIZE_API_CREDENTIALS": "your-base64-credentials"
      }
    }
  }
}
```

Restart Claude Desktop after saving.

## Test Authentication

```bash
./test-auth.sh
```

## Example Usage

Ask Claude:
- "List all my Documize spaces"
- "Search for documents about API authentication"
- "Create a document called 'Getting Started' in the Engineering space"
- "Show me document abc123"

## Troubleshooting

### Authentication Errors

1. Verify credentials are correct
2. Check organization ID (visible in Documize URL)
3. Ensure Base64 encoding has no extra spaces/newlines

### Connection Issues

1. Verify DOCUMIZE_API_URL is accessible
2. Check firewall/network settings
3. Ensure Documize instance is running

### Claude Desktop Issues

1. Validate JSON syntax in config file
2. Ensure `documize-mcp-server` is in PATH
3. Restart Claude Desktop completely
4. Check Claude Desktop logs

## Development Mode

```bash
npm run build
npm run inspector
```

Use MCP Inspector to test the server.

## Next Steps

- [README](./README.md) - Full documentation
- [CONTRIBUTING](./CONTRIBUTING.md) - Contribute to the project
- [SECURITY](./SECURITY.md) - Security policies

## Support

- GitHub Issues: https://github.com/artfulhacker/documize-mcp-server/issues
- Repository: https://github.com/artfulhacker/documize-mcp-server
