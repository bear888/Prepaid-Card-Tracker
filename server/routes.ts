import { Router, type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();

  // put application routes here
  // all routes in this router will be prefixed with /api
  app.use("/prepaid-card-tracker/api", apiRouter);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
