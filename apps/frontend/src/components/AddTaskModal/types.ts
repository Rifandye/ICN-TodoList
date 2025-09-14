export interface TaskFormData {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  projectId?: string;
}

export interface TaskSuggestion {
  userInput: string;
  suggestions: string[];
}

export type ModalView = "suggestion" | "form" | "select-suggestion";

export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TaskFormData) => void;
  onSuccess?: () => void;
  projectId?: string;
}

export interface ViewProps {
  onViewChange: (view: ModalView) => void;
  projectId?: string;
}

export interface SuggestionViewProps extends ViewProps {
  suggestionInput: string;
  setSuggestionInput: (input: string) => void;
  onGenerateSuggestions: () => void;
  loadingSuggestions: boolean;
}

export interface SelectSuggestionViewProps extends ViewProps {
  suggestionInput: string;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

export interface TaskFormViewProps extends ViewProps {
  selectedSuggestion?: string;
  onSubmit: (data: TaskFormData) => void;
  loading: boolean;
  projectId?: string;
}
