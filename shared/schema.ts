import { z } from "zod";

export const insertCardSchema = z.object({
  name: z.string().min(1, "Card name is required"),
  number: z.string().optional(),
  initialValue: z.number().min(0, "Initial value must be positive"),
});

export const insertTransactionSchema = z.object({
  cardId: z.string(),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export interface Card extends InsertCard {
  id: string;
  createdAt: string;
  transactions: Transaction[];
}

export interface Transaction extends InsertTransaction {
  id: string;
  date: string;
}
