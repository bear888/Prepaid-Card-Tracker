import React, { useState } from "react";
import { Card } from "@shared/schema";
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

interface EditCardModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onCardUpdated: () => void;
}

export default function EditCardModal({ card, isOpen, onClose, onCardUpdated }: EditCardModalProps) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const { toast } = useToast();

  // Reset form when modal opens or card changes
  React.useEffect(() => {
    if (card && isOpen) {
      setName(card.name);
      setNumber(card.number || "");
      setPin(card.pin || "");
      setInitialValue(card.initialValue.toString());
    }
  }, [card, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!card) return;

    const updates = {
      name: name.trim(),
      number: number.trim() || undefined,
      pin: pin.trim() || undefined,
      initialValue: parseFloat(initialValue)
    };

    if (!updates.name) {
      toast({
        title: "Error",
        description: "Card name is required.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(updates.initialValue) || updates.initialValue <= 0) {
      toast({
        title: "Error", 
        description: "Please enter a valid initial balance.",
        variant: "destructive",
      });
      return;
    }

    const success = storage.updateCard(card.id, updates);
    if (success) {
      onCardUpdated();
      onClose();
      toast({
        title: "Card Updated",
        description: "Card details have been updated successfully.",
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Card Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Starbucks Gift Card"
              required
            />
          </div>

          <div>
            <Label htmlFor="number">Card Number (Optional)</Label>
            <Input
              id="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., 1234567890123456"
            />
          </div>

          <div>
            <Label htmlFor="pin">PIN (Optional)</Label>
            <Input
              id="pin"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="e.g., 1234"
            />
          </div>

          <div>
            <Label htmlFor="initialValue">Initial Balance *</Label>
            <Input
              id="initialValue"
              type="number"
              step="0.01"
              min="0.01"
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}