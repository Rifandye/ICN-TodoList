import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import type { AxiosError } from "axios";
import { fetcher } from "@/lib/utils/fetcher";

type SWRUrlObject = {
  url: string | null;
  params?: Record<string, unknown>;
};

export default function useBaseSWR<Data>(
  key: SWRUrlObject | null,
  config?: SWRConfiguration
): SWRResponse<Data, AxiosError> {
  return useSWR<Data, AxiosError>(key?.url ? key : null, fetcher, config);
}
