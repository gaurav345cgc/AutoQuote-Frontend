import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const bufferStates = [
  { emoji: "🔍", text: "Understanding your query..." },
  { emoji: "🧩", text: "Extracting product specs..." },
  { emoji: "⚙️", text: "Parsing dimensions and grades..." },
  { emoji: "🤖", text: "Matching SKUs in AutoQuote..." },
  { emoji: "📊", text: "Preparing quotation draft..." },
];

export const LoaderBuffer = () => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => {
        if (prev < bufferStates.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-8 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-glow" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-foreground">
          Analyzing your Request...
        </h3>

        <div className="w-full max-w-md mx-auto h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-1000 ease-out glow-blue"
            style={{
              width: `${((currentState + 1) / bufferStates.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {bufferStates.map((state, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              index <= currentState
                ? "bg-primary/10 border border-primary/30 animate-slide-up"
                : "bg-muted/20 border border-transparent opacity-40"
            }`}
          >
            <span className="text-2xl">{state.emoji}</span>
            <span
              className={`text-sm font-medium ${
                index <= currentState ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {state.text}
            </span>
            {index === currentState && (
              <Loader2 className="w-4 h-4 ml-auto text-primary animate-spin" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
