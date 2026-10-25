import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./db/health.js";

const PORT = env.PORT;

const app = createApp();

const startServer = async () => {
  try {
    await connectDb();
    console.log("DB Connected");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    return server;
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exitCode = 1;
  }
};

const server = await startServer();

export default server;
