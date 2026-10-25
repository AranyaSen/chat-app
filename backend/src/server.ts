import { createApp } from "./app.js";

const PORT = Number(process.env.PORT);

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
