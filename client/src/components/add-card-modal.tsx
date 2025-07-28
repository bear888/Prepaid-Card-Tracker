import { useState } from "react";
import { X } from "lucide-react";
import { insertCardSchema, InsertCard } from "@shared/schema";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardAdded: () => void;
}

export default function AddCardModal({ isOpen, onClose, onCardAdded }: AddCardModalProps) {
  const [formData, setFormData] = useState<InsertCard>({
    name: "",
    number: "",
    initialValue: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = insertCardSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      storage.addCard(result.data);
      onCardAdded();
      setFormData({ name: "", number: "", initialValue: 0 });
      setErrors({});
      toast({
        title: "Card Added",
        description: "Your prepaid card has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof InsertCard, value: string | number) => {
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
          <h2 className="text-xl font-medium text-gray-800">Add New Card</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="card-name" className="text-sm font-medium text-gray-700 mb-2">
              Card Name or Description
            </Label>
            <Input
              id="card-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Starbucks Gift Card"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="card-number" className="text-sm font-medium text-gray-700 mb-2">
              Card Number (Optional)
            </Label>
            <Input
              id="card-number"
              type="text"
              value={formData.number}
              onChange={(e) => handleInputChange("number", e.target.value)}
              placeholder="Last 4 digits or full number"
            />
          </div>

          <div>
            <Label htmlFor="initial-value" className="text-sm font-medium text-gray-700 mb-2">
              Initial Value
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <Input
                id="initial-value"
                type="number"
                step="0.01"
                min="0"
                value={formData.initialValue || ""}
                onChange={(e) => handleInputChange("initialValue", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={`pl-8 ${errors.initialValue ? "border-red-500" : ""}`}
              />
            </div>
            {errors.initialValue && <p className="text-sm text-red-500 mt-1">{errors.initialValue}</p>}
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
              Add Card
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
