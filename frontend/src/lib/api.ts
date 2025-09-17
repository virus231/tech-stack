import axios from 'axios';

// API base URL - update this to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  _count?: {
    posts: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  description?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateUser: async (data: UpdateUserRequest): Promise<{ user: User; message: string }> => {
    const response = await api.put<{ user: User; message: string }>('/users/me', data);
    return response.data;
  },

  deleteUser: async (password: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/users/me', {
      data: { password }
    });
    return response.data;
  },
};

// Posts API functions
export const postsApi = {
  getAllPosts: async (): Promise<{ posts: Post[]; total: number }> => {
    const response = await api.get<{ posts: Post[]; total: number }>('/posts');
    return response.data;
  },

  getPostById: async (id: number): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },
};