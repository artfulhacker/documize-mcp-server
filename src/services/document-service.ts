import { ApiClient } from "./api-client.js";

export interface Document {
  id: string;
  spaceId: string;
  title: string;
  excerpt?: string;
  content?: string;
  created: string;
  revised: string;
}

export interface CreateDocumentParams {
  spaceId: string;
  title: string;
  excerpt?: string;
  content: string;
}

export interface UpdateDocumentParams {
  title?: string;
  excerpt?: string;
  content?: string;
}

/**
 * Service for managing Documize documents
 */
export class DocumentService extends ApiClient {
  /**
   * Get a document by ID
   */
  async getDocument(documentId: string): Promise<Document> {
    return this.get<Document>(`/api/document/${documentId}`);
  }

  /**
   * List all documents in a space
   */
  async listDocuments(spaceId: string): Promise<Document[]> {
    return this.get<Document[]>(`/api/space/${spaceId}/document`);
  }

  /**
   * Create a new document
   */
  async createDocument(params: CreateDocumentParams): Promise<Document> {
    const payload = {
      labelId: params.spaceId,
      title: params.title,
      excerpt: params.excerpt || "",
      body: params.content,
    };

    return this.post<Document>(`/api/document`, payload);
  }

  /**
   * Update an existing document
   */
  async updateDocument(
    documentId: string,
    params: UpdateDocumentParams
  ): Promise<Document> {
    // First get the current document to merge changes
    const current = await this.getDocument(documentId);

    const payload = {
      ...current,
      title: params.title || current.title,
      excerpt: params.excerpt !== undefined ? params.excerpt : current.excerpt,
      body: params.content || current.content,
    };

    return this.put<Document>(`/api/document/${documentId}`, payload);
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    await this.delete(`/api/document/${documentId}`);
  }
}
