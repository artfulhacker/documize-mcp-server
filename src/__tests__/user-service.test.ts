import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../services/user-service.js';
import { ApiClient } from '../services/api-client.js';

describe('UserService', () => {
  let userService: UserService;
  let mockApiClient: any;

  const mockUsers = [
    { id: 'user1', email: 'user1@example.com', firstname: 'John', lastname: 'Doe' },
    { id: 'user2', email: 'user2@example.com', firstname: 'Jane', lastname: 'Smith' }
  ];

  const mockGroups = [
    { id: 'group1', name: 'Developers', type: 'public' },
    { id: 'group2', name: 'Admins', type: 'private' }
  ];

  beforeEach(() => {
    mockApiClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    userService = new UserService('https://api.documize.com', 'credentials');
    Object.assign(userService, mockApiClient);
  });

  describe('listUsers', () => {
    it('should call GET /api/users', async () => {
      const getSpy = vi.spyOn(userService as any, 'get').mockResolvedValue(mockUsers);

      const result = await userService.listUsers();

      expect(getSpy).toHaveBeenCalledWith('/api/users');
      expect(result).toEqual(mockUsers);
    });

    it('should handle empty user list', async () => {
      const getSpy = vi.spyOn(userService as any, 'get').mockResolvedValue([]);

      const result = await userService.listUsers();

      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should call POST /api/users with user data', async () => {
      const params = {
        email: 'newuser@example.com',
        firstname: 'New',
        lastname: 'User'
      };
      const createdUser = { id: 'user3', ...params, active: true };

      const postSpy = vi.spyOn(userService as any, 'post').mockResolvedValue(createdUser);

      const result = await userService.createUser(params);

      expect(postSpy).toHaveBeenCalledWith('/api/users', {
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        viewUsers: true,
        editor: true,
        analytics: true,
        active: true
      });
      expect(result).toEqual(createdUser);
    });

    it('should handle custom user options', async () => {
      const params = {
        email: 'admin@example.com',
        firstname: 'Admin',
        lastname: 'User',
        viewUsers: false,
        editor: false,
        analytics: false,
        active: false
      };
      const createdUser = { id: 'user3', ...params };

      const postSpy = vi.spyOn(userService as any, 'post').mockResolvedValue(createdUser);

      const result = await userService.createUser(params);

      expect(postSpy).toHaveBeenCalledWith('/api/users', params);
      expect(result).toEqual(createdUser);
    });

    it('should handle creation errors', async () => {
      const params = { email: 'invalid', firstname: 'Test', lastname: 'User' };
      const postSpy = vi.spyOn(userService as any, 'post').mockRejectedValue(
        new Error('Invalid email')
      );

      await expect(userService.createUser(params)).rejects.toThrow('Invalid email');
    });
  });

  describe('deleteUser', () => {
    it('should call DELETE /api/users/:id', async () => {
      const deleteSpy = vi.spyOn(userService as any, 'delete').mockResolvedValue(undefined);

      await userService.deleteUser('user1');

      expect(deleteSpy).toHaveBeenCalledWith('/api/users/user1');
    });

    it('should handle delete errors', async () => {
      const deleteSpy = vi.spyOn(userService as any, 'delete').mockRejectedValue(
        new Error('Cannot delete user')
      );

      await expect(userService.deleteUser('user1')).rejects.toThrow('Cannot delete user');
    });
  });

  describe('listGroups', () => {
    it('should call GET /api/group', async () => {
      const getSpy = vi.spyOn(userService as any, 'get').mockResolvedValue(mockGroups);

      const result = await userService.listGroups();

      expect(getSpy).toHaveBeenCalledWith('/api/group');
      expect(result).toEqual(mockGroups);
    });

    it('should handle empty group list', async () => {
      const getSpy = vi.spyOn(userService as any, 'get').mockResolvedValue([]);

      const result = await userService.listGroups();

      expect(result).toEqual([]);
    });
  });

  describe('joinGroup', () => {
    it('should call POST /api/group/:groupId/join/:userId', async () => {
      const postSpy = vi.spyOn(userService as any, 'post').mockResolvedValue(undefined);

      await userService.joinGroup('group1', 'user1');

      expect(postSpy).toHaveBeenCalledWith('/api/group/group1/join/user1', {});
    });
  });

  describe('leaveGroup', () => {
    it('should call DELETE /api/group/:groupId/leave/:userId', async () => {
      const deleteSpy = vi.spyOn(userService as any, 'delete').mockResolvedValue(undefined);

      await userService.leaveGroup('group1', 'user1');

      expect(deleteSpy).toHaveBeenCalledWith('/api/group/group1/leave/user1');
    });
  });
});
