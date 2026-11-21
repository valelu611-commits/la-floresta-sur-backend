import { buildContext } from "./composition.js";
import { loadEnv } from "./config/env.js";
import { createServer } from "./http/server.js";

const env = loadEnv();
const ctx = await buildContext(env);
const app = createServer(ctx);

const server = app.listen(env.port, () => {
  console.log(`[backend] escuchando en http://localhost:${env.port} (motor: ${ctx.db.engine})`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`[backend] ${signal} recibido, cerrando...`);
  server.close();
  await ctx.db.close();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
