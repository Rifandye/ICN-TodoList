import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Plus, Loader2 } from "lucide-react";
import { SuggestionViewProps } from "../types";

export function SuggestionView({
  suggestionInput,
  setSuggestionInput,
  onGenerateSuggestions,
  loadingSuggestions,
  onViewChange,
}: SuggestionViewProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loadingSuggestions) {
      onGenerateSuggestions();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Lightbulb className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Let AI help you create tasks
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Describe what you want to accomplish and get 3 specific task
          suggestions
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to work on?
          </label>
          <Input
            placeholder="e.g., learn programming, build a website, improve fitness..."
            value={suggestionInput}
            onChange={(e) => setSuggestionInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            onClick={onGenerateSuggestions}
            disabled={!suggestionInput.trim() || loadingSuggestions}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            {loadingSuggestions ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating suggestions...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate AI Suggestions
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onViewChange("form")}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task Manually
          </Button>
        </div>
      </div>
    </div>
  );
}
