import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./api";

let isRefreshing = false;

let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    // Only 401s are retryable, and auth endpoints opt out to avoid loops.
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.retryOnUnauthorized === false
    ) {
      return Promise.reject(error);
    }

    // While a refresh is in flight, park the other failed requests.
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh", undefined, {
        retryOnUnauthorized: false,
      });

      processQueue();

      return api(originalRequest);
    } catch (error) {
      processQueue(error);
      throw error;
    } finally {
      isRefreshing = false;
    }
  },
);
