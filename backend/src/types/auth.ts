export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string | null;
    createdAt: Date;
  };
  token: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: string[];
}