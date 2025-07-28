import { useState } from "react";
import { X } from "lucide-react";
import { insertTransactionSchema, InsertTransaction } from "@shared/schema";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  cardId: string;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onTransactionAdded,
  cardId,
}: AddTransactionModalProps) {
  const [formData, setFormData] = useState<Omit<InsertTransaction, "cardId">>({
    description: "",
    location: "",
    amount: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData: InsertTransaction = {
      ...formData,
      cardId,
    };

    const result = insertTransactionSchema.safeParse(transactionData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0] && error.path[0] !== "cardId") {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      const card = storage.getCard(cardId);
      if (!card) {
        toast({
          title: "Error",
          description: "Card not found.",
          variant: "destructive",
        });
        return;
      }

      const currentBalance = storage.getBalance(card);
      if (result.data.amount > currentBalance) {
        toast({
          title: "Insufficient Balance",
          description: `Transaction amount ($${result.data.amount.toFixed(2)}) exceeds current balance ($${currentBalance.toFixed(2)}).`,
          variant: "destructive",
        });
        return;
      }

      storage.addTransaction(result.data);
      onTransactionAdded();
      setFormData({ description: "", location: "", amount: 0 });
      setErrors({});
      toast({
        title: "Transaction Added",
        description: "Your transaction has been recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof Omit<InsertTransaction, "cardId">, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl p-6 transform transition-transform duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-800">Add Transaction</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="transaction-description" className="text-sm font-medium text-gray-700 mb-2">
              Transaction Description
            </Label>
            <Input
              id="transaction-description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="e.g., Coffee Purchase"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="transaction-location" className="text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </Label>
            <Input
              id="transaction-location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Starbucks Downtown"
            />
          </div>

          <div>
            <Label htmlFor="transaction-amount" className="text-sm font-medium text-gray-700 mb-2">
              Amount Spent
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <Input
                id="transaction-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount || ""}
                onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
              />
            </div>
            {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-blue-700"
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
