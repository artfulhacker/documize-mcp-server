import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SearchService } from '../services/search-service.js';
import { ApiClient } from '../services/api-client.js';

describe('SearchService', () => {
  let searchService: SearchService;
  let mockApiClient: any;

  const mockSearchResults = [
    {
      id: 'doc1',
      documentId: 'doc1',
      title: 'Test Document',
      excerpt: 'This is a test document',
      tags: ['test', 'sample']
    },
    {
      id: 'doc2',
      documentId: 'doc2',
      title: 'Another Document',
      excerpt: 'Another test document',
      tags: ['test']
    }
  ];

  beforeEach(() => {
    mockApiClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    searchService = new SearchService('https://api.documize.com', 'credentials');
    Object.assign(searchService, mockApiClient);
  });

  describe('search', () => {
    it('should call POST /api/search with query parameters', async () => {
      const params = { keywords: 'test document' };
      const postSpy = vi.spyOn(searchService as any, 'post').mockResolvedValue(mockSearchResults);

      const result = await searchService.search(params);

      expect(postSpy).toHaveBeenCalledWith('/api/search', {
        keywords: params.keywords,
        content: true,
        doc: true,
        tag: true,
        attachment: false,
        spaceId: ''
      });
      expect(result).toEqual(mockSearchResults);
    });

    it('should handle empty search results', async () => {
      const params = { keywords: 'nonexistent' };
      const postSpy = vi.spyOn(searchService as any, 'post').mockResolvedValue([]);

      const result = await searchService.search(params);

      expect(result).toEqual([]);
    });

    it('should handle special characters in query', async () => {
      const params = { keywords: 'test & document (with) special-chars' };
      const postSpy = vi.spyOn(searchService as any, 'post').mockResolvedValue(mockSearchResults);

      const result = await searchService.search(params);

      expect(postSpy).toHaveBeenCalledWith('/api/search', {
        keywords: params.keywords,
        content: true,
        doc: true,
        tag: true,
        attachment: false,
        spaceId: ''
      });
      expect(result).toEqual(mockSearchResults);
    });

    it('should handle custom search options', async () => {
      const params = { 
        keywords: 'test', 
        content: false, 
        doc: true, 
        tag: false, 
        attachment: true,
        spaceId: 'space123'
      };
      const postSpy = vi.spyOn(searchService as any, 'post').mockResolvedValue(mockSearchResults);

      const result = await searchService.search(params);

      expect(postSpy).toHaveBeenCalledWith('/api/search', {
        keywords: 'test',
        content: false,
        doc: true,
        tag: false,
        attachment: true,
        spaceId: 'space123'
      });
      expect(result).toEqual(mockSearchResults);
    });

    it('should handle search errors', async () => {
      const params = { keywords: 'test' };
      const postSpy = vi.spyOn(searchService as any, 'post').mockRejectedValue(
        new Error('Search failed')
      );

      await expect(searchService.search(params)).rejects.toThrow('Search failed');
    });
  });
});
