import axios, { AxiosInstance, AxiosError } from "axios";

interface AuthResponse {
  token: string;
}

/**
 * Base API client for Documize
 */
export class ApiClient {
  protected client: AxiosInstance;
  private baseURL: string;
  private credentials: string;
  private token: string | null = null;

  constructor(baseURL: string, credentials: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // Remove trailing slash
    this.credentials = credentials; // Base64 encoded "orgId:email:password"
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Add request interceptor to ensure we have a valid token
    this.client.interceptors.request.use(
      async (config) => {
        // Skip authentication for the authenticate endpoint itself
        if (config.url?.includes('/api/public/authenticate')) {
          config.headers['Authorization'] = `Basic ${this.credentials}`;
          return config;
        }

        // Ensure we have a token for all other requests
        if (!this.token) {
          await this.authenticate();
        }

        config.headers['Authorization'] = `Bearer ${this.token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // If we get a 401, try to re-authenticate
        if (error.response?.status === 401 && !error.config?.url?.includes('/authenticate')) {
          this.token = null;
          const config = error.config;
          if (config) {
            await this.authenticate();
            config.headers['Authorization'] = `Bearer ${this.token}`;
            return this.client.request(config);
          }
        }

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data || error.message;
          
          throw new Error(
            `Documize API error (${status}): ${JSON.stringify(message)}`
          );
        } else if (error.request) {
          throw new Error("No response received from Documize API");
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Authenticate with Documize API and get bearer token
   */
  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post<AuthResponse>(
        `${this.baseURL}/api/public/authenticate`,
        {},
        {
          headers: {
            'Authorization': `Basic ${this.credentials}`,
            'Content-Type': 'application/json',
          },
        }
      );
      this.token = response.data.token;
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Make a GET request
   */
  protected async get<T>(path: string): Promise<T> {
    const response = await this.client.get<T>(path);
    return response.data;
  }

  /**
   * Make a POST request
   */
  protected async post<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(path, data);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  protected async put<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  protected async delete<T>(path: string): Promise<T> {
    const response = await this.client.delete<T>(path);
    return response.data;
  }
}
