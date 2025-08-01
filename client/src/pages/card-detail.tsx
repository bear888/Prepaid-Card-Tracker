import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Plus, CreditCard } from "lucide-react";
import { Card } from "@shared/schema";
import { storage } from "@/lib/storage";
import TransactionItem from "@/components/transaction-item";
import AddTransactionModal from "@/components/add-transaction-modal";
import { Button } from "@/components/ui/button";

export default function CardDetail() {
  const [match, params] = useRoute("/card/:id");
  const [, setLocation] = useLocation();
  const [card, setCard] = useState<Card | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (match && params?.id) {
      const foundCard = storage.getCard(params.id);
      setCard(foundCard || null);
    }
  }, [match, params?.id]);

  const handleTransactionAdded = () => {
    if (params?.id) {
      const updatedCard = storage.getCard(params.id);
      setCard(updatedCard || null);
      setShowAddModal(false);
    }
  };

  const handleTransactionDeleted = () => {
    if (params?.id) {
      const updatedCard = storage.getCard(params.id);
      setCard(updatedCard || null);
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-600 mb-2">Card Not Found</h2>
          <Button onClick={handleBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Recalculate balance each time card state changes
  const balance = card ? storage.getBalance(card) : 0;

  return (
    <>
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-material sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-3 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-medium">{card.name}</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </header>

      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-medium">{card.name}</h2>
            {card.number && (
              <p className="text-blue-100">**** **** **** {card.number.slice(-4)}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4" key={`balance-${balance}-${card.transactions.length}`}>
          <div>
            <p className="text-blue-100 text-sm">Current Balance</p>
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Initial Value</p>
            <p className="text-lg font-medium">${card.initialValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Transaction History</h3>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-blue-700 text-sm shadow-material"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {card.transactions.length === 0 ? (
          /* Empty Transactions */
          <div className="text-center py-8">
            <i className="fas fa-receipt text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400">Add your first transaction to start tracking</p>
          </div>
        ) : (
          /* Transaction Items */
          <div className="space-y-3" key={`transactions-${card.transactions.length}-${card.id}`}>
            {card.transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                cardId={card.id}
                onDelete={handleTransactionDeleted}
                onEdit={handleTransactionDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTransactionAdded={handleTransactionAdded}
        cardId={card.id}
      />
    </>
  );
}
