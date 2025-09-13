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

export interface NestResponse {
  message: string;
  error: string;
  statusCode: number;
}
