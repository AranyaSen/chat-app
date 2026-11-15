import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Set to `false` on endpoints that must not trigger a token refresh. */
    retryOnUnauthorized?: boolean;
  }
}
