import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpaceService } from '../services/space-service.js';
import { ApiClient } from '../services/api-client.js';

describe('SpaceService', () => {
  let spaceService: SpaceService;
  let mockApiClient: any;

  const mockSpaces = [
    { id: 'space1', name: 'Engineering', type: 'public' },
    { id: 'space2', name: 'Marketing', type: 'private' }
  ];

  beforeEach(() => {
    // Create a mock ApiClient with protected methods
    mockApiClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    spaceService = new SpaceService('https://api.documize.com', 'credentials');
    // Replace the inherited methods with our mocks
    Object.assign(spaceService, mockApiClient);
  });

  describe('listSpaces', () => {
    it('should call GET /api/space', async () => {
      const getSpy = vi.spyOn(spaceService as any, 'get').mockResolvedValue(mockSpaces);

      const result = await spaceService.listSpaces();

      expect(getSpy).toHaveBeenCalledWith('/api/space');
      expect(result).toEqual(mockSpaces);
    });

    it('should handle empty space list', async () => {
      const getSpy = vi.spyOn(spaceService as any, 'get').mockResolvedValue([]);

      const result = await spaceService.listSpaces();

      expect(result).toEqual([]);
    });
  });

  describe('getSpace', () => {
    it('should call GET /api/space/:id', async () => {
      const getSpy = vi.spyOn(spaceService as any, 'get').mockResolvedValue(mockSpaces[0]);

      const result = await spaceService.getSpace('space1');

      expect(getSpy).toHaveBeenCalledWith('/api/space/space1');
      expect(result).toEqual(mockSpaces[0]);
    });

    it('should handle space not found', async () => {
      const getSpy = vi.spyOn(spaceService as any, 'get').mockRejectedValue(
        new Error('Space not found')
      );

      await expect(spaceService.getSpace('nonexistent')).rejects.toThrow('Space not found');
    });
  });

  describe('createSpace', () => {
    it('should call POST /api/space with space data', async () => {
      const params = { name: 'New Space', description: 'Test space' };
      const createdSpace = { id: 'space3', name: params.name, description: params.description };

      const postSpy = vi.spyOn(spaceService as any, 'post').mockResolvedValue(createdSpace);

      const result = await spaceService.createSpace(params);

      expect(postSpy).toHaveBeenCalledWith('/api/space', {
        name: params.name,
        cloneId: '',
        copyTemplate: false,
        copyPermission: false,
        copyDocument: false
      });
      expect(result).toEqual(createdSpace);
    });

    it('should handle creation with minimal data', async () => {
      const params = { name: 'Minimal Space' };
      const createdSpace = { id: 'space4', name: params.name };

      const postSpy = vi.spyOn(spaceService as any, 'post').mockResolvedValue(createdSpace);

      const result = await spaceService.createSpace(params);

      expect(postSpy).toHaveBeenCalledWith('/api/space', {
        name: params.name,
        cloneId: '',
        copyTemplate: false,
        copyPermission: false,
        copyDocument: false
      });
      expect(result).toEqual(createdSpace);
    });
  });

  describe('deleteSpace', () => {
    it('should call DELETE /api/space/:id', async () => {
      const deleteSpy = vi.spyOn(spaceService as any, 'delete').mockResolvedValue(undefined);

      await spaceService.deleteSpace('space1');

      expect(deleteSpy).toHaveBeenCalledWith('/api/space/space1');
    });

    it('should handle delete errors', async () => {
      const deleteSpy = vi.spyOn(spaceService as any, 'delete').mockRejectedValue(
        new Error('Cannot delete space')
      );

      await expect(spaceService.deleteSpace('space1')).rejects.toThrow('Cannot delete space');
    });
  });
});
