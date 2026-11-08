import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./db/health.js";
import http from "node:http";

const PORT = env.PORT;

const app = createApp();

const startServer = async () => {
  try {
    await connectDb();
    console.log("DB Connected");

    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exitCode = 1;
  }
};

const server = await startServer();

export default server;
