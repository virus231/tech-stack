import { config as dotenvConfig } from "dotenv";

// Load environment variables
dotenvConfig();

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  corsOrigin: string;
}

const defaultPort = 3001;
const portString = process.env.PORT || "3001";
const port = Number(portString) || defaultPort;

export const config: Config = {
  port: port,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-key",
  corsOrigin: process.env.CORS_ORIGINS || "http://localhost:3000",
};

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
