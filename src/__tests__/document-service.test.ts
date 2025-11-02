import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentService } from '../services/document-service.js';

// Mock the ApiClient
vi.mock('../services/api-client.js', () => {
  return {
    ApiClient: class MockApiClient {
      protected async get<T>(url: string): Promise<T> {
        return {} as T;
      }
      protected async post<T>(url: string, data?: any): Promise<T> {
        return {} as T;
      }
      protected async put<T>(url: string, data?: any): Promise<T> {
        return {} as T;
      }
      protected async delete(url: string): Promise<void> {
        return;
      }
    }
  };
});

describe('DocumentService', () => {
  let documentService: DocumentService;
  const mockBaseURL = 'https://test.documize.com';
  const mockCredentials = Buffer.from(':test@example.com:password').toString('base64');

  beforeEach(() => {
    vi.clearAllMocks();
    documentService = new DocumentService(mockBaseURL, mockCredentials);
  });

  describe('listDocuments', () => {
    it('should call GET /api/documents with space parameter', async () => {
      const mockDocuments = [
        { id: 'doc1', title: 'Test Document 1', spaceId: 'space1' },
        { id: 'doc2', title: 'Test Document 2', spaceId: 'space1' }
      ];

      const getSpy = vi.spyOn(documentService as any, 'get').mockResolvedValue(mockDocuments);

      const result = await documentService.listDocuments('space1');

      expect(getSpy).toHaveBeenCalledWith('/api/documents?space=space1');
      expect(result).toEqual(mockDocuments);
    });

    it('should handle empty document list', async () => {
      const getSpy = vi.spyOn(documentService as any, 'get').mockResolvedValue([]);

      const result = await documentService.listDocuments('space1');

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getDocument', () => {
    it('should call GET /api/documents/:id', async () => {
      const mockDocument = {
        id: 'doc1',
        title: 'Test Document',
        spaceId: 'space1',
        excerpt: 'Test excerpt'
      };

      const getSpy = vi.spyOn(documentService as any, 'get').mockResolvedValue(mockDocument);

      const result = await documentService.getDocument('doc1');

      expect(getSpy).toHaveBeenCalledWith('/api/documents/doc1');
      expect(result).toEqual(mockDocument);
    });

    it('should handle document not found', async () => {
      const getSpy = vi.spyOn(documentService as any, 'get').mockRejectedValue(
        new Error('Document not found')
      );

      await expect(documentService.getDocument('nonexistent')).rejects.toThrow('Document not found');
    });
  });

  describe('updateDocument', () => {
    it('should call PUT /api/documents/:id with data', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Updated Title',
        excerpt: 'Updated excerpt'
      };

      const putSpy = vi.spyOn(documentService as any, 'put').mockResolvedValue(mockDocument);

      const result = await documentService.updateDocument('doc1', {
        name: 'Updated Title',
        excerpt: 'Updated excerpt'
      });

      expect(putSpy).toHaveBeenCalledWith('/api/documents/doc1', {
        name: 'Updated Title',
        excerpt: 'Updated excerpt'
      });
      expect(result).toEqual(mockDocument);
    });
  });

  describe('deleteDocument', () => {
    it('should call DELETE /api/documents/:id', async () => {
      const deleteSpy = vi.spyOn(documentService as any, 'delete').mockResolvedValue(undefined);

      await documentService.deleteDocument('doc1');

      expect(deleteSpy).toHaveBeenCalledWith('/api/documents/doc1');
    });
  });

  describe('getPages', () => {
    it('should call GET /api/documents/:documentId/pages', async () => {
      const mockPages = [
        { id: 'page1', title: 'Page 1', sequence: 1 },
        { id: 'page2', title: 'Page 2', sequence: 2 }
      ];

      const getSpy = vi.spyOn(documentService as any, 'get').mockResolvedValue(mockPages);

      const result = await documentService.getPages('doc1');

      expect(getSpy).toHaveBeenCalledWith('/api/documents/doc1/pages');
      expect(result).toEqual(mockPages);
    });
  });

  describe('getPage', () => {
    it('should call GET /api/documents/:documentId/pages/:pageId', async () => {
      const mockPage = {
        id: 'page1',
        title: 'Test Page',
        body: 'Page content',
        sequence: 1
      };

      const getSpy = vi.spyOn(documentService as any, 'get').mockResolvedValue(mockPage);

      const result = await documentService.getPage('doc1', 'page1');

      expect(getSpy).toHaveBeenCalledWith('/api/documents/doc1/pages/page1');
      expect(result).toEqual(mockPage);
    });
  });

  describe('createPage', () => {
    it('should call POST /api/documents/:documentId/pages with nested payload', async () => {
      const params = {
        documentId: 'doc1',
        title: 'New Page',
        body: 'Page content',
        level: 1
      };

      const mockResponse = {
        id: 'page1',
        documentId: 'doc1',
        title: 'New Page',
        body: 'Page content'
      };

      const postSpy = vi.spyOn(documentService as any, 'post').mockResolvedValue(mockResponse);

      const result = await documentService.createPage(params);

      expect(postSpy).toHaveBeenCalledWith('/api/documents/doc1/pages', {
        page: {
          documentId: 'doc1',
          title: 'New Page',
          body: 'Page content',
          contentType: 'wysiwyg',
          pageType: 'section',
          level: 1,
          sequence: 1.0
        },
        meta: {
          documentId: 'doc1',
          rawBody: 'Page content',
          config: '{}'
        }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should use default values if not provided', async () => {
      const params = {
        documentId: 'doc1',
        title: 'New Page',
        body: 'Content'
      };

      const postSpy = vi.spyOn(documentService as any, 'post').mockResolvedValue({});

      await documentService.createPage(params);

      expect(postSpy).toHaveBeenCalledWith('/api/documents/doc1/pages', expect.objectContaining({
        page: expect.objectContaining({
          contentType: 'wysiwyg',
          pageType: 'section',
          level: 1,
          sequence: 1.0
        })
      }));
    });
  });

  describe('updatePage', () => {
    it('should call PUT /api/documents/:documentId/pages/:pageId', async () => {
      const pageData = {
        title: 'Updated Page',
        body: 'Updated content'
      };

      const mockResponse = {
        id: 'page1',
        ...pageData
      };

      const putSpy = vi.spyOn(documentService as any, 'put').mockResolvedValue(mockResponse);

      const result = await documentService.updatePage('doc1', 'page1', pageData);

      expect(putSpy).toHaveBeenCalledWith('/api/documents/doc1/pages/page1', pageData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deletePage', () => {
    it('should call DELETE /api/documents/:documentId/pages/:pageId', async () => {
      const deleteSpy = vi.spyOn(documentService as any, 'delete').mockResolvedValue(undefined);

      await documentService.deletePage('doc1', 'page1');

      expect(deleteSpy).toHaveBeenCalledWith('/api/documents/doc1/pages/page1');
    });
  });
});
