"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import BaseDialog from "@/components/Dialog";
import { baseApi } from "@/lib/axios/instance";
import { BaseApiResponse } from "@/lib/interfaces/base.interface";
import { NavigationButton } from "./components/NavigationButton";
import { SuggestionView } from "./views/SuggestionView";
import { SelectSuggestionView } from "./views/SelectSuggestionView";
import { TaskFormView, TaskFormRef } from "./views/TaskFormView";
import {
  AddTaskModalProps,
  TaskFormData,
  TaskSuggestion,
  ModalView,
} from "./types";

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  projectId,
}: AddTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>("suggestion");
  const [suggestionInput, setSuggestionInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");
  const taskFormRef = useRef<TaskFormRef>(null);

  const generateSuggestions = async () => {
    if (!suggestionInput.trim()) return;

    setLoadingSuggestions(true);
    try {
      const response = await baseApi.post<BaseApiResponse<TaskSuggestion>>(
        "/v1/tasks/suggestions",
        {
          userInput: suggestionInput.trim(),
        }
      );

      setSuggestions(response.data.data.suggestions);
      setCurrentView("select-suggestion");
    } catch (error) {
      toast.error("Failed to generate AI suggestions", {
        description: "Please try again or create task manually.",
      });
      setCurrentView("form");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setCurrentView("form");
  };

  const resetModal = () => {
    setCurrentView("suggestion");
    setSuggestionInput("");
    setSuggestions([]);
    setSelectedSuggestion("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const onSubmitForm = async (values: TaskFormData) => {
    setLoading(true);

    try {
      const taskData = { ...values, projectId: projectId || values.projectId };

      const response = await baseApi.post("/v1/tasks", taskData);

      if (!response.data) {
        throw new Error("Failed to create task");
      }

      toast.success("Task created successfully!", {
        description: "Your new task has been added to the project.",
      });

      if (onSuccess) {
        onSuccess();
      }

      if (onSubmit) {
        onSubmit(taskData);
      }

      handleClose();
    } catch (error) {
      toast.error("Failed to create task", {
        description: "Please check your inputs and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDialogTitle = () => {
    switch (currentView) {
      case "suggestion":
        return "Add New Task";
      case "select-suggestion":
        return "Choose a Suggestion";
      case "form":
        return selectedSuggestion ? "Complete Task Details" : "Add New Task";
      default:
        return "Add New Task";
    }
  };

  const getDialogType = () => {
    return currentView === "form" ? "create" : undefined;
  };

  const handleDialogSubmit = () => {
    if (currentView === "form" && taskFormRef.current) {
      taskFormRef.current.submitForm();
    }
  };

  const shouldShowSubmitButton = () => {
    return currentView === "form";
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handleViewChange = (view: ModalView) => {
    setCurrentView(view);
  };

  if (!isOpen) return null;

  return (
    <BaseDialog
      title={getDialogTitle()}
      type={getDialogType()}
      onSubmit={shouldShowSubmitButton() ? handleDialogSubmit : undefined}
      loading={loading || loadingSuggestions}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      showSubmitButton={shouldShowSubmitButton()}
    >
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 mb-4">
          <NavigationButton
            currentView={currentView}
            selectedSuggestion={selectedSuggestion}
            onViewChange={handleViewChange}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
          <div className="space-y-4 pb-4">
            {currentView === "suggestion" && (
              <SuggestionView
                suggestionInput={suggestionInput}
                setSuggestionInput={setSuggestionInput}
                onGenerateSuggestions={generateSuggestions}
                loadingSuggestions={loadingSuggestions}
                onViewChange={handleViewChange}
                projectId={projectId}
              />
            )}

            {currentView === "select-suggestion" && (
              <SelectSuggestionView
                suggestionInput={suggestionInput}
                suggestions={suggestions}
                onSelectSuggestion={selectSuggestion}
                onViewChange={handleViewChange}
                projectId={projectId}
              />
            )}

            {currentView === "form" && (
              <TaskFormView
                ref={taskFormRef}
                selectedSuggestion={selectedSuggestion}
                onSubmit={onSubmitForm}
                loading={loading}
                projectId={projectId}
                onViewChange={handleViewChange}
              />
            )}
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
