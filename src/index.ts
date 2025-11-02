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
import { CategoryService } from "./services/category-service.js";
import { SearchService } from "./services/search-service.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const API_URL = process.env.DOCUMIZE_API_URL;
const API_CREDENTIALS = process.env.DOCUMIZE_API_CREDENTIALS;

if (!API_URL || !API_CREDENTIALS) {
  console.error("Error: DOCUMIZE_API_URL and DOCUMIZE_API_CREDENTIALS must be set in environment variables");
  console.error("DOCUMIZE_API_CREDENTIALS should be Base64 encoded 'orgId:email:password'");
  console.error("Example: echo -n 'demo:api@example.org:test' | base64");
  process.exit(1);
}

// Initialize services
const documentService = new DocumentService(API_URL, API_CREDENTIALS);
const spaceService = new SpaceService(API_URL, API_CREDENTIALS);
const categoryService = new CategoryService(API_URL, API_CREDENTIALS);
const searchService = new SearchService(API_URL, API_CREDENTIALS);

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
        name: "create_document",
        description: "Create a new document in a space",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The space ID where the document will be created",
            },
            title: {
              type: "string",
              description: "The title of the document",
            },
            excerpt: {
              type: "string",
              description: "A brief excerpt or description",
            },
            content: {
              type: "string",
              description: "The document content (supports Markdown)",
            },
          },
          required: ["spaceId", "title", "content"],
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
      // Category tools
      {
        name: "list_categories",
        description: "List all categories in a space",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The space ID to list categories from",
            },
          },
          required: ["spaceId"],
        },
      },
      {
        name: "create_category",
        description: "Create a new category in a space",
        inputSchema: {
          type: "object",
          properties: {
            spaceId: {
              type: "string",
              description: "The space ID where the category will be created",
            },
            name: {
              type: "string",
              description: "The name of the category",
            },
          },
          required: ["spaceId", "name"],
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

      case "create_document": {
        const result = await documentService.createDocument({
          spaceId: args.spaceId as string,
          title: args.title as string,
          excerpt: args.excerpt as string,
          content: args.content as string,
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

      case "update_document": {
        const result = await documentService.updateDocument(
          args.documentId as string,
          {
            title: args.title as string | undefined,
            excerpt: args.excerpt as string | undefined,
            content: args.content as string | undefined,
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

      // Category operations
      case "list_categories": {
        const result = await categoryService.listCategories(args.spaceId as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_category": {
        const result = await categoryService.createCategory({
          spaceId: args.spaceId as string,
          name: args.name as string,
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

      // Search operations
      case "search": {
        const result = await searchService.search(
          args.query as string,
          args.spaceId as string | undefined
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
