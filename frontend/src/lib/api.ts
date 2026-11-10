import axios, { type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/config/env";

export type ApiRequestOptions = AxiosRequestConfig & {
  retryOnUnauthorized?: boolean;
};

export class ApiError extends Error {
  readonly status: number | null;
  readonly data: unknown;

  constructor(message: string, status: number | null, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

function readErrorMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return null;
  }

  const { message } = data as { message?: unknown };

  return typeof message === "string" && message.trim() ? message : null;
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiError(
        "We couldn't reach the server. Check that the API is running and try again.",
        null,
        null,
      );
    }

    const { data, status } = error.response;

    return new ApiError(
      readErrorMessage(data) ?? "The request could not be completed.",
      status,
      data ?? null,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, null, null);
  }

  return new ApiError("The request could not be completed.", null, null);
}

let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiRequest<T>({
  retryOnUnauthorized = true,
  ...config
}: ApiRequestOptions): Promise<T> {
  try {
    const response = await api.request<T>(config);

    return response.data;
  } catch (error) {
    const apiError = toApiError(error);

    if (apiError.status === 401 && retryOnUnauthorized) {
      const refreshed = await refreshSession();

      if (refreshed) {
        return apiRequest<T>({
          ...config,
          retryOnUnauthorized: false,
        });
      }
    }

    throw apiError;
  }
}
