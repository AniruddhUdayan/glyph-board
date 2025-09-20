const API_BASE_URL = 'http://api.glyph-board.xyz';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    requireAuth = false,
  } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if required
  if (requireAuth) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new ApiError('No authentication token found', 401);
    }
    requestHeaders['Authorization'] = token;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    let data;
    try {
      data = await response.json();
    } catch {
      // Response might not be JSON
      data = null;
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || `HTTP error ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred',
      0
    );
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, requireAuth = false) =>
    apiRequest<T>(endpoint, { method: 'GET', requireAuth }),
    
  post: <T = any>(endpoint: string, body?: any, requireAuth = false) =>
    apiRequest<T>(endpoint, { method: 'POST', body, requireAuth }),
    
  put: <T = any>(endpoint: string, body?: any, requireAuth = false) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, requireAuth }),
    
  delete: <T = any>(endpoint: string, requireAuth = false) =>
    apiRequest<T>(endpoint, { method: 'DELETE', requireAuth }),
    
  patch: <T = any>(endpoint: string, body?: any, requireAuth = false) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body, requireAuth }),
};

// Specific API functions
export const roomsApi = {
  getUserRooms: () => api.get<{ rooms: Array<{
    id: string;
    slug: string;
    createdAt: string;
  }> }>('/user/rooms', true),
  
  createRoom: (data: { name: string }) => 
    api.post<{ roomId: string }>('/room', data, true),
    
  getRoomById: (roomId: string) => api.get<{ room: {
    id: string;
    slug: string;
    createdAt: string;
    adminId: string;
    admin: {
      name: string;
      email: string;
    }
  } }>(`/room/${roomId}`, true),
  
  deleteRoom: (roomId: string) => api.delete<{ 
    message: string; 
    roomId: string; 
  }>(`/room/${roomId}`, true),
};