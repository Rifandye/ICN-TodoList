"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import BaseDialog from "@/components/Dialog";
import { baseApi } from "@/lib/axios/instance";
import { BaseApiResponse } from "@/lib/interfaces/base.interface";
import { ProjectFormView, ProjectFormRef } from "./views/ProjectFormView";
import { ManualTaskView } from "./views/ManualTaskView";
import { AiInputView } from "./views/AiInputView";
import { AiSelectView } from "./views/AiSelectView";
import { AiCustomizeView } from "./views/AiCustomizeView";
import { TaskPreview } from "./components/TaskPreview";
import {
  AddProjectModalProps,
  ProjectFormData,
  Task,
  TaskSuggestion,
  TaskInputMode,
} from "./types";

export function AddProjectModal({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}: AddProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInputMode, setTaskInputMode] = useState<TaskInputMode>("manual");
  const [aiInput, setAiInput] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);
  const [selectedAiTask, setSelectedAiTask] = useState<Task | null>(null);
  const projectFormRef = useRef<ProjectFormRef>(null);

  const [currentTask, setCurrentTask] = useState<Task>({
    title: "",
    description: "",
    priority: 1,
    dueDate: "",
    subTask: [],
  });

  const handleTaskChange = (field: keyof Task, value: string | number) => {
    setCurrentTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTask = () => {
    if (currentTask.title && currentTask.description) {
      setTasks((prev) => [...prev, currentTask]);
      setCurrentTask({
        title: "",
        description: "",
        priority: 1,
        dueDate: "",
        subTask: [],
      });
    }
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const generateTaskSuggestions = async () => {
    if (!aiInput.trim()) return;

    setLoadingAiSuggestions(true);
    try {
      const response = await baseApi.post<BaseApiResponse<TaskSuggestion>>(
        "/v1/tasks/suggestions",
        {
          userInput: aiInput.trim(),
        }
      );

      const suggestions = response.data?.data?.suggestions || [];
      if (suggestions.length === 0) {
        toast.warning("No AI suggestions available", {
          description: "Try a different prompt or add tasks manually.",
        });
        setTaskInputMode("manual");
        return;
      }

      setAiSuggestions(suggestions);
      setTaskInputMode("ai-select");
    } catch (error) {
      toast.error("Failed to generate AI suggestions", {
        description: "Please try again or add tasks manually.",
      });
      setTaskInputMode("manual");
    } finally {
      setLoadingAiSuggestions(false);
    }
  };

  const selectAiSuggestion = (suggestion: string) => {
    const newTask: Task = {
      title: suggestion,
      description: `Generated from: "${aiInput}"`,
      priority: 2,
      dueDate: "",
      subTask: [],
    };

    setSelectedAiTask(newTask);
    setTaskInputMode("ai-customize");
  };

  const confirmAiTask = () => {
    if (selectedAiTask) {
      setTasks((prev) => [...prev, selectedAiTask]);
      setSelectedAiTask(null);
      setTaskInputMode("ai-select");
    }
  };

  const updateSelectedAiTask = (field: keyof Task, value: string | number) => {
    if (selectedAiTask) {
      setSelectedAiTask((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const resetAiInput = () => {
    setAiInput("");
    setAiSuggestions([]);
    setTaskInputMode("manual");
  };

  const resetModal = () => {
    setTasks([]);
    setCurrentTask({
      title: "",
      description: "",
      priority: 1,
      dueDate: "",
      subTask: [],
    });
    resetAiInput();
    setTaskInputMode("manual");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const onSubmitForm = async (values: ProjectFormData) => {
    setLoading(true);

    try {
      const projectData = { ...values, tasks };

      const response = await baseApi.post("/v1/projects", projectData);

      if (!response.data) {
        throw new Error("Failed to create project");
      }

      toast.success("Project created successfully!", {
        description: "Your new project has been created.",
      });

      if (onSuccess) {
        onSuccess();
      }

      if (onSubmit) {
        onSubmit(projectData);
      }

      handleClose();
    } catch (error) {
      toast.error("Failed to create project", {
        description: "Please check your inputs and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSubmit = () => {
    if (projectFormRef.current) {
      projectFormRef.current.submitForm();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <BaseDialog
      title="Create New Project"
      type="create"
      onSubmit={handleDialogSubmit}
      loading={loading || loadingAiSuggestions}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <div className="mx-auto w-[1200px]">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">
                    1
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Information
                </h2>
              </div>
              <ProjectFormView
                ref={projectFormRef}
                onSubmit={onSubmitForm}
                loading={loading}
                tasks={tasks}
                onTasksChange={setTasks}
                onModeChange={setTaskInputMode}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      2
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Add Tasks
                  </h2>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Optional
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {taskInputMode === "ai-input" && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <AiInputView
                      aiInput={aiInput}
                      setAiInput={setAiInput}
                      onGenerateSuggestions={generateTaskSuggestions}
                      loadingAiSuggestions={loadingAiSuggestions}
                      onModeChange={setTaskInputMode}
                    />
                  </div>
                )}

                {taskInputMode === "ai-select" && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <AiSelectView
                      aiInput={aiInput}
                      aiSuggestions={aiSuggestions}
                      onSelectSuggestion={selectAiSuggestion}
                      onResetAiInput={resetAiInput}
                      onModeChange={setTaskInputMode}
                    />
                  </div>
                )}

                {taskInputMode === "ai-customize" && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <AiCustomizeView
                      selectedAiTask={selectedAiTask}
                      onUpdateSelectedTask={updateSelectedAiTask}
                      onConfirmTask={confirmAiTask}
                      onCancelTask={() => {
                        setSelectedAiTask(null);
                        setTaskInputMode("ai-select");
                      }}
                      onModeChange={setTaskInputMode}
                    />
                  </div>
                )}

                {taskInputMode === "manual" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <ManualTaskView
                      currentTask={currentTask}
                      onTaskChange={handleTaskChange}
                      onAddTask={addTask}
                      onModeChange={setTaskInputMode}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">3</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              {tasks.length > 0 && (
                <span className="ml-auto text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              <TaskPreview tasks={tasks} onRemoveTask={removeTask} />
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
