import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { IProjectWithTasks, TaskStatus } from "@/lib/interfaces/task.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProjectStore } from "@/store/projectStore";
import BaseDialog from "./Dialog";
import {
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils/collorGetter";

interface ProjectCardProps {
  project: IProjectWithTasks;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { deleteProject } = useProjectStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleViewProject = () => {
    router.push(`/dashboard/project/${project.id}`);
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      setShowDeleteConfirm(false);

      toast.success("Project deleted successfully!", {
        description: "The project and all its tasks have been removed.",
      });
    } catch (error) {
      toast.error("Failed to delete project", {
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {completedTasks}/{totalTasks} tasks
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewProject}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Recent Tasks</h4>
            {project.tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </Badge>
                    <Badge
                      className={`text-xs ${getPriorityColor(task.priority)}`}
                    >
                      P{task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleViewProject}
          >
            View Project
          </Button>
        </div>
      </CardContent>
      <BaseDialog
        title="Delete Project"
        onSubmit={handleDeleteProject}
        loading={isDeleting}
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete &quot;{project.name}&quot;? This
          action cannot be undone and will also delete all associated tasks.
        </p>
      </BaseDialog>
    </Card>
  );
}
