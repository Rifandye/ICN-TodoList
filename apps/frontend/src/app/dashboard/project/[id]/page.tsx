"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import useBaseSWR from "@/hooks/shared/useBaseSwr";
import { BaseApiResponse } from "@/lib/interfaces/base.interface";
import { IProjectWithTasks } from "@/lib/interfaces/task.interface";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskModal } from "@/components/AddTaskModal/index";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const { data, error, isLoading, mutate } = useBaseSWR<
    BaseApiResponse<IProjectWithTasks>
  >({
    url: `/v1/projects/${projectId}/tasks`,
  });

  const project = data?.data;

  const handleTaskSuccess = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading project: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <p>Project not found</p>
        </div>
      </div>
    );
  }

  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tasksByStatus = {
    PENDING: project.tasks.filter((task) => task.status === "PENDING"),
    IN_PROGRESS: project.tasks.filter((task) => task.status === "IN_PROGRESS"),
    COMPLETED: project.tasks.filter((task) => task.status === "COMPLETED"),
    CANCELLED: project.tasks.filter((task) => task.status === "CANCELLED"),
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {project.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {completedTasks}/{totalTasks} tasks completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {tasksByStatus.PENDING.length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tasksByStatus.IN_PROGRESS.length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tasksByStatus.COMPLETED.length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {tasksByStatus.CANCELLED.length}
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Tasks</h3>

        {totalTasks === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No tasks yet
              </h4>
              <p className="text-gray-500 mb-4">
                Start by adding your first task to this project
              </p>
              <Button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Active Tasks</h4>
              <div className="space-y-3">
                {[...tasksByStatus.PENDING, ...tasksByStatus.IN_PROGRESS].map(
                  (task) => (
                    <TaskCard key={task.id} task={task} onUpdate={mutate} />
                  )
                )}
                {tasksByStatus.PENDING.length === 0 &&
                  tasksByStatus.IN_PROGRESS.length === 0 && (
                    <p className="text-gray-500 text-sm">No active tasks</p>
                  )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Completed Tasks</h4>
              <div className="space-y-3">
                {[...tasksByStatus.COMPLETED, ...tasksByStatus.CANCELLED].map(
                  (task) => (
                    <TaskCard key={task.id} task={task} onUpdate={mutate} />
                  )
                )}
                {tasksByStatus.COMPLETED.length === 0 &&
                  tasksByStatus.CANCELLED.length === 0 && (
                    <p className="text-gray-500 text-sm">No completed tasks</p>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSuccess={handleTaskSuccess}
        projectId={projectId}
      />
    </div>
  );
}
