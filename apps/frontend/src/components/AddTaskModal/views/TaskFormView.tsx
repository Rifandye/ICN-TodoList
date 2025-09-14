import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TaskFormViewProps, TaskFormData } from "../types";
import { useEffect, useImperativeHandle, forwardRef } from "react";

export interface TaskFormRef {
  submitForm: () => void;
}

export const TaskFormView = forwardRef<TaskFormRef, TaskFormViewProps>(
  ({ selectedSuggestion, onSubmit, loading, projectId }, ref) => {
    const form = useForm<TaskFormData>({
      defaultValues: {
        title: "",
        description: "",
        priority: 1,
        dueDate: "",
        projectId: projectId || "",
      },
    });

    useEffect(() => {
      if (selectedSuggestion) {
        form.setValue("title", selectedSuggestion);
        form.setValue("description", `Generated from AI suggestion`);
      }
    }, [selectedSuggestion, form]);

    const handleSubmit = (values: TaskFormData) => {
      onSubmit(values);
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(handleSubmit)();
      },
    }));

    return (
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
            onSubmit={form.handleSubmit(handleSubmit)}
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
          </form>
        </Form>
      </div>
    );
  }
);

TaskFormView.displayName = "TaskFormView";
