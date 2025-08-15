import { type Card, type Transaction, type InsertCard, type InsertTransaction } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for prepaid cards and transactions
export interface IStorage {
  getCard(id: string): Promise<Card | undefined>;
  getAllCards(): Promise<Card[]>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | null>;
  deleteCard(id: string): Promise<boolean>;
  addTransaction(transaction: InsertTransaction): Promise<Transaction | null>;
  deleteTransaction(cardId: string, transactionId: string): Promise<boolean>;
  replaceAll(cards: Card[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;

  constructor() {
    this.cards = new Map();
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async getAllCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = {
      ...insertCard,
      id,
      isArchived: false,
      createdAt: new Date().toISOString(),
      transactions: [],
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | null> {
    const card = this.cards.get(id);
    if (!card) return null;

    const updatedCard = { ...card, ...updates };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  async addTransaction(insertTransaction: InsertTransaction): Promise<Transaction | null> {
    const card = this.cards.get(insertTransaction.cardId);
    if (!card) return null;

    const transaction: Transaction = {
      ...insertTransaction,
      id: randomUUID(),
      date: new Date().toISOString(),
    };

    card.transactions.unshift(transaction);
    this.cards.set(card.id, card);
    return transaction;
  }

  async deleteTransaction(cardId: string, transactionId: string): Promise<boolean> {
    const card = this.cards.get(cardId);
    if (!card) return false;

    const transactionIndex = card.transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex === -1) return false;

    card.transactions.splice(transactionIndex, 1);
    this.cards.set(cardId, card);
    return true;
  }

  async replaceAll(cards: Card[]): Promise<void> {
    this.cards.clear();
    for (const card of cards) {
      this.cards.set(card.id, card);
    }
  }
}

export const storage = new MemStorage();
