import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card } from "@shared/schema";
import { storage } from "@/lib/storage";
import CardItem from "@/components/card-item";
import AddCardModal from "@/components/add-card-modal";

export default function CardList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showArchived, setShowArchived] = useState(false);

  const loadCards = () => {
    if (showArchived) {
      setCards(storage.getArchivedCards());
    } else {
      setCards(storage.getActiveCards());
    }
  };

  useEffect(() => {
    loadCards();
  }, [showArchived]);

  const handleCardAdded = () => {
    loadCards();
    setShowAddModal(false);
  };


  return (
    <>
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-material sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium">My Cards</h1>
          <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
        
        {/* Archive Toggle */}
        <div className="flex space-x-1 bg-white bg-opacity-20 rounded-lg p-1">
          <button
            onClick={() => setShowArchived(false)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              !showArchived 
                ? 'bg-white text-primary' 
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            Active ({storage.getActiveCards().length})
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              showArchived 
                ? 'bg-white text-primary' 
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            Archived ({storage.getArchivedCards().length})
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <div className="p-4 space-y-4">
          {cards.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 px-6">
              <i className="fas fa-credit-card text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {showArchived ? "No Archived Cards" : "No Cards Added Yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {showArchived 
                  ? "Cards you archive will appear here" 
                  : "Add your first prepaid card to start tracking your balance and transactions"
                }
              </p>
              {!showArchived && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-material hover:bg-blue-700 transition-colors"
                >
                  <Plus className="inline w-4 h-4 mr-2" />
                  Add Your First Card
                </button>
              )}
            </div>
          ) : (
            /* Card List */
            cards.map((card) => (
              <CardItem
                key={`${card.id}-${card.name}-${card.initialValue}`}
                card={card}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button - Only show for active cards */}
      {(cards.length > 0 || !showArchived) && !showArchived && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-material-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-20"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCardAdded={handleCardAdded}
      />
    </>
  );
}
