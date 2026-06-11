import express, { Application } from "express";
import { log } from "./middlewares/log.middleware";
import routes from "./routes";
import { globalErrorHandler, handle404 } from "./middlewares/error.middleware";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import env from "./config/env.config";
import cors from "cors";

const app: Application = express();
app.use(
  cors({ origin: [env.FRONTEND_URL, env.SERVER_URL, "http://localhost:3000"] }),
);
app.use(express.json());

app.use(log);
app.use("/api", rateLimiter, routes);
app.use(handle404);
app.use(globalErrorHandler);

export default app;
