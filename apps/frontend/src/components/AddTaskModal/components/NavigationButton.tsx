import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ModalView } from "../types";

interface NavigationButtonProps {
  currentView: ModalView;
  selectedSuggestion?: string;
  onViewChange: (view: ModalView) => void;
}

export function NavigationButton({
  currentView,
  selectedSuggestion,
  onViewChange,
}: NavigationButtonProps) {
  if (currentView === "suggestion") {
    return null;
  }

  const handleBackClick = () => {
    if (currentView === "form" && selectedSuggestion) {
      onViewChange("select-suggestion");
    } else if (currentView === "select-suggestion") {
      onViewChange("suggestion");
    } else {
      onViewChange("suggestion");
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button variant="ghost" size="sm" onClick={handleBackClick}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}
