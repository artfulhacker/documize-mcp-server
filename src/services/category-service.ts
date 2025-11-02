import { ApiClient } from "./api-client.js";

export interface Category {
  id: string;
  spaceId: string;
  name: string;
  created: string;
  revised: string;
}

export interface CreateCategoryParams {
  spaceId: string;
  name: string;
}

/**
 * Service for managing document categories
 */
export class CategoryService extends ApiClient {
  /**
   * List all categories in a space
   */
  async listCategories(spaceId: string): Promise<Category[]> {
    return this.get<Category[]>(`/api/space/${spaceId}/category`);
  }

  /**
   * Create a new category in a space
   */
  async createCategory(params: CreateCategoryParams): Promise<Category> {
    const payload = {
      spaceId: params.spaceId,
      name: params.name,
    };

    return this.post<Category>(`/api/category`, payload);
  }
}
