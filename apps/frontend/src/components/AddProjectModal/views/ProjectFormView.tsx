import { useForm } from "react-hook-form";
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProjectFormViewProps, ProjectFormData } from "../types";

export interface ProjectFormRef {
  submitForm: () => void;
}

export const ProjectFormView = forwardRef<ProjectFormRef, ProjectFormViewProps>(
  ({ onSubmit, loading, tasks }, ref) => {
    const form = useForm<ProjectFormData>({
      defaultValues: {
        name: "",
        description: "",
        tasks: [],
      },
    });

    useEffect(() => {
      form.setValue("tasks", tasks);
    }, [tasks, form]);

    const handleSubmit = (values: ProjectFormData) => {
      onSubmit({ ...values, tasks });
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(handleSubmit)();
      },
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        </form>
      </Form>
    );
  }
);

ProjectFormView.displayName = "ProjectFormView";
