import { ApiClient } from "./api-client.js";

export interface SearchResult {
  documentId: string;
  document: string;
  excerpt: string;
  spaceId: string;
  space: string;
  tags: string;
}

export interface SearchParams {
  keywords: string;
  content?: boolean;
  doc?: boolean;
  tag?: boolean;
  attachment?: boolean;
  spaceId?: string;
}

/**
 * Service for searching across Documize content
 */
export class SearchService extends ApiClient {
  /**
   * Search across documents, spaces, and attachments
   */
  async search(params: SearchParams): Promise<SearchResult[]> {
    const body = {
      keywords: params.keywords,
      content: params.content !== undefined ? params.content : true,
      doc: params.doc !== undefined ? params.doc : true,
      tag: params.tag !== undefined ? params.tag : true,
      attachment: params.attachment !== undefined ? params.attachment : false,
      spaceId: params.spaceId || "",
    };

    return this.post<SearchResult[]>(`/api/search`, body);
  }
}
