import axios from "axios";

type ApiError = {
  success: false;
  message: string;
  data: null;
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    return (
      error.response.data.message || error.message || "Something went wrong"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An error occured";
};
