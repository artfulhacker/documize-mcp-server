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

## [1.1.0] - 2025-11-02

### Added
- **Complete Unit Test Suite**: 68 comprehensive unit tests with 92.68% code coverage
  - Test coverage for all service modules
  - Vitest testing framework with UI and coverage reporting
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:ui`, `npm run test:coverage`
- **24 MCP Tools** providing full Documize API coverage:
  - **Document Tools** (4): get_document, list_documents, update_document, delete_document
  - **Page Tools** (5): get_pages, get_page, create_page, update_page, delete_page
  - **Space Tools** (4): list_spaces, get_space, create_space, delete_space
  - **User Tools** (3): list_users, create_user, delete_user
  - **Group Tools** (2): list_groups, join_group, leave_group
  - **Import Tool** (1): import_document - supports HTML, Markdown, Word docs (only way to create documents)
  - **Export Tools** (3): export_pdf, export_html, export_docx
  - **Search Tool** (1): search across documents, spaces, and attachments
- **Automatic Retry Logic**: 502 Bad Gateway errors are automatically retried once after 1 second delay
- **Integration Tests**: Comprehensive integration test suite with 85% pass rate (17/20 tests)

**Note:** Document creation is only possible via `import_document`. The Documize API does not support direct document creation.

### Fixed
- Document import functionality now properly handles HTML, Markdown, and Word file uploads
- Page creation now uses correct nested payload structure with `page` property
- API error handling improved with better error messages and retry logic
- All service implementations aligned with actual Documize API specifications

### Changed
- Removed `package-lock.json` from repository (added to `.gitignore`)
- Enhanced error handling across all API calls
- Improved TypeScript type definitions for better IDE support
- Updated all documentation with complete tool listings and examples

### Development
- Added comprehensive unit tests for all services
- Added integration test suite for end-to-end validation
- Improved test coverage reporting and tooling
- Enhanced development workflow with better test scripts

## [Unreleased]

### Planned
- Batch operations for bulk document management
- Template management
- Advanced search filters (by date, author, etc.)
- Webhook support for real-time updates
- Caching for improved performance
- Rate limiting
- HTTP/SSE transport support for remote servers

---

[1.1.0]: https://github.com/artfulhacker/documize-mcp-server/releases/tag/v1.1.0
[1.0.1]: https://github.com/artfulhacker/documize-mcp-server/releases/tag/v1.0.1
[1.0.0]: https://github.com/artfulhacker/documize-mcp-server/releases/tag/v1.0.0
