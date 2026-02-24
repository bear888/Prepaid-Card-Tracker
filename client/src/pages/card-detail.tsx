import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Plus, CreditCard, KeyRound, Barcode as BarcodeIcon, QrCode, MoreVertical, Edit, Archive, ArchiveRestore } from "lucide-react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { Card } from "@shared/schema";
import { storage } from "@/lib/storage";
import TransactionItem from "@/components/transaction-item";
import AddTransactionModal from "@/components/add-transaction-modal";
import EditCardModal from "@/components/edit-card-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CardDetail() {
  const [match, params] = useRoute("/card/:id");
  const [, setLocation] = useLocation();
  const [card, setCard] = useState<Card | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBarcode, setShowBarcode] = useState<"1d" | "qr" | null>(null);
  const { toast } = useToast();

  const loadCard = () => {
    if (match && params?.id) {
      const foundCard = storage.getCard(params.id);
      setCard(foundCard || null);
    }
  };

  useEffect(() => {
    loadCard();
    if (match && params?.id) {
      const foundCard = storage.getCard(params.id);
      setCard(foundCard || null);
    }
  }, [match, params?.id]);

  const handleTransactionAdded = () => {
    if (params?.id) {
      const updatedCard = storage.getCard(params.id);
      setCard(updatedCard ? { ...updatedCard, transactions: [...updatedCard.transactions] } : null);
      setShowAddModal(false);
    }
  };

  const handleTransactionDeleted = () => {
    if (params?.id) {
      const updatedCard = storage.getCard(params.id);
      setCard(updatedCard ? { ...updatedCard, transactions: [...updatedCard.transactions] } : null);
    }
  };

  const handleTransactionEdited = () => {
    if (params?.id) {
      const updatedCard = storage.getCard(params.id);
      // Create a new object to force a re-render
      setCard(updatedCard ? { ...updatedCard, transactions: [...updatedCard.transactions] } : null);
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCardUpdated = () => {
    loadCard();
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (card) {
      storage.deleteCard(card.id);
      toast({
        title: "Card Deleted",
        description: `${card.name} has been deleted.`,
      });
      setLocation("/");
    }
  };

  const handleArchive = () => {
    if (card) {
      storage.archiveCard(card.id);
      loadCard();
      toast({
        title: "Card Archived",
        description: `${card.name} has been moved to archives.`,
      });
    }
  };

  const handleUnarchive = () => {
    if (card) {
      storage.unarchiveCard(card.id);
      loadCard();
      toast({
        title: "Card Restored",
        description: `${card.name} has been moved back to active cards.`,
      });
    }
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Card
              </DropdownMenuItem>
              {card.isArchived ? (
                <DropdownMenuItem onSelect={handleUnarchive}>
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore Card
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={handleArchive}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Card
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteConfirm(true);
                }}
                className="text-red-600"
              >
                Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        {(card.pin || card.number) && (
          <div className="mt-4 pt-4 border-t border-white border-opacity-20 flex items-center justify-between">
            {card.pin && (
              <div className="flex items-center">
                <KeyRound className="w-5 h-5 mr-2" />
                <p className="text-lg font-mono">{card.pin}</p>
              </div>
            )}
            {card.number && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowBarcode("1d")} className="p-2 h-auto rounded-md bg-white bg-opacity-20 hover:bg-opacity-30">
                  <BarcodeIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowBarcode("qr")} className="p-2 h-auto rounded-md bg-white bg-opacity-20 hover:bg-opacity-30">
                  <QrCode className="w-6 h-6" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {showBarcode && card.number && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={() => setShowBarcode(null)}
        >
          <div className="bg-white p-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
            {showBarcode === "qr" ? (
              <QRCode value={card.number} size={256} />
            ) : (
              <Barcode
                value={card.number}
                format="CODE128"
                width={2}
                height={100}
                displayValue={true}
              />
            )}
          </div>
        </div>
      )}

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
                onEdit={handleTransactionEdited}
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

      <EditCardModal
        card={card}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onCardUpdated={handleCardUpdated}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your card
              and all of its transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
