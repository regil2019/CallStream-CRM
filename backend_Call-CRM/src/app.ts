import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/error";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { globalLimiter } from "./middlewares/rateLimit";
import { sanitizeData } from "./middlewares/security";

const app: Express = express();

app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true,
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Configure FRONTEND_URL in production
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(globalLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(sanitizeData);

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", routes);

app.use(globalErrorHandler);

export default app;
