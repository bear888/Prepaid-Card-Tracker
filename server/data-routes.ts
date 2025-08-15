import type { Router } from "express";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { insertCardSchema, insertTransactionSchema } from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

const cardSchema = insertCardSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  transactions: z.array(insertTransactionSchema.extend({
    id: z.string(),
    date: z.string(),
  })),
  isArchived: z.boolean(),
});

const uploadDataSchema = z.object({
  cards: z.array(cardSchema),
});

export function registerDataRoutes(router: Router) {
  router.get("/data/download", async (req, res) => {
    const cards = await storage.getAllCards();
    res.json({ cards });
  });

  router.post("/data/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const mode = req.body.mode; // 'add' or 'replace'
    if (mode !== "add" && mode !== "replace") {
      return res.status(400).json({ message: "Invalid upload mode" });
    }

    try {
      const jsonData = JSON.parse(req.file.buffer.toString());
      const parsedData = uploadDataSchema.parse(jsonData);

      if (mode === "replace") {
        await storage.replaceAll(parsedData.cards);
      } else {
        for (const card of parsedData.cards) {
          const { transactions, ...newCard } = card;
          const createdCard = await storage.createCard(newCard);
          for (const transaction of transactions) {
            await storage.addTransaction({ ...transaction, cardId: createdCard.id });
          }
        }
      }

      res.status(200).json({ message: "Data uploaded successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.errors });
      }
      res.status(500).json({ message: "Error processing file" });
    }
  });
}
