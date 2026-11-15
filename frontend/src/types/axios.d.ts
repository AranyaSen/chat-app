import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    retryOnUnauthorized?: boolean;
  }

  interface InternalAxiosRequestConfig {
    retryOnUnauthorized?: boolean;
  }
}
