import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./api";

api.interceptors.request.use((config) => {
  return config;
});

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

    // Check if the request needs to be retried
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // If Refresh is happening then wait
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    // Call the refresh token endpoint and process waiting requests
    try {
      await api.post("/auth/refresh");

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
