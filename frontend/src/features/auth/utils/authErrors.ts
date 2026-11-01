import { ApiError } from "@/lib/api";
import type { ApiErrorPayload } from "@/features/auth/types";

export type NormalizedApiError = {
  status: number | null;
  message: string;
  fieldErrors: Record<string, string>;
};

const FALLBACK_MESSAGE =
  "Something went wrong on our side. Please try again in a moment.";

function readApiErrorPayload(value: unknown): ApiErrorPayload | null {
  if (typeof value !== "object" || value === null) return null;

  return value as ApiErrorPayload;
}

export function getApiError(error: unknown): NormalizedApiError {
  if (!error) {
    return {
      status: null,
      message: FALLBACK_MESSAGE,
      fieldErrors: {},
    };
  }

  if (error instanceof ApiError) {
    const data = readApiErrorPayload(error.data);
    const fieldErrors: Record<string, string> = {};

    for (const fieldError of data?.errors ?? []) {
      const field = fieldError.field.replace(/^body\./, "");
      fieldErrors[field] = fieldError.message;
    }

    return {
      status: error.status,
      message: data?.message ?? error.message,
      fieldErrors,
    };
  }

  if (error instanceof Error) {
    return {
      status: null,
      message: error.message || FALLBACK_MESSAGE,
      fieldErrors: {},
    };
  }

  return {
    status: null,
    message: FALLBACK_MESSAGE,
    fieldErrors: {},
  };
}
