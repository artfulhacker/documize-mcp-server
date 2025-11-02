# Documize MCP Server - API Reference

This document provides a complete reference for all 24 MCP tools available in the Documize MCP Server, along with the underlying Documize REST API endpoints.

**Version**: 1.1.0  
**Tools**: 24 MCP tools  
**Coverage**: Complete Documize API integration

## MCP Tools Overview

The server provides 24 tools organized into these categories:

- **Documents** (4): get_document, list_documents, update_document, delete_document
- **Pages** (5): get_pages, get_page, create_page, update_page, delete_page
- **Spaces** (4): list_spaces, get_space, create_space, delete_space
- **Users** (3): list_users, create_user, delete_user
- **Groups** (2): list_groups, join_group, leave_group
- **Import/Export** (4): import_document, export_pdf, export_html, export_docx
- **Search** (1): search

**Note:** Documents can only be created via `import_document`. The Documize API does not support direct document creation.

---

## Authentication

All API requests (except authentication) require a Bearer token obtained through Basic Authentication.

### POST /api/public/authenticate

Authenticate and receive a Bearer token.

**Headers:**
- `Authorization: Basic {base64-encoded-credentials}`
  - Credentials format: `domain:email:password`
  - For self-hosted instances, domain is usually empty: `:email:password`

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Spaces

Spaces are containers for documents and their permissions.

### GET /api/space

Get all spaces accessible to the authenticated user.

**Response:** Array of space objects

```json
[
  {
    "id": "VqXNJ7dM",
    "name": "Engineering Team",
    "orgId": "...",
    "created": "2024-01-01T00:00:00Z",
    "revised": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/space/{id}

Get a specific space by ID.

**Response:** Space object

### POST /api/space

Create a new space.

**Body:**
```json
{
  "name": "My New Space",
  "cloneId": "",
  "copyTemplate": false,
  "copyPermission": false,
  "copyDocument": false
}
```

**Response:** Created space object

### DELETE /api/space/{id}

Delete a space by ID.

**Response:** 200 OK

---

## Documents

Documents contain pages of content within a space.

### GET /api/documents?space={spaceId}

Get all documents in a specific space.

**Query Parameters:**
- `space` - The space ID to filter by

**Response:** Array of document objects

```json
[
  {
    "id": "VsPsbte6",
    "orgId": "...",
    "folderId": "VqXNJ7dM",
    "name": "Requirements Document",
    "excerpt": "This document outlines...",
    "created": "2024-01-01T00:00:00Z",
    "revised": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/documents/{id}

Get document metadata by ID.

**Response:** Document object

### PUT /api/documents/{id}

Update a document's metadata.

**Body:** Full document object with updated fields

```json
{
  "id": "VsPsbte6",
  "name": "Updated Document Name",
  "excerpt": "Updated description",
  "folderId": "VqXNJ7dM",
  ...
}
```

**Response:** Updated document object

### DELETE /api/documents/{id}

Delete a document by ID.

**Response:** 200 OK

### GET /api/documents/{id}/pages

Get all pages (content) for a document.

**Response:** Array of page objects

```json
[
  {
    "id": "Wk0qTYh1",
    "documentId": "Wk0qFYh1",
    "title": "Introduction",
    "body": "<p>Page content...</p>",
    "contentType": "wysiwyg",
    "pageType": "section",
    "level": 1,
    "sequence": 1.0
  }
]
```

### GET /api/documents/{documentId}/pages/{pageId}

Get a specific page by ID.

**Response:** Page object

### POST /api/documents/{documentId}/pages

Add a new page to a document.

**Body:**
```json
{
  "documentId": "Wk0qFYh1",
  "title": "New Section",
  "body": "<p>Content here...</p>",
  "contentType": "wysiwyg",
  "pageType": "section",
  "level": 1,
  "sequence": 2.0
}
```

**Response:** Created page object

### PUT /api/documents/{documentId}/pages/{pageId}

Update a page's content.

**Body:** Full page object with updated fields

**Response:** Updated page object

### DELETE /api/documents/{documentId}/pages/{pageId}

Delete a page by ID.

**Response:** 200 OK

---

## Search

### POST /api/search

Search across documents, attachments, and tags.

**Body:**
```json
{
  "keywords": "search terms",
  "content": true,
  "doc": true,
  "tag": true,
  "attachment": false,
  "spaceId": ""
}
```

**Parameters:**
- `keywords` - Search query string
- `content` - Search within page content
- `doc` - Search document names and excerpts
- `tag` - Search document tags
- `attachment` - Search attachment names
- `spaceId` - Optional: limit search to specific space

**Response:** Array of search result objects

```json
[
  {
    "documentId": "VsPsbte6",
    "document": "Requirements Document",
    "excerpt": "...matching content...",
    "spaceId": "VqXNJ7dM",
    "space": "Engineering Team",
    "tags": "#api#documentation#"
  }
]
```

---

## Users

Manage users and their permissions.

### GET /api/users

Get all users in the organization.

**Response:** Array of user objects

```json
[
  {
    "id": "WtW kUqIF",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "created": "2024-01-01T00:00:00Z",
    "active": true
  }
]
```

### POST /api/users

Create a new user.

**Body:**
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "email": "jane@example.com",
  "viewUsers": true,
  "editor": true,
  "analytics": true,
  "active": true
}
```

**Response:** Created user object

### DELETE /api/users/{id}

Delete a user by ID.

**Response:** 200 OK

---

## Groups

User groups for permission management.

### GET /api/group

Get all groups in the organization.

**Response:** Array of group objects

### POST /api/group/{groupId}/join/{userId}

Add a user to a group.

**Response:** 200 OK

### DELETE /api/group/{groupId}/leave/{userId}

Remove a user from a group.

**Response:** 200 OK

---

## Export

Export documents to various formats.

### POST /api/export/pdf/document/{documentId}

Export a document as PDF.

**Response:** PDF file (binary)

### POST /api/export/html/document/{documentId}

Export a document as HTML.

**Response:** HTML file

### POST /api/export/docx/document/{documentId}

Export a document as Microsoft Word (.docx).

**Response:** DOCX file (binary)

---

## Common Response Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid or missing authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Notes

- All timestamps are in RFC3339 format (ISO 8601)
- IDs are typically 8-16 character strings
- Bearer tokens expire after a period of inactivity
- The API will return 401 for expired tokens
