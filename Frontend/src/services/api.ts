/**
 * Common API utility for making requests to the backend
 * Uses VITE_API_URL environment variable as the base URL
 */

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Makes a GET request to the API
 * @param endpoint - The endpoint path (e.g., "/fleetsync/data/123")
 * @param options - Optional fetch options to merge with defaults
 * @returns Promise with the parsed JSON response
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Makes a POST request to the API
 * @param endpoint - The endpoint path (e.g., "/fleetsync/process")
 * @param body - The request body
 * @param options - Optional fetch options to merge with defaults
 * @returns Promise with the parsed JSON response
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Makes a PUT request to the API
 * @param endpoint - The endpoint path
 * @param body - The request body
 * @param options - Optional fetch options to merge with defaults
 * @returns Promise with the parsed JSON response
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Makes a DELETE request to the API
 * @param endpoint - The endpoint path
 * @param options - Optional fetch options to merge with defaults
 * @returns Promise with the parsed JSON response
 */
export async function apiDelete<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Gets the API base URL
 */
export function getApiBaseUrl(): string {
  return API_BASE;
}
