import { RefreshCw, Sparkles, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRefresh: () => void;
  onCreateWithAI: () => void;
  onManualQuote: () => void;
}

export const Header = ({ onRefresh, onCreateWithAI, onManualQuote }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-blue">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AutoQuote <span className="text-primary">AI</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2 hover:border-primary/50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Quotations
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onCreateWithAI}
              className="gap-2 bg-primary hover:bg-primary/90 glow-blue transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Create with AI
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onManualQuote}
              className="gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Manual Quotation
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
