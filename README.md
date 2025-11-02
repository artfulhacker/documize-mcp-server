# Documize MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with the Documize API. This server enables AI assistants like Claude to interact with your Documize knowledge base - search documents, manage spaces, handle attachments, and more.

[![npm version](https://badge.fury.io/js/documize-mcp-server.svg)](https://www.npmjs.com/package/documize-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔍 **Search**: Full-text search across documents and content
- 📄 **Documents**: Complete CRUD operations for documents
- 📝 **Pages**: Granular page-level content management
- 📁 **Spaces**: Manage spaces and permissions
- 📎 **Import/Export**: Import documents (HTML/Markdown/Word) and export (PDF/HTML/DOCX)
- 👥 **Users & Groups**: User and group management
- 🧪 **Well-Tested**: 92.68% code coverage with comprehensive unit tests
- � **Reliable**: Automatic retry logic for transient errors

## Complete Tool List (24 Tools)

### Documents (4 tools)
- `get_document` - Get document by ID with content and metadata
- `list_documents` - List all documents in a space
- `update_document` - Update existing document
- `delete_document` - Delete a document

**Note:** Documents can only be created via `import_document` (see Import/Export tools)

### Pages (5 tools)
- `get_pages` - Get all pages in a document
- `get_page` - Get a specific page
- `create_page` - Create new page with HTML content
- `update_page` - Update existing page
- `delete_page` - Delete a page

### Spaces (4 tools)
- `list_spaces` - List all available spaces
- `get_space` - Get space details
- `create_space` - Create new space
- `delete_space` - Delete a space

### Users (3 tools)
- `list_users` - List all users
- `create_user` - Create new user
- `delete_user` - Delete a user

### Groups (2 tools)
- `list_groups` - List all groups
- `join_group` - Add user to group
- `leave_group` - Remove user from group

### Import/Export (4 tools)
- `import_document` - Import HTML, Markdown, or Word files (creates new documents)
- `export_pdf` - Export document as PDF
- `export_html` - Export document as HTML
- `export_docx` - Export document as DOCX

**Note:** Document creation is only possible via `import_document`

### Search (1 tool)
- `search` - Full-text search across documents, spaces, and attachments

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

## Usage Examples

See [QUICKSTART.md](QUICKSTART.md) for detailed examples and [docs/API-REFERENCE.md](docs/API-REFERENCE.md) for complete API documentation.

### Search Documents
```
Search for documents about "project requirements"
```

### Import Document (Create)
```
Import this HTML file into the Engineering space to create a new document:
<h1>Meeting Notes</h1><p>Discussion about project requirements...</p>
```

### Manage Pages
```
Add a new section to document abc123 with title "Introduction"
```

### Import Document
```
Import the markdown file README.md into the Documentation space
```

### Export Document
```
Export document abc123 as PDF
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

### Testing

Run the full test suite with coverage:
```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with interactive UI
npm run test:coverage # Run with coverage report
```

**Test Coverage**: 92.68% (68 tests across 7 test suites)

### Integration Testing

Run integration tests against a live Documize instance:
```bash
npm run integration-test
```

**Note**: Integration tests require valid credentials in `.env` file.

### Test with MCP Inspector
```bash
npm run inspector
```

## API Documentation

- [Complete API Reference](docs/API-REFERENCE.md) - All 24 tools documented
- [Documize API Docs](https://docs.documize.com/s/WtXNJ7dMOwABe2UK/api)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Project Status

**Version**: 1.1.0  
**Status**: Production Ready  
**Test Coverage**: 92.68% (68 unit tests + integration tests)  
**Tools**: 24 MCP tools covering complete Documize API  
**Features**: Auto-retry logic, comprehensive error handling, full TypeScript support

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
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

## Acknowledgments

Built with the [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic.

---

**Made by [@artfulhacker](https://github.com/artfulhacker)**
