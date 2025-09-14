import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SelectSuggestionViewProps } from "../types";

export function SelectSuggestionView({
  suggestionInput,
  suggestions,
  onSelectSuggestion,
  onViewChange,
}: SelectSuggestionViewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Your goal:</strong> {suggestionInput}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Choose a task to add:
        </h3>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelectSuggestion(suggestion)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-800 text-sm">{suggestion}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => onViewChange("form")}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Custom Task Instead
      </Button>
    </div>
  );
}
