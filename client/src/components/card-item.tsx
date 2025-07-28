import { MoreHorizontal, CreditCard, Archive, ArchiveRestore } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@shared/schema";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CardItemProps {
  card: Card;
  onDelete: () => void;
  onArchiveChange: () => void;
}

export default function CardItem({ card, onDelete, onArchiveChange }: CardItemProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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

  const handleArchive = () => {
    const success = storage.archiveCard(card.id);
    if (success) {
      onArchiveChange();
      toast({
        title: "Card Archived",
        description: `${card.name} has been moved to archives.`,
      });
    }
  };

  const handleUnarchive = () => {
    const success = storage.unarchiveCard(card.id);
    if (success) {
      onArchiveChange();
      toast({
        title: "Card Restored",
        description: `${card.name} has been moved back to active cards.`,
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-material p-4 border border-gray-100 hover:shadow-material-lg transition-shadow cursor-pointer ${
        card.isArchived ? 'opacity-75' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3 ${
            card.isArchived ? 'bg-gray-500 bg-opacity-20' : ''
          }`}>
            {card.isArchived ? (
              <Archive className="w-5 h-5 text-gray-500" />
            ) : (
              <CreditCard className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800">{card.name}</h3>
              {card.isArchived && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  Archived
                </span>
              )}
            </div>
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
            {card.isArchived ? (
              <DropdownMenuItem onClick={handleUnarchive}>
                <ArchiveRestore className="w-4 h-4 mr-2" />
                Restore Card
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                Archive Card
              </DropdownMenuItem>
            )}
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
