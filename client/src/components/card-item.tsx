import { MoreHorizontal, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@shared/schema";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CardItemProps {
  card: Card;
  onDelete: () => void;
}

export default function CardItem({ card, onDelete }: CardItemProps) {
  const [, setLocation] = useLocation();
  const balance = storage.getBalance(card);
  const usagePercentage = storage.getUsagePercentage(card);
  const lastUsed = storage.getLastUsed(card);

  const handleCardClick = () => {
    setLocation(`/card/${card.id}`);
  };

  const handleDelete = () => {
    storage.deleteCard(card.id);
    onDelete();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-material p-4 border border-gray-100 hover:shadow-material-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{card.name}</h3>
            {card.number && (
              <p className="text-sm text-gray-500">**** {card.number.slice(-4)}</p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete Card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Current Balance</p>
          <p className="text-2xl font-bold text-secondary">${balance.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last Used</p>
          <p className="text-sm text-gray-600">{lastUsed}</p>
        </div>
      </div>

      {/* Balance indicator bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Used</span>
          <span>{usagePercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
