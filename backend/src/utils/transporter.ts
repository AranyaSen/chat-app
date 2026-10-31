import { env } from "@/config/env.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: true,
  auth: {
    user: env.EMAIL_PROVIDER,
    pass: env.EMAIL_API_KEY,
  },
});
