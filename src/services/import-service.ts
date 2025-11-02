import { ApiClient } from "./api-client.js";
import FormData from 'form-data';

/**
 * Service for importing/uploading documents to Documize
 * 
 * Documents in Documize are created by uploading files which are then
 * converted to the internal format. Supported formats include:
 * - HTML (.html, .htm)
 * - Markdown (.md, .markdown)
 * - Microsoft Word (.doc, .docx)
 */
export class ImportService extends ApiClient {

  /**
   * Upload and import a document file
   * 
   * @param spaceId - ID of the space to import document into
   * @param filename - Name of the file (must include extension)
   * @param fileContent - File content as string or Buffer
   * @returns Promise<Document> - The created document
   * 
   * Endpoint: POST /api/import/folder/{spaceId}
   * 
   * Supported file extensions:
   * - .html, .htm (HTML documents)
   * - .md, .markdown (Markdown documents)
   * - .doc, .docx (Microsoft Word - requires conversion service)
   * 
   * Example:
   * ```typescript
   * const document = await importService.importDocument(
   *   'VzMuyEw_EeSWww',
   *   'test.html',
   *   '<h1>Hello World</h1><p>This is a test document.</p>'
   * );
   * ```
   */
  async importDocument(spaceId: string, filename: string, fileContent: string | Buffer): Promise<any> {
    const form = new FormData();
    
    // Add file to form data
    form.append('attachment', fileContent, {
      filename: filename,
      contentType: this.getContentType(filename)
    });

    const response = await this.client.post(
      `/api/import/folder/${spaceId}`,
      form,
      {
        headers: {
          ...form.getHeaders()
        }
      }
    );

    return response.data;
  }

  /**
   * Helper to determine content type from filename
   */
  private getContentType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    
    switch (ext) {
      case 'html':
      case 'htm':
        return 'text/html';
      case 'md':
      case 'markdown':
        return 'text/markdown';
      case 'doc':
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream';
    }
  }
}
