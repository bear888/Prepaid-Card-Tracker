import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { Card } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileJson } from "lucide-react";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

export default function ImportExportModal({ isOpen, onClose, onImportComplete }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState("export");
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [importFile, setImportFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const allCards = storage.getAllCards();
      setCards(allCards);
      // Default select all
      setSelectedCards(new Set(allCards.map(c => c.id)));
      setImportFile(null);
    }
  }, [isOpen]);

  const handleSelectAll = () => {
    if (selectedCards.size === cards.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(cards.map(c => c.id)));
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedCards);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedCards(newSelection);
  };

  const handleExport = () => {
    const cardsToExport = cards.filter(c => selectedCards.has(c.id));
    if (cardsToExport.length === 0) {
      toast({
        title: "No cards selected",
        description: "Please select at least one card to export.",
        variant: "destructive",
      });
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cardsToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `prepaid-cards-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    toast({
      title: "Export Successful",
      description: `Exported ${cardsToExport.length} cards.`,
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === "string") {
          const parsedData = JSON.parse(result);
          if (!Array.isArray(parsedData)) {
            throw new Error("Invalid format: Root element must be an array");
          }

          storage.importCards(parsedData);

          toast({
            title: "Import Successful",
            description: `Imported ${parsedData.length} cards.`,
          });

          if (onImportComplete) onImportComplete();
          onClose();
        }
      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: "Import Failed",
          description: "The file is not a valid JSON or has incorrect format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(importFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import / Export Data</DialogTitle>
          <DialogDescription>
            Backup your cards or restore them from a file.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label>Select cards to export:</Label>
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectedCards.size === cards.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <div className="border rounded-md max-h-[200px] overflow-y-auto p-2 space-y-2">
              {cards.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No cards available.</p>
              ) : (
                cards.map(card => (
                  <div key={card.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Checkbox
                      id={`card-${card.id}`}
                      checked={selectedCards.has(card.id)}
                      onCheckedChange={() => toggleSelection(card.id)}
                    />
                    <Label htmlFor={`card-${card.id}`} className="flex-1 cursor-pointer truncate">
                      {card.name} <span className="text-xs text-muted-foreground">({card.transactions.length} txns)</span>
                    </Label>
                    <span className="text-xs font-mono">${storage.getBalance(card).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleExport} disabled={selectedCards.size === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected ({selectedCards.size})
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 py-4">
             <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <FileJson className="h-10 w-10 text-muted-foreground mb-4" />
                  <span className="text-sm font-medium">
                    {importFile ? importFile.name : "Click to select a JSON file"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {importFile ? `${(importFile.size / 1024).toFixed(1)} KB` : "Supports exported JSON files"}
                  </span>
                </Label>
             </div>

             <div className="flex justify-end">
               <Button onClick={handleImport} disabled={!importFile}>
                 <Upload className="mr-2 h-4 w-4" />
                 Import Cards
               </Button>
             </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
