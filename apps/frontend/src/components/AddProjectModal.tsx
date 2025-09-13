"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2, Lightbulb, ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { baseApi } from "@/lib/axios/instance";
import { BaseApiResponse } from "@/lib/interfaces/base.interface";

interface Task {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  subTask?: Task[];
}

interface ProjectFormData {
  name: string;
  description: string;
  tasks: Task[];
}

interface TaskSuggestion {
  userInput: string;
  suggestions: string[];
}

type TaskInputMode = "manual" | "ai-input" | "ai-select" | "ai-customize";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProjectFormData) => void;
  onSuccess?: () => void;
}

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

  const form = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      tasks: [],
    },
  });

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

  const onSubmitForm = async (values: ProjectFormData) => {
    setLoading(true);

    try {
      const projectData = { ...values, tasks };

      const response = await baseApi.post("/v1/projects", projectData);

      if (!response.data) {
        throw new Error("Failed to create project");
      }

      form.reset();
      setTasks([]);
      setCurrentTask({
        title: "",
        description: "",
        priority: 1,
        dueDate: "",
        subTask: [],
      });
      resetAiInput();

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      toast.error("Failed to create project", {
        description: "Please check your inputs and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Project</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Enter project description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Add Tasks (Optional)</h3>
              {taskInputMode === "ai-input" && (
                <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTaskInputMode("manual")}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <h4 className="font-medium text-blue-900">
                        Get AI Task Suggestions
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        What do you want to accomplish with this project?
                      </label>
                      <Input
                        placeholder="e.g., learn React, build an e-commerce site, improve team productivity..."
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !loadingAiSuggestions) {
                            generateTaskSuggestions();
                          }
                        }}
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={generateTaskSuggestions}
                      disabled={!aiInput.trim() || loadingAiSuggestions}
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      {loadingAiSuggestions ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating suggestions...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Generate Task Suggestions
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              {taskInputMode === "ai-select" && (
                <div className="space-y-4 mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTaskInputMode("ai-input")}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <h4 className="font-medium text-green-900">
                        Choose Tasks to Add
                      </h4>
                    </div>
                  </div>

                  <div className="bg-green-100 p-3 rounded">
                    <p className="text-sm text-green-700">
                      <strong>Goal:</strong> {aiInput}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectAiSuggestion(suggestion)}
                        className="w-full text-left p-3 border border-green-200 rounded-lg hover:border-green-300 hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <p className="text-green-800 text-sm">{suggestion}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetAiInput}
                    className="w-full"
                  >
                    Done with suggestions
                  </Button>
                </div>
              )}

              {taskInputMode === "ai-customize" && selectedAiTask && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">
                      Customize AI Suggestion
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setTaskInputMode("ai-select")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Task Title</label>
                      <Input
                        placeholder="Task title"
                        value={selectedAiTask.title}
                        onChange={(e) =>
                          updateSelectedAiTask("title", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Task description"
                        value={selectedAiTask.description}
                        onChange={(e) =>
                          updateSelectedAiTask("description", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={selectedAiTask.dueDate}
                        onChange={(e) =>
                          updateSelectedAiTask("dueDate", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedAiTask.priority}
                        onChange={(e) =>
                          updateSelectedAiTask(
                            "priority",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={confirmAiTask}
                      className="flex-1"
                    >
                      Add Task
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedAiTask(null);
                        setTaskInputMode("ai-select");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {taskInputMode === "manual" && (
                <div className="flex space-x-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTaskInputMode("ai-input")}
                    className="flex-1"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get AI Suggestions
                  </Button>
                </div>
              )}
              {taskInputMode === "manual" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Title
                      </label>
                      <Input
                        type="text"
                        value={currentTask.title}
                        onChange={(e) =>
                          handleTaskChange("title", e.target.value)
                        }
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <Input
                        type="date"
                        value={currentTask.dueDate}
                        onChange={(e) =>
                          handleTaskChange("dueDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Description
                    </label>
                    <Input
                      type="text"
                      value={currentTask.description}
                      onChange={(e) =>
                        handleTaskChange("description", e.target.value)
                      }
                      placeholder="Enter task description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={currentTask.priority}
                      onChange={(e) =>
                        handleTaskChange("priority", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>High (1)</option>
                      <option value={2}>Medium (2)</option>
                      <option value={3}>Low (3)</option>
                    </select>
                  </div>
                  <Button
                    type="button"
                    onClick={addTask}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              )}
            </div>
            {tasks.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">
                  Tasks ({tasks.length})
                </h3>
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            P{task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
