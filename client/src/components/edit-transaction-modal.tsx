import React, { useState } from "react";
import { Transaction } from "@shared/schema";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
  onTransactionUpdated: () => void;
}

export default function EditTransactionModal({ 
  transaction, 
  cardId, 
  isOpen, 
  onClose, 
  onTransactionUpdated 
}: EditTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  // Reset form when modal opens or transaction changes
  React.useEffect(() => {
    if (transaction && isOpen) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction) return;

    const updates = {
      description: description.trim(),
      amount: parseFloat(amount)
    };

    if (!updates.description) {
      toast({
        title: "Error",
        description: "Transaction description is required.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(updates.amount) || updates.amount <= 0) {
      toast({
        title: "Error", 
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const success = storage.updateTransaction(cardId, transaction.id, updates);
    if (success) {
      onTransactionUpdated();
      onClose();
      toast({
        title: "Transaction Updated",
        description: "Transaction has been updated successfully.",
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Coffee purchase"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}