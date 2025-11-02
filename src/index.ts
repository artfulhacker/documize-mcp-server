#!/usr/bin/env node

/**
 * Documize MCP Server
 * 
 * A Model Context Protocol server that provides access to Documize documentation platform.
 * Supports searching, reading, and managing documents, spaces, and categories.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import { DocumentService } from "./services/document-service.js";
import { SpaceService } from "./services/space-service.js";
import { SearchService } from "./services/search-service.js";
import { UserService } from "./services/user-service.js";
import { ExportService } from "./services/export-service.js";
import { ImportService } from "./services/import-service.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const API_URL = process.env.DOCUMIZE_API_URL;
const API_CREDENTIALS = process.env.DOCUMIZE_API_CREDENTIALS;

if (!API_URL) {
  console.error("Missing DOCUMIZE_API_URL environment variable");
  process.exit(1);
}

if (!API_CREDENTIALS) {
  console.error("Missing DOCUMIZE_API_CREDENTIALS environment variable");
  console.error("DOCUMIZE_API_CREDENTIALS should be Base64 encoded 'domain:email:password'");
  console.error("Note: domain is usually EMPTY for self-hosted instances");
  console.error("Example: echo -n ':user@example.com:password' | base64");
  process.exit(1);
}

// Initialize services
const documentService = new DocumentService(API_URL, API_CREDENTIALS);
const spaceService = new SpaceService(API_URL, API_CREDENTIALS);
const searchService = new SearchService(API_URL, API_CREDENTIALS);
const userService = new UserService(API_URL, API_CREDENTIALS);
const exportService = new ExportService(API_URL, API_CREDENTIALS);
const importService = new ImportService(API_URL, API_CREDENTIALS);

// Create MCP server
const server = new Server(
  {
    name: "documize-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List all available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Document tools
      {
        name: "get_document",
        description: "Get a specific document by ID, including its content and metadata",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The unique identifier of the document",
            },
          },
          required: ["documentId"],
        },
      },
      {
        name: "list_documents",
        description: "List all documents in a specific space",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The unique identifier of the space",
            },
          },
          required: ["spaceId"],
        },
      },
      {
        name: "update_document",
        description: "Update an existing document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The document ID to update",
            },
            title: {
              type: "string",
              description: "The new title (optional)",
            },
            excerpt: {
              type: "string",
              description: "The new excerpt (optional)",
            },
            content: {
              type: "string",
              description: "The new content (optional)",
            },
          },
          required: ["documentId"],
        },
      },
      {
        name: "delete_document",
        description: "Delete a document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The document ID to delete",
            },
          },
          required: ["documentId"],
        },
      },
      // Space tools
      {
        name: "list_spaces",
        description: "List all available spaces (folders/areas) in the Documize instance",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_space",
        description: "Get details about a specific space",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The unique identifier of the space",
            },
          },
          required: ["spaceId"],
        },
      },
      {
        name: "create_space",
        description: "Create a new space",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the space",
            },
            description: {
              type: "string",
              description: "A description of the space",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "import_document",
        description: "Import/upload a document file to create a new document. Supported formats: HTML (.html, .htm), Markdown (.md, .markdown), Microsoft Word (.doc, .docx)",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The ID of the space to import the document into",
            },
            filename: {
              type: "string",
              description: "The filename with extension (e.g., 'document.html', 'notes.md')",
            },
            content: {
              type: "string",
              description: "The file content as a string",
            },
          },
          required: ["spaceId", "filename", "content"],
        },
      },
      // Search tool
      {
        name: "search",
        description: "Search across documents, spaces, and attachments",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query",
            },
            spaceId: {
              type: "string",
              description: "Optional: Limit search to a specific space",
            },
          },
          required: ["query"],
        },
      },
      // Space delete
      {
        name: "delete_space",
        description: "Delete a space",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The space ID to delete",
            },
          },
          required: ["spaceId"],
        },
      },
      // Page tools
      {
        name: "get_pages",
        description: "Get all pages (content) for a document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The document ID",
            },
          },
          required: ["documentId"],
        },
      },
      {
        name: "get_page",
        description: "Get a specific page from a document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The document ID",
            },
            pageId: {
              type: "string",
              description: "The page ID",
            },
          },
          required: ["documentId", "pageId"],
        },
      },
      {
        name: "create_page",
        description: "Create a new page in a document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The document ID",
            },
            title: {
              type: "string",
              description: "The page title",
            },
            body: {
              type: "string",
              description: "The page content (HTML)",
            },
            level: {
              type: "number",
              description: "Heading level (1-5)",
            },
            sequence: {
              type: "number",
              description: "Page sequence number for ordering",
            },
          },
          required: ["documentId", "title", "body", "level", "sequence"],
        },
      },
      {
        name: "update_page",
        description: "Update an existing page",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The document ID",
            },
            pageId: {
              type: "string",
              description: "The page ID",
            },
            title: {
              type: "string",
              description: "The new page title",
            },
            body: {
              type: "string",
              description: "The new page content (HTML)",
            },
            level: {
              type: "number",
              description: "New heading level",
            },
            sequence: {
              type: "number",
              description: "New sequence number",
            },
          },
          required: ["documentId", "pageId"],
        },
      },
      {
        name: "delete_page",
        description: "Delete a page from a document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: {
              type: "string",
              description: "The document ID",
            },
            pageId: {
              type: "string",
              description: "The page ID to delete",
            },
          },
          required: ["documentId", "pageId"],
        },
      },
      // User tools
      {
        name: "list_users",
        description: "List all users in the Documize instance",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_user",
        description: "Create a new user",
        inputSchema: {
          type: "object",
          properties: {
            firstname: {
              type: "string",
              description: "User's first name",
            },
            lastname: {
              type: "string",
              description: "User's last name",
            },
            email: {
              type: "string",
              description: "User's email address",
            },
          },
          required: ["firstname", "lastname", "email"],
        },
      },
      {
        name: "delete_user",
        description: "Delete a user",
        inputSchema: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "The user ID to delete",
            },
          },
          required: ["userId"],
        },
      },
      // Group tools
      {
        name: "list_groups",
        description: "List all groups in the Documize instance",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "join_group",
        description: "Add a user to a group",
        inputSchema: {
          type: "object",
          properties: {
            groupId: {
              type: "string",
              description: "The group ID",
            },
            userId: {
              type: "string",
              description: "The user ID to add",
            },
          },
          required: ["groupId", "userId"],
        },
      },
      {
        name: "leave_group",
        description: "Remove a user from a group",
        inputSchema: {
          type: "object",
          properties: {
            groupId: {
              type: "string",
              description: "The group ID",
            },
            userId: {
              type: "string",
              description: "The user ID to remove",
            },
          },
          required: ["groupId", "userId"],
        },
      },
      // Export tools
      {
        name: "export_pdf",
        description: "Export a document as PDF",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The space ID containing the document",
            },
            documentId: {
              type: "string",
              description: "The document ID to export",
            },
          },
          required: ["spaceId", "documentId"],
        },
      },
      {
        name: "export_html",
        description: "Export a document as HTML",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The space ID containing the document",
            },
            documentId: {
              type: "string",
              description: "The document ID to export",
            },
          },
          required: ["spaceId", "documentId"],
        },
      },
      {
        name: "export_docx",
        description: "Export a document as DOCX",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The space ID containing the document",
            },
            documentId: {
              type: "string",
              description: "The document ID to export",
            },
          },
          required: ["spaceId", "documentId"],
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    if (!args) {
      throw new McpError(ErrorCode.InvalidParams, "Missing arguments");
    }

    switch (name) {
      // Document operations
      case "get_document": {
        const result = await documentService.getDocument(args.documentId as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "list_documents": {
        const result = await documentService.listDocuments(args.spaceId as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "update_document": {
        const result = await documentService.updateDocument(
          args.documentId as string,
          {
            name: args.title as string | undefined,
            excerpt: args.excerpt as string | undefined,
            tags: args.tags as string | undefined,
          }
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "delete_document": {
        await documentService.deleteDocument(args.documentId as string);
        return {
          content: [
            {
              type: "text",
              text: `Document ${args.documentId} deleted successfully`,
            },
          ],
        };
      }

      // Space operations
      case "list_spaces": {
        const result = await spaceService.listSpaces();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_space": {
        const result = await spaceService.getSpace(args.spaceId as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_space": {
        const result = await spaceService.createSpace({
          name: args.name as string,
          description: args.description as string,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "import_document": {
        const result = await importService.importDocument(
          args.spaceId as string,
          args.filename as string,
          args.content as string
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // Search operations
      case "search": {
        const result = await searchService.search({
          keywords: args.query as string,
          spaceId: args.spaceId as string | undefined,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // Space delete operation
      case "delete_space": {
        await spaceService.deleteSpace(args.spaceId as string);
        return {
          content: [
            {
              type: "text",
              text: "Space deleted successfully",
            },
          ],
        };
      }

      // Page operations
      case "get_pages": {
        const result = await documentService.getPages(args.documentId as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_page": {
        const result = await documentService.getPage(
          args.documentId as string,
          args.pageId as string
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_page": {
        const result = await documentService.createPage({
          documentId: args.documentId as string,
          title: args.title as string,
          body: args.body as string,
          level: args.level as number,
          sequence: args.sequence as number,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "update_page": {
        const result = await documentService.updatePage(
          args.documentId as string,
          args.pageId as string,
          {
            title: args.title as string | undefined,
            body: args.body as string | undefined,
            level: args.level as number | undefined,
            sequence: args.sequence as number | undefined,
          }
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "delete_page": {
        await documentService.deletePage(
          args.documentId as string,
          args.pageId as string
        );
        return {
          content: [
            {
              type: "text",
              text: "Page deleted successfully",
            },
          ],
        };
      }

      // User operations
      case "list_users": {
        const result = await userService.listUsers();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_user": {
        const result = await userService.createUser({
          firstname: args.firstname as string,
          lastname: args.lastname as string,
          email: args.email as string,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "delete_user": {
        await userService.deleteUser(args.userId as string);
        return {
          content: [
            {
              type: "text",
              text: "User deleted successfully",
            },
          ],
        };
      }

      // Group operations
      case "list_groups": {
        const result = await userService.listGroups();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "join_group": {
        await userService.joinGroup(
          args.groupId as string,
          args.userId as string
        );
        return {
          content: [
            {
              type: "text",
              text: "User joined group successfully",
            },
          ],
        };
      }

      case "leave_group": {
        await userService.leaveGroup(
          args.groupId as string,
          args.userId as string
        );
        return {
          content: [
            {
              type: "text",
              text: "User left group successfully",
            },
          ],
        };
      }

      // Export operations
      case "export_pdf": {
        const result = await exportService.exportDocumentAsPdf(
          args.spaceId as string,
          args.documentId as string
        );
        return {
          content: [
            {
              type: "text",
              text: "PDF export completed successfully",
            },
          ],
        };
      }

      case "export_html": {
        const result = await exportService.exportDocumentAsHtml(
          args.spaceId as string,
          args.documentId as string
        );
        return {
          content: [
            {
              type: "text",
              text: "HTML export completed successfully",
            },
          ],
        };
      }

      case "export_docx": {
        const result = await exportService.exportDocumentAsDocx(
          args.spaceId as string,
          args.documentId as string
        );
        return {
          content: [
            {
              type: "text",
              text: "DOCX export completed successfully",
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${errorMessage}`
    );
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr (not stdout, which is used for MCP communication)
  console.error("Documize MCP Server running on stdio");
  console.error(`Connected to: ${API_URL}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
