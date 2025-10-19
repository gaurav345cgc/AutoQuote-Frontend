import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoaderBuffer } from "./LoaderBuffer";
import { toast } from "sonner";

interface AIModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const AIModal = ({ open, onClose, onSuccess }: AIModalProps) => {
  const [emailText, setEmailText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!emailText.trim()) {
      toast.error("Please enter an email or request text");
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API instead of external AI API directly
      const response = await fetch("https://autoquote-backend.onrender.com/api/extract-and-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quotation");
      }

      const data = await response.json();

      // Simulate buffer delay (minimum 5 seconds for full animation)
      await new Promise((resolve) => setTimeout(resolve, 6000));

      if (data.success) {
        toast.success("Quotation generated and saved to database!");
        // Pass the data to parent component
        onSuccess(data);
        setEmailText("");
        onClose();
      } else {
        toast.error("No products found in the request");
      }
    } catch (error) {
      console.error("Error generating quotation:", error);
      toast.error("Failed to generate quotation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg glass-panel border-border">
          <LoaderBuffer />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Generate Quotation with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Paste customer email or request
            </label>
            <Textarea
              placeholder="Can you quote any of these?&#10;&#10;I realize 240&quot; LG on the 96&quot; W items is likely not achievable.. So please quote your largest full sheets otherwise.&#10;&#10;QTY 1 – SA240 316H – ¾&quot; TK x 96&quot; W x 144&quot; LG&#10;QTY 5 – SA240 316H – 1.500&quot; TK x 48&quot; W x 144&quot; LG&#10;QTY 5 – SA240 310 – 1/2&quot; TK x 96&quot; W x 240&quot; LG"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="min-h-[300px] bg-input border-border resize-none font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="hover:border-primary/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              className="bg-primary hover:bg-primary/90 glow-blue gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
