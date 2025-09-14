export interface Task {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  subTask?: Task[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  tasks: Task[];
}

export interface TaskSuggestion {
  userInput: string;
  suggestions: string[];
}

export type TaskInputMode =
  | "manual"
  | "ai-input"
  | "ai-select"
  | "ai-customize";

export interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProjectFormData) => void;
  onSuccess?: () => void;
}

export interface ViewProps {
  onModeChange: (mode: TaskInputMode) => void;
}

export interface ProjectFormViewProps extends ViewProps {
  onSubmit: (data: ProjectFormData) => void;
  loading: boolean;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export interface ManualTaskViewProps extends ViewProps {
  currentTask: Task;
  onTaskChange: (field: keyof Task, value: string | number) => void;
  onAddTask: () => void;
}

export interface AiInputViewProps extends ViewProps {
  aiInput: string;
  setAiInput: (input: string) => void;
  onGenerateSuggestions: () => void;
  loadingAiSuggestions: boolean;
}

export interface AiSelectViewProps extends ViewProps {
  aiInput: string;
  aiSuggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  onResetAiInput: () => void;
}

export interface AiCustomizeViewProps extends ViewProps {
  selectedAiTask: Task | null;
  onUpdateSelectedTask: (field: keyof Task, value: string | number) => void;
  onConfirmTask: () => void;
  onCancelTask: () => void;
}
