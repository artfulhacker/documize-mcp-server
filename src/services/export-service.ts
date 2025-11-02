import { ApiClient } from "./api-client.js";

/**
 * ExportService - Document export functionality
 * 
 * Note: Documize API uses a single POST /api/export endpoint for all formats.
 * The endpoint accepts a JSON body with spaceId, document IDs, and filterType.
 * Returns HTML content by default.
 */
export class ExportService extends ApiClient {
  /**
   * Export documents to HTML format
   * @param spaceId - Space ID containing the documents
   * @param documentIds - Array of document IDs to export
   * @returns HTML content as string
   */
  async exportDocuments(spaceId: string, documentIds: string[]): Promise<string> {
    const response: any = await this.post('/api/export', {
      spaceId: spaceId,
      data: documentIds,
      filterType: 'document'
    });
    return response.data || response;
  }

  /**
   * Export single document as PDF (convenience method)
   * Note: API returns HTML format - PDF conversion would need additional processing
   */
  async exportDocumentAsPdf(spaceId: string, documentId: string): Promise<string> {
    return this.exportDocuments(spaceId, [documentId]);
  }

  /**
   * Export single document as HTML
   */
  async exportDocumentAsHtml(spaceId: string, documentId: string): Promise<string> {
    return this.exportDocuments(spaceId, [documentId]);
  }

  /**
   * Export single document as DOCX (convenience method)
   * Note: API returns HTML format - DOCX conversion would need additional processing
   */
  async exportDocumentAsDocx(spaceId: string, documentId: string): Promise<string> {
    return this.exportDocuments(spaceId, [documentId]);
  }
}

