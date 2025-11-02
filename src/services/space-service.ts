import { ApiClient } from "./api-client.js";

export interface Space {
  id: string;
  name: string;
  description?: string;
  created: string;
  revised: string;
}

export interface CreateSpaceParams {
  name: string;
  description?: string;
}

/**
 * Service for managing Documize spaces (folders/areas)
 */
export class SpaceService extends ApiClient {
  /**
   * List all available spaces
   */
  async listSpaces(): Promise<Space[]> {
    return this.get<Space[]>("/api/space");
  }

  /**
   * Get a specific space by ID
   */
  async getSpace(spaceId: string): Promise<Space> {
    return this.get<Space>(`/api/space/${spaceId}`);
  }

  /**
   * Create a new space
   */
  async createSpace(params: CreateSpaceParams): Promise<Space> {
    const payload = {
      name: params.name,
      desc: params.description || "",
    };

    return this.post<Space>("/api/space", payload);
  }
}
