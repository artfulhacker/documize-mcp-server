import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from '../services/api-client.js';
import axios from 'axios';

// Create a concrete test class since ApiClient is abstract
class TestApiClient extends ApiClient {
  // Expose protected methods for testing
  public async testGet<T>(path: string): Promise<T> {
    return this.get<T>(path);
  }
  
  public async testPost<T>(path: string, data?: any): Promise<T> {
    return this.post<T>(path, data);
  }
  
  public async testPut<T>(path: string, data: any): Promise<T> {
    return this.put<T>(path, data);
  }
  
  public async testDelete(path: string): Promise<void> {
    return this.delete(path);
  }
}

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('ApiClient', () => {
  let apiClient: TestApiClient;
  const mockBaseURL = 'https://api.test.com';
  const mockCredentials = Buffer.from(':test@example.com:password123').toString('base64');
  const mockToken = 'mock-bearer-token';

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock axios.create to return a mock axios instance
    mockedAxios.create = vi.fn().mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    });

    // Mock axios.post for authentication
    mockedAxios.post = vi.fn().mockResolvedValue({
      data: mockToken
    });
  });

  describe('Constructor & Authentication', () => {
    it('should create instance with valid credentials', () => {
      expect(() => {
        apiClient = new TestApiClient(mockBaseURL, mockCredentials);
      }).not.toThrow();
    });

    it('should handle empty baseURL', () => {
      // ApiClient doesn't explicitly validate - axios will handle it
      expect(() => {
        apiClient = new TestApiClient('', mockCredentials);
      }).not.toThrow();
    });

    it('should handle empty credentials', () => {
      // ApiClient doesn't explicitly validate - will fail on auth
      expect(() => {
        apiClient = new TestApiClient(mockBaseURL, '');
      }).not.toThrow();
    });

    it('should decode base64 credentials correctly', () => {
      const credentials = Buffer.from(':admin@test.com:secret').toString('base64');
      
      expect(() => {
        apiClient = new TestApiClient(mockBaseURL, credentials);
      }).not.toThrow();
    });

    it('should handle credentials without domain (self-hosted)', () => {
      const credentials = Buffer.from(':user@example.com:pass').toString('base64');
      
      expect(() => {
        apiClient = new TestApiClient(mockBaseURL, credentials);
      }).not.toThrow();
    });

    it('should handle credentials with domain (multi-tenant)', () => {
      const credentials = Buffer.from('company:user@example.com:pass').toString('base64');
      
      expect(() => {
        apiClient = new TestApiClient(mockBaseURL, credentials);
      }).not.toThrow();
    });

    it('should remove trailing slash from baseURL', () => {
      const clientWithSlash = new TestApiClient('https://api.test.com/', mockCredentials);
      expect((clientWithSlash as any).baseURL).toBe('https://api.test.com');
    });
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      apiClient = new TestApiClient(mockBaseURL, mockCredentials);
    });

    it('should make GET request', async () => {
      const mockData = { id: '1', name: 'Test' };
      const mockClient = (apiClient as any).client;
      mockClient.get.mockResolvedValue({ data: mockData });

      const result = await apiClient.testGet('/api/test');

      expect(mockClient.get).toHaveBeenCalledWith('/api/test');
      expect(result).toEqual(mockData);
    });

    it('should make POST request', async () => {
      const mockData = { id: '1', name: 'Created' };
      const postData = { name: 'New Item' };
      const mockClient = (apiClient as any).client;
      mockClient.post.mockResolvedValue({ data: mockData });

      const result = await apiClient.testPost('/api/test', postData);

      expect(mockClient.post).toHaveBeenCalledWith('/api/test', postData);
      expect(result).toEqual(mockData);
    });

    it('should make PUT request', async () => {
      const mockData = { id: '1', name: 'Updated' };
      const putData = { name: 'Updated Item' };
      const mockClient = (apiClient as any).client;
      mockClient.put.mockResolvedValue({ data: mockData });

      const result = await apiClient.testPut('/api/test/1', putData);

      expect(mockClient.put).toHaveBeenCalledWith('/api/test/1', putData);
      expect(result).toEqual(mockData);
    });

    it('should make DELETE request', async () => {
      const mockClient = (apiClient as any).client;
      mockClient.delete.mockResolvedValue({ data: undefined });

      await apiClient.testDelete('/api/test/1');

      expect(mockClient.delete).toHaveBeenCalledWith('/api/test/1');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      apiClient = new TestApiClient(mockBaseURL, mockCredentials);
    });

    it('should handle 404 errors', async () => {
      const mockClient = (apiClient as any).client;
      mockClient.get.mockRejectedValue({
        response: { status: 404, data: { message: 'Not found' } }
      });

      await expect(apiClient.testGet('/api/test')).rejects.toThrow();
    });

    it('should handle 401 errors', async () => {
      const mockClient = (apiClient as any).client;
      mockClient.get.mockRejectedValue({
        response: { status: 401, data: { message: 'Unauthorized' } }
      });

      await expect(apiClient.testGet('/api/test')).rejects.toThrow();
    });

    it('should handle 500 errors', async () => {
      const mockClient = (apiClient as any).client;
      mockClient.get.mockRejectedValue({
        response: { status: 500, data: { message: 'Server error' } }
      });

      await expect(apiClient.testGet('/api/test')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const mockClient = (apiClient as any).client;
      mockClient.get.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.testGet('/api/test')).rejects.toThrow('Network error');
    });
  });

  describe('Response Handling', () => {
    beforeEach(() => {
      apiClient = new TestApiClient(mockBaseURL, mockCredentials);
    });

    it('should extract data from response', async () => {
      const mockData = { id: '1', value: 'test' };
      const mockClient = (apiClient as any).client;
      mockClient.get.mockResolvedValue({ data: mockData });

      const result = await apiClient.testGet('/api/test');

      expect(result).toEqual(mockData);
    });

    it('should handle empty response', async () => {
      const mockClient = (apiClient as any).client;
      mockClient.get.mockResolvedValue({ data: null });

      const result = await apiClient.testGet('/api/test');

      expect(result).toBeNull();
    });

    it('should handle array responses', async () => {
      const mockData = [{ id: '1' }, { id: '2' }];
      const mockClient = (apiClient as any).client;
      mockClient.get.mockResolvedValue({ data: mockData });

      const result = await apiClient.testGet('/api/test');

      expect(result).toEqual(mockData);
    });
  });
});
