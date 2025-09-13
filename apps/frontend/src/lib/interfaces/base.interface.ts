export interface BaseApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
