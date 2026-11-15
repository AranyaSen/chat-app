import axios from "axios";
import { PROXY_URL_PATH } from "@/config/env";

export const api = axios.create({
  baseURL: PROXY_URL_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
