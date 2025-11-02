import { ApiClient } from "./api-client.js";

export interface SearchResult {
  id: string;
  type: "document" | "space" | "attachment";
  title: string;
  excerpt: string;
  spaceId?: string;
  spaceName?: string;
  documentId?: string;
}

/**
 * Service for searching across Documize content
 */
export class SearchService extends ApiClient {
  /**
   * Search across documents, spaces, and attachments
   */
  async search(query: string, spaceId?: string): Promise<SearchResult[]> {
    const params: any = {
      keywords: query,
    };

    if (spaceId) {
      params.spaceId = spaceId;
    }

    const queryString = new URLSearchParams(params).toString();
    return this.get<SearchResult[]>(`/api/search?${queryString}`);
  }
}
