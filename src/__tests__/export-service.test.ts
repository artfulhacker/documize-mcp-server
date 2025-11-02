import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExportService } from '../services/export-service.js';
import { ApiClient } from '../services/api-client.js';

describe('ExportService', () => {
  let exportService: ExportService;
  let mockApiClient: any;

  const mockHtmlContent = '<html><body><h1>Document Title</h1><p>Content here</p></body></html>';

  beforeEach(() => {
    mockApiClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    exportService = new ExportService('https://api.documize.com', 'credentials');
    Object.assign(exportService, mockApiClient);
  });

  describe('exportDocuments', () => {
    it('should call POST /api/export with multiple document IDs', async () => {
      const postSpy = vi.spyOn(exportService as any, 'post').mockResolvedValue(mockHtmlContent);

      const result = await exportService.exportDocuments('space1', ['doc1', 'doc2']);

      expect(postSpy).toHaveBeenCalledWith('/api/export', {
        spaceId: 'space1',
        data: ['doc1', 'doc2'],
        filterType: 'document'
      });
      expect(result).toEqual(mockHtmlContent);
    });

    it('should call POST /api/export with single document ID', async () => {
      const postSpy = vi.spyOn(exportService as any, 'post').mockResolvedValue(mockHtmlContent);

      const result = await exportService.exportDocuments('space1', ['doc1']);

      expect(postSpy).toHaveBeenCalledWith('/api/export', {
        spaceId: 'space1',
        data: ['doc1'],
        filterType: 'document'
      });
      expect(result).toEqual(mockHtmlContent);
    });

    it('should handle response with data property', async () => {
      const responseWithData = { data: mockHtmlContent };
      const postSpy = vi.spyOn(exportService as any, 'post').mockResolvedValue(responseWithData);

      const result = await exportService.exportDocuments('space1', ['doc1']);

      expect(result).toEqual(mockHtmlContent);
    });

    it('should handle export errors', async () => {
      const postSpy = vi.spyOn(exportService as any, 'post').mockRejectedValue(
        new Error('Export failed')
      );

      await expect(exportService.exportDocuments('space1', ['doc1'])).rejects.toThrow('Export failed');
    });
  });

  describe('exportDocumentAsPdf', () => {
    it('should call exportDocuments with single document ID', async () => {
      const exportSpy = vi.spyOn(exportService, 'exportDocuments').mockResolvedValue(mockHtmlContent);

      const result = await exportService.exportDocumentAsPdf('space1', 'doc1');

      expect(exportSpy).toHaveBeenCalledWith('space1', ['doc1']);
      expect(result).toEqual(mockHtmlContent);
    });
  });

  describe('exportDocumentAsHtml', () => {
    it('should call exportDocuments with single document ID', async () => {
      const exportSpy = vi.spyOn(exportService, 'exportDocuments').mockResolvedValue(mockHtmlContent);

      const result = await exportService.exportDocumentAsHtml('space1', 'doc1');

      expect(exportSpy).toHaveBeenCalledWith('space1', ['doc1']);
      expect(result).toEqual(mockHtmlContent);
    });
  });

  describe('exportDocumentAsDocx', () => {
    it('should call exportDocuments with single document ID', async () => {
      const exportSpy = vi.spyOn(exportService, 'exportDocuments').mockResolvedValue(mockHtmlContent);

      const result = await exportService.exportDocumentAsDocx('space1', 'doc1');

      expect(exportSpy).toHaveBeenCalledWith('space1', ['doc1']);
      expect(result).toEqual(mockHtmlContent);
    });
  });
});
