import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuotationsTable } from "@/components/QuotationsTable";
import { AIModal } from "@/components/AIModal";
import { ResultPanel } from "@/components/ResultPanel";
import { toast } from "sonner";
import { fetchQuotations, SavedQuotation } from "@/services/api";

const Index = () => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [resultPanelOpen, setResultPanelOpen] = useState(false);
  const [quotationData, setQuotationData] = useState<any>(null);
  const [quotations, setQuotations] = useState<SavedQuotation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load quotations from MongoDB on component mount
  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setIsLoading(true);
      const fetchedQuotations = await fetchQuotations();
      setQuotations(fetchedQuotations);
      console.log(`✅ Loaded ${fetchedQuotations.length} quotations`);
    } catch (error) {
      console.error("Failed to load quotations:", error);
      toast.error("Failed to load quotations from database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.info("Refreshing quotations...");
    loadQuotations();
  };

  const handleManualQuote = () => {
    toast.info("Manual quotation form coming soon!");
  };

  const handleAISuccess = async (data: any) => {
    setQuotationData(data);
    setResultPanelOpen(true);
    
    // Data is already saved by backend, just reload the list
    await loadQuotations();
  };

  const handleSaveQuotation = async () => {
    // Just close the panel and keep the products (already saved by backend)
    setResultPanelOpen(false);
    toast.success("Products are displayed in the table!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onRefresh={handleRefresh}
        onCreateWithAI={() => setAiModalOpen(true)}
        onManualQuote={handleManualQuote}
      />

      <main className="container mx-auto px-6 py-8">
        <QuotationsTable 
          quotations={quotations} 
          isLoading={isLoading}
          onQuotationUpdate={loadQuotations}
        />
      </main>

      <AIModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSuccess={handleAISuccess}
      />

      <ResultPanel
        open={resultPanelOpen}
        onClose={() => setResultPanelOpen(false)}
        data={quotationData}
        onSave={handleSaveQuotation}
      />
    </div>
  );
};

export default Index;
