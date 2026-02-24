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
        const parsedCards = JSON.parse(stored);
        // Ensure all cards have isArchived property for backward compatibility
        this.cards = parsedCards.map((card: any) => ({
          ...card,
          isArchived: card.isArchived || false,
          transactions: (card.transactions || []).sort((a: Transaction, b: Transaction) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        }));
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

    card.transactions.push(transaction);
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

  archiveCard(id: string): boolean {
    const card = this.getCard(id);
    if (!card) return false;

    card.isArchived = true;
    this.saveCards();
    return true;
  }

  unarchiveCard(id: string): boolean {
    const card = this.getCard(id);
    if (!card) return false;

    card.isArchived = false;
    this.saveCards();
    return true;
  }

  updateCard(id: string, updates: Partial<Pick<Card, 'name' | 'number' | 'initialValue' | 'pin'>>): boolean {
    const card = this.getCard(id);
    if (!card) return false;

    if (updates.name !== undefined) card.name = updates.name;
    if (updates.number !== undefined) card.number = updates.number;
    if (updates.initialValue !== undefined) card.initialValue = updates.initialValue;
    if (updates.pin !== undefined) card.pin = updates.pin;

    this.saveCards();
    return true;
  }

  updateTransaction(cardId: string, transactionId: string, updates: Partial<Pick<Transaction, 'description' | 'amount'>>): boolean {
    const card = this.getCard(cardId);
    if (!card) return false;

    const transaction = card.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;

    if (updates.description !== undefined) transaction.description = updates.description;
    if (updates.amount !== undefined) transaction.amount = updates.amount;

    this.saveCards();
    return true;
  }

  getLastUsed(card: Card): string {
    if (card.transactions.length === 0) return "Never used";
    
    const lastTransaction = card.transactions[card.transactions.length - 1];
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
