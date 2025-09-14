import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AiSelectViewProps } from "../types";

export function AiSelectView({
  aiInput,
  aiSuggestions,
  onSelectSuggestion,
  onResetAiInput,
  onModeChange,
}: AiSelectViewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onModeChange("ai-input")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h4 className="font-medium text-green-900 text-sm">
            Choose Tasks to Add
          </h4>
        </div>
      </div>

      <div className="bg-green-100 p-2 rounded text-xs">
        <p className="text-green-700">
          <strong>Goal:</strong> {aiInput}
        </p>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {aiSuggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="w-full text-left p-2 border border-green-200 rounded hover:border-green-300 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <p className="text-green-800 text-xs leading-relaxed">
                {suggestion}
              </p>
            </div>
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onResetAiInput}
        className="w-full"
        size="sm"
      >
        Done with suggestions
      </Button>
    </div>
  );
}
