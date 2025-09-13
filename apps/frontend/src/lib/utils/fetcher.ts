import { AxiosError } from "axios";
import { baseApi } from "../axios/instance";

export const fetcher = async <T = unknown>(key: {
  url: string;
  params?: Record<string, unknown>;
}): Promise<T> => {
  try {
    const response = await baseApi.get<T>(key.url, {
      params: key.params,
    });
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};
