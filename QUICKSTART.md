# Quick Start Guide

Get up and running with Documize MCP Server in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Documize instance with API access
- Domain (usually empty for self-hosted), email, and password

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

The authentication accepts Base64 encoded string with format: `domain:email:password`

**Important:** The `domain` field is usually **empty** for self-hosted single-tenant Documize instances (which is normal for most installations).

```bash
# For self-hosted instances (domain is empty - note the leading colon)
echo -n ":email:password" | base64
```

Example with real values:
```bash
# Self-hosted (domain empty)
echo -n ":user@example.com:password123" | base64
# Output: OnVzZXJAZXhhbXBsZS5jb206cGFzc3dvcmQxMjM=

# Multi-tenant (with domain)
echo -n "my-domain:user@example.com:password123" | base64
# Output: bXktZG9tYWluOnVzZXJAZXhhbXBsZS5jb206cGFzc3dvcmQxMjM=
```

### Step 2: Create .env File

```bash
DOCUMIZE_API_URL=https://your-instance.documize.com
DOCUMIZE_API_CREDENTIALS=OnVzZXJAZXhhbXBsZS5jb206cGFzc3dvcmQxMjM=
```

**Note:** For self-hosted instances, the domain is typically empty (leading colon in the format).

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

## Example Usage

### Basic Queries

Ask Claude or Copilot:
- "List all my Documize spaces"
- "Search for documents about API authentication"
- "Import this HTML content as a new document in the Engineering space"
- "Show me document abc123"
- "Export document xyz789 as PDF"

### Document Management

**Note:** Documents can only be created by importing files (HTML, Markdown, or Word). Direct document creation is not supported by the Documize API.

```
Import this content into the Engineering space as a new document called "Project Plan":
<h1>Project Overview</h1>
<p>This is a test document.</p>
```

### Page Management

```
Add a new page to document abc123:
- Title: "Introduction"
- Content: "<h1>Welcome</h1><p>This is the intro.</p>"
- Level: 1
- Sequence: 1
```

### Import Documents

**Important:** This is the ONLY way to create new documents in Documize.

```
Import this markdown file into the Documentation space:
# Getting Started
Welcome to our documentation!
```

### User & Group Management

```
List all users in the organization
```

```
Add user xyz to the Engineering group
```

### Search

```
Search for all documents containing "authentication" in the Security space
```

## All Available Tools (24 Total)

**Documents** (4): get_document, list_documents, update_document, delete_document  
**Pages** (5): get_pages, get_page, create_page, update_page, delete_page  
**Spaces** (4): list_spaces, get_space, create_space, delete_space  
**Users** (3): list_users, create_user, delete_user  
**Groups** (2): list_groups, join_group, leave_group  
**Import/Export** (4): import_document, export_pdf, export_html, export_docx  
**Search** (1): search

**Note:** Documents can only be created via `import_document`. Direct document creation is not supported by the Documize API.

See [docs/API-REFERENCE.md](docs/API-REFERENCE.md) for complete documentation of all tools.

## Troubleshooting

### Authentication Errors

1. Verify credentials are correct
2. Check domain field (usually empty for self-hosted: `:email:password`)
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
