import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lightbulb, Loader2 } from "lucide-react";
import { AiInputViewProps } from "../types";

export function AiInputView({
  aiInput,
  setAiInput,
  onGenerateSuggestions,
  loadingAiSuggestions,
  onModeChange,
}: AiInputViewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onModeChange("manual")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h4 className="font-medium text-blue-900 text-sm">
            Get AI Task Suggestions
          </h4>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            What do you want to accomplish with this project?
          </label>
          <Input
            placeholder="e.g., learn React, build an e-commerce site..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !loadingAiSuggestions) {
                onGenerateSuggestions();
              }
            }}
            className="text-sm"
          />
        </div>

        <Button
          type="button"
          onClick={onGenerateSuggestions}
          disabled={!aiInput.trim() || loadingAiSuggestions}
          className="bg-blue-600 hover:bg-blue-700 w-full"
          size="sm"
        >
          {loadingAiSuggestions ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Generating suggestions...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-3 w-3" />
              Generate Task Suggestions
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
