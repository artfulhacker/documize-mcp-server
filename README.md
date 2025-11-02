# Documize MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with the Documize API. This server enables AI assistants like Claude to interact with your Documize knowledge base - search documents, manage spaces, handle attachments, and more.

[![npm version](https://badge.fury.io/js/documize-mcp-server.svg)](https://www.npmjs.com/package/documize-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔍 **Search**: Full-text search across documents and content
- 📄 **Documents**: Create, read, update, and delete documents
- 📁 **Spaces**: Manage spaces and permissions
- 📎 **Attachments**: Upload and manage file attachments
- 👥 **Users**: User and group management
- 🏷️ **Categories**: Organize with labels and categories

## Quick Start

### Installation

```bash
npm install -g documize-mcp-server
```

### Configuration

1. **Get your Documize credentials**:
   - Domain (usually empty for self-hosted instances)
   - Email
   - Password

2. **Encode credentials**:
   ```bash
   # For self-hosted (domain is empty)
   echo -n ":email:password" | base64
   
   # For multi-tenant (with domain)
   echo -n "domain:email:password" | base64
   ```

3. **Configure for Claude Desktop**:
   
   Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "documize": {
         "command": "documize-mcp-server",
         "env": {
           "DOCUMIZE_API_URL": "https://your-instance.com",
           "DOCUMIZE_API_CREDENTIALS": "your-base64-credentials"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### VS Code GitHub Copilot

1. **Install the server**:
   ```bash
   npm install -g documize-mcp-server
   ```

2. **Configure** `.vscode/mcp.json` in your workspace:
   ```json
   {
     "mcpServers": {
       "documize": {
         "command": "documize-mcp-server",
         "env": {
           "DOCUMIZE_API_URL": "https://your-instance.com",
           "DOCUMIZE_API_CREDENTIALS": "your-base64-credentials"
         }
       }
     }
   }
   ```

3. **Reload VS Code**

## Available Tools

### Search
- `documize_search` - Search documents and content

### Documents
- `documize_get_document` - Get document by ID
- `documize_create_document` - Create new document
- `documize_update_document` - Update document content
- `documize_delete_document` - Delete document

### Spaces
- `documize_list_spaces` - List all spaces
- `documize_get_space` - Get space details

### Attachments
- `documize_list_attachments` - List document attachments
- `documize_upload_attachment` - Upload new attachment
- `documize_delete_attachment` - Delete attachment

### Users
- `documize_list_users` - List organization users

## Usage Examples

See [QUICKSTART.md](QUICKSTART.md) for detailed examples.

### Search Documents
```
Search for documents about "project requirements"
```

### Create Document
```
Create a document titled "Meeting Notes" in the Engineering space
```

### Upload Attachment
```
Upload the file report.pdf to document abc123
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- A Documize instance with API access

### Setup
```bash
git clone https://github.com/artfulhacker/documize-mcp-server.git
cd documize-mcp-server
npm install
```

### Build
```bash
npm run build
```

### Test with MCP Inspector
```bash
npm run inspector
```

## API Documentation

- [Documize API Docs](https://docs.documize.com/s/WtXNJ7dMOwABe2UK/api)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for security considerations and best practices.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- **Repository**: https://github.com/artfulhacker/documize-mcp-server
- **Issues**: https://github.com/artfulhacker/documize-mcp-server/issues
- **NPM**: https://www.npmjs.com/package/documize-mcp-server

## Acknowledgments

Built with the [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic.

---

**Made by [@artfulhacker](https://github.com/artfulhacker)**
