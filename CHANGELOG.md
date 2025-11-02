# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-08

### Added
- Initial release of Documize MCP Server
- Document management tools (get, list, create, update, delete)
- Space management tools (list, get, create)
- Category management tools (list, create)
- Search functionality across documents, spaces, and attachments
- TypeScript implementation with full type safety
- STDIO transport for MCP communication
- Support for Claude Desktop integration
- Support for VS Code GitHub Copilot integration
- Environment variable configuration
- Comprehensive documentation (README, INSTALL, CONTRIBUTING, SECURITY)
- Example configurations for various MCP clients
- GitHub Actions CI/CD workflow
- MCP Inspector integration for testing

### Security
- OAuth2-style Bearer token authentication
- Secure credential handling via environment variables
- Automatic token refresh on expiration
- Input validation and sanitization
- Error handling without information leakage

## [1.0.1] - 2025-11-02

### Fixed
- Search API endpoint now uses correct HTTP method (POST instead of GET)
- Search API now sends keywords as JSON body instead of query parameters
- Fixed 405 Method Not Allowed error when using search tool

### Changed
- Updated search implementation to match Documize API requirements
- Improved search tool reliability and error handling

## [Unreleased]

### Planned
- Document attachment support
- Batch operations for bulk document management
- Template management
- User and permission management
- Advanced search filters (by date, author, etc.)
- Webhook support for real-time updates
- Caching for improved performance
- Rate limiting
- HTTP/SSE transport support for remote servers
- Additional Documize API endpoints

---

[1.0.1]: https://github.com/artfulhacker/documize-mcp-server/releases/tag/v1.0.1
[1.0.0]: https://github.com/artfulhacker/documize-mcp-server/releases/tag/v1.0.0
