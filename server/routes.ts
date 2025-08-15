import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerDataRoutes } from "./data-routes";
import { Router } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  registerDataRoutes(apiRouter);
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
