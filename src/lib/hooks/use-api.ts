"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { apiRequest, ApiError } from "@/lib/api";
import { useSettingsContext } from "@/providers/settings-provider";

type ApiFetcher<T> = (endpoint: string, data: Record<string, unknown>) => Promise<T>;

export function useApi<T>(
  endpoint: string | null,
  data: Record<string, unknown> = {},
  config?: SWRConfiguration<T>
) {
  const { settings, isConfigured } = useSettingsContext();

  const key = endpoint && isConfigured ? [endpoint, JSON.stringify(data), settings.serverUrl] : null;

  const { data: result, error, isLoading, mutate } = useSWR<T>(
    key,
    () => apiRequest<T>(endpoint!, data, settings),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    }
  );

  return {
    data: result,
    error: error as ApiError | undefined,
    isLoading,
    mutate,
  };
}

export function useApiMutation<T>() {
  const { settings } = useSettingsContext();

  const execute = async (endpoint: string, data: Record<string, unknown>): Promise<T> => {
    return apiRequest<T>(endpoint, data, settings);
  };

  return execute;
}
