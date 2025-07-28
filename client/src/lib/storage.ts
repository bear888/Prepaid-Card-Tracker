import { Card, Transaction, InsertCard, InsertTransaction } from "@shared/schema";

const STORAGE_KEY = "prepaid-cards";

export class LocalStorageService {
  private cards: Card[] = [];

  constructor() {
    this.loadCards();
  }

  private loadCards(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cards = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading cards from storage:", error);
      this.cards = [];
    }
  }

  private saveCards(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cards));
    } catch (error) {
      console.error("Error saving cards to storage:", error);
    }
  }

  getAllCards(): Card[] {
    return [...this.cards];
  }

  getActiveCards(): Card[] {
    return this.cards.filter(card => !card.isArchived);
  }

  getArchivedCards(): Card[] {
    return this.cards.filter(card => card.isArchived);
  }

  getCard(id: string): Card | undefined {
    return this.cards.find(card => card.id === id);
  }

  addCard(insertCard: InsertCard): Card {
    const card: Card = {
      ...insertCard,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      transactions: [],
      isArchived: false,
    };
    
    this.cards.push(card);
    this.saveCards();
    return card;
  }

  updateCard(id: string, updates: Partial<InsertCard>): Card | null {
    const cardIndex = this.cards.findIndex(card => card.id === id);
    if (cardIndex === -1) return null;

    this.cards[cardIndex] = { ...this.cards[cardIndex], ...updates };
    this.saveCards();
    return this.cards[cardIndex];
  }

  deleteCard(id: string): boolean {
    const cardIndex = this.cards.findIndex(card => card.id === id);
    if (cardIndex === -1) return false;

    this.cards.splice(cardIndex, 1);
    this.saveCards();
    return true;
  }

  addTransaction(insertTransaction: InsertTransaction): Transaction | null {
    const card = this.getCard(insertTransaction.cardId);
    if (!card) return null;

    const transaction: Transaction = {
      ...insertTransaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    card.transactions.unshift(transaction);
    
    // Auto-archive if balance reaches zero
    const newBalance = this.getBalance(card);
    if (newBalance <= 0 && !card.isArchived) {
      card.isArchived = true;
    }
    
    this.saveCards();
    return transaction;
  }

  deleteTransaction(cardId: string, transactionId: string): boolean {
    const card = this.getCard(cardId);
    if (!card) return false;

    const transactionIndex = card.transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex === -1) return false;

    card.transactions.splice(transactionIndex, 1);
    this.saveCards();
    return true;
  }

  getBalance(card: Card): number {
    const totalSpent = card.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return card.initialValue - totalSpent;
  }

  getUsagePercentage(card: Card): number {
    if (card.initialValue === 0) return 0;
    const totalSpent = card.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return Math.min((totalSpent / card.initialValue) * 100, 100);
  }

  getLastUsed(card: Card): string {
    if (card.transactions.length === 0) return "Never used";
    
    const lastTransaction = card.transactions[0];
    const lastUsedDate = new Date(lastTransaction.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUsedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }
}

export const storage = new LocalStorageService();
