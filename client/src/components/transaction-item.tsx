import { Minus, Edit } from "lucide-react";
import { Transaction } from "@shared/schema";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TransactionItemProps {
  transaction: Transaction;
  cardId: string;
  onDelete: () => void;
}

export default function TransactionItem({ transaction, cardId, onDelete }: TransactionItemProps) {
  const { toast } = useToast();
  
  const handleDelete = () => {
    const success = storage.deleteTransaction(cardId, transaction.id);
    if (success) {
      onDelete();
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been removed successfully.",
      });
    } else {
      console.error("Failed to delete transaction:", transaction.id);
      toast({
        title: "Delete Failed", 
        description: "Could not delete the transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate what the balance was after this specific transaction
  const card = storage.getCard(cardId);
  if (!card) return null;
  
  // Find the index of this transaction to calculate balance at that point
  const transactionIndex = card.transactions.findIndex(t => t.id === transaction.id);
  const transactionsAfterThis = card.transactions.slice(0, transactionIndex);
  const totalSpentAfterThis = transactionsAfterThis.reduce((sum, t) => sum + t.amount, 0);
  const balanceAfter = card.initialValue - totalSpentAfterThis;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-error bg-opacity-10 rounded-full flex items-center justify-center mr-3">
            <Minus className="w-4 h-4 text-error" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{transaction.description}</p>
            {transaction.location && (
              <p className="text-sm text-gray-500">{transaction.location}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-error">-${transaction.amount.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Balance after:{" "}
          <span className="font-medium text-gray-700">${balanceAfter.toFixed(2)}</span>
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 text-gray-400 hover:text-gray-600">
              <Edit className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete Transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
