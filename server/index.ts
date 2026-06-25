import "dotenv/config";
import { createServer } from "http";
import { createApp } from "./app.js";

const port = process.env.PORT || 5000;
const app = createApp();
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
