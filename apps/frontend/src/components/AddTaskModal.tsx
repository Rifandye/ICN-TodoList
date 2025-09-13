"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Lightbulb, Plus, ArrowLeft, Loader2 } from "lucide-react";
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

interface TaskFormData {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  projectId?: string;
}

interface TaskSuggestion {
  userInput: string;
  suggestions: string[];
}

type ModalView = "suggestion" | "form" | "select-suggestion";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TaskFormData) => void;
  onSuccess?: () => void;
  projectId?: string;
}

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

  const form = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: 1,
      dueDate: "",
      projectId: projectId || "",
    },
  });

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
    form.setValue("title", suggestion);
    form.setValue("description", `Generated from: "${suggestionInput}"`);
    setCurrentView("form");
  };

  const resetModal = () => {
    setCurrentView("suggestion");
    setSuggestionInput("");
    setSuggestions([]);
    setSelectedSuggestion("");
    form.reset();
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

      form.reset();

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {currentView !== "suggestion" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentView === "form" && selectedSuggestion) {
                    setCurrentView("select-suggestion");
                  } else if (currentView === "select-suggestion") {
                    setCurrentView("suggestion");
                  } else {
                    setCurrentView("suggestion");
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-xl font-semibold">
              {currentView === "suggestion" && "Add New Task"}
              {currentView === "select-suggestion" && "Choose a Suggestion"}
              {currentView === "form" &&
                (selectedSuggestion ? "Complete Task Details" : "Add New Task")}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {currentView === "suggestion" && (
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
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !loadingSuggestions) {
                      generateSuggestions();
                    }
                  }}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={generateSuggestions}
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
                  onClick={() => setCurrentView("form")}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task Manually
                </Button>
              </div>
            </div>
          </div>
        )}
        {currentView === "select-suggestion" && (
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
                    onClick={() => selectSuggestion(suggestion)}
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
              onClick={() => setCurrentView("form")}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Custom Task Instead
            </Button>
          </div>
        )}

        {currentView === "form" && (
          <div className="space-y-4">
            {selectedSuggestion && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Selected:</strong> {selectedSuggestion}
                </p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
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
                          placeholder="Enter task description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          >
                            <option value={1}>High (1)</option>
                            <option value={2}>Medium (2)</option>
                            <option value={3}>Low (3)</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!projectId && (
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Select or enter project ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
