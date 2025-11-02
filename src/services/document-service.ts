import { ApiClient } from "./api-client.js";

export interface Document {
  id: string;
  orgId: string;
  folderId: string;
  userId?: string;
  name: string;
  excerpt?: string;
  tags?: string;
  created: string;
  revised: string;
  template?: boolean;
  protection?: number;
  approval?: number;
  lifecycle?: number;
}

export interface Page {
  id: string;
  documentId: string;
  title: string;
  body: string;
  contentType: string;
  pageType: string;
  level: number;
  sequence: number;
  created?: string;
  revised?: string;
}

export interface UpdateDocumentParams {
  name?: string;
  excerpt?: string;
  tags?: string;
}

export interface CreatePageParams {
  documentId: string;
  title: string;
  body: string;
  contentType?: string;
  pageType?: string;
  level?: number;
  sequence?: number;
}

export interface UpdatePageParams {
  title?: string;
  body?: string;
  contentType?: string;
  pageType?: string;
  level?: number;
  sequence?: number;
}

export class DocumentService extends ApiClient {
  async listDocuments(spaceId: string): Promise<Document[]> {
    return this.get<Document[]>(`/api/documents?space=${spaceId}`);
  }

  async getDocument(documentId: string): Promise<Document> {
    return this.get<Document>(`/api/documents/${documentId}`);
  }

  async updateDocument(documentId: string, document: Partial<Document>): Promise<Document> {
    return this.put<Document>(`/api/documents/${documentId}`, document);
  }

  async deleteDocument(documentId: string): Promise<void> {
    return this.delete(`/api/documents/${documentId}`);
  }

  async getPages(documentId: string): Promise<Page[]> {
    return this.get<Page[]>(`/api/documents/${documentId}/pages`);
  }

  async getPage(documentId: string, pageId: string): Promise<Page> {
    return this.get<Page>(`/api/documents/${documentId}/pages/${pageId}`);
  }

  async createPage(params: {
    documentId: string;
    title: string;
    body: string;
    level?: number;
    sequence?: number;
    contentType?: string;
    pageType?: string;
  }): Promise<Page> {
    // API expects nested structure: { page: {...}, meta: {...} }
    const payload = {
      page: {
        documentId: params.documentId,
        title: params.title,
        body: params.body,
        contentType: params.contentType || "wysiwyg",
        pageType: params.pageType || "section",
        level: params.level || 1,
        sequence: params.sequence || 1.0,
      },
      meta: {
        documentId: params.documentId,
        rawBody: params.body,
        config: "{}",
      },
    };
    return this.post<Page>(`/api/documents/${params.documentId}/pages`, payload);
  }

  async updatePage(documentId: string, pageId: string, page: Partial<Page>): Promise<Page> {
    return this.put<Page>(`/api/documents/${documentId}/pages/${pageId}`, page);
  }

  async deletePage(documentId: string, pageId: string): Promise<void> {
    return this.delete(`/api/documents/${documentId}/pages/${pageId}`);
  }
}
