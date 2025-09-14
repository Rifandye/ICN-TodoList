"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import useBaseSWR from "@/hooks/shared/useBaseSwr";
import { BaseApiResponse } from "@/lib/interfaces/base.interface";
import { IProjectWithTasks } from "@/lib/interfaces/task.interface";
import { useProjectStore } from "@/store/projectStore";
import { toast } from "sonner";
import { AddProjectModal } from "@/components/AddProjectModal/index";

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { fetchProjects } = useProjectStore();

  const { data, error, isLoading, mutate } = useBaseSWR<
    BaseApiResponse<IProjectWithTasks[]>
  >({
    url: "/v1/projects/tasks",
  });

  const handleProjectSuccess = () => {
    mutate();
    fetchProjects();
    toast.success("Project created successfully!", {
      description: "Your new project has been added to your dashboard.",
    });
  };

  const projects = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            Error loading projects: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first project
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
        )}
      </div>
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleProjectSuccess}
      />
    </div>
  );
}
