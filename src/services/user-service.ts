import { ApiClient } from "./api-client.js";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created: string;
  active: boolean;
  editor?: boolean;
  viewUsers?: boolean;
  analytics?: boolean;
}

export interface CreateUserParams {
  firstname: string;
  lastname: string;
  email: string;
  viewUsers?: boolean;
  editor?: boolean;
  analytics?: boolean;
  active?: boolean;
}

export interface Group {
  id: string;
  name: string;
  orgId: string;
  created: string;
  revised: string;
}

export class UserService extends ApiClient {
  async listUsers(): Promise<User[]> {
    return this.get<User[]>(`/api/users`);
  }

  async createUser(params: CreateUserParams): Promise<User> {
    const payload = {
      firstname: params.firstname,
      lastname: params.lastname,
      email: params.email,
      viewUsers: params.viewUsers !== undefined ? params.viewUsers : true,
      editor: params.editor !== undefined ? params.editor : true,
      analytics: params.analytics !== undefined ? params.analytics : true,
      active: params.active !== undefined ? params.active : true,
    };
    return this.post<User>(`/api/users`, payload);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.delete(`/api/users/${userId}`);
  }

  async listGroups(): Promise<Group[]> {
    return this.get<Group[]>(`/api/group`);
  }

  async joinGroup(groupId: string, userId: string): Promise<void> {
    return this.post(`/api/group/${groupId}/join/${userId}`, {});
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    return this.delete(`/api/group/${groupId}/leave/${userId}`);
  }
}
