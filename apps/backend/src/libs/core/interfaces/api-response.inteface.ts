export interface ApiResponse<T> {
  success: true;
  message: string;
  data?: T;
}

export interface ErrorApiResponse {
  success: false;
  message?: string;
  error: {
    code?: number;
    details?: string[];
  };
}

export interface PaginatedResponse<T> {
  success?: true;
  message?: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NestResponse {
  message: string;
  error: string;
  statusCode: number;
}
