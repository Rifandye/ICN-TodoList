"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
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
import { ITask } from "@/lib/interfaces/task.interface";

interface EditTaskFormData {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  status: string;
}

interface EditTaskModalProps {
  task: ITask;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSuccess,
}: EditTaskModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<EditTaskFormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      status: task.status,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        status: task.status,
      });
    }
  }, [task, form]);

  const { handleSubmit } = form;

  const onSubmit = async (data: EditTaskFormData) => {
    setLoading(true);

    try {
      const response = await baseApi.put(`/v1/tasks/${task.id}`, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        status: data.status,
      });

      if (!response.data) {
        throw new Error("Failed to update task");
      }

      toast.success("Task updated successfully!", {
        description: "Your changes have been saved.",
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      toast.error("Failed to update task", {
        description: "Please check your inputs and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value={1}>High Priority</option>
                      <option value={2}>Medium Priority</option>
                      <option value={3}>Low Priority</option>
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
