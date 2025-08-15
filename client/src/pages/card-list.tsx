import { useState, useEffect } from "react";
import { Plus, MoreVertical, Download, Upload } from "lucide-react";
import { Card } from "@shared/schema";
import { storage } from "@/lib/storage";
import CardItem from "@/components/card-item";
import AddCardModal from "@/components/add-card-modal";
import UploadDataModal from "@/components/upload-data-modal";

export default function CardList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/data/download");
      const data = await response.json();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "card-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to download data", error);
    }
  };

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


  const handleUploadComplete = async () => {
    setShowUploadModal(false);
    setIsSyncing(true);
    try {
      const response = await fetch('/api/data/download');
      const data = await response.json();
      localStorage.setItem("prepaid-cards", JSON.stringify(data.cards));
      storage.loadCards();
      loadCards();
    } catch (error) {
      console.error("Failed to sync data with server", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      {isSyncing && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center">
                <p>Syncing data...</p>
            </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-material sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium">My Cards</h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <button
                  onClick={handleDownload}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Data
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Data
                </button>
              </div>
            )}
          </div>
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

      <UploadDataModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}
