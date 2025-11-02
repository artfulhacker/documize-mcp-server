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
    const body: any = {
      keywords: query,
    };

    if (spaceId) {
      body.spaceId = spaceId;
    }

    return this.post<SearchResult[]>(`/api/search`, body);
  }
}
