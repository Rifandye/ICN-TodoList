import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import { ITask, TaskStatus } from "@/lib/interfaces/task.interface";
import { baseApi } from "@/lib/axios/instance";
import { EditTaskModal } from "./EditTaskModal";
import BaseDialog from "./Dialog";
import {
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils/collorGetter";

interface TaskCardProps {
  task: ITask;
  onUpdate?: () => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.status === "COMPLETED").length || 0;

  const handleStatusUpdate = async () => {
    setIsUpdating(true);

    try {
      const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

      const response = await baseApi.put(`/v1/tasks/${task.id}`, {
        status: newStatus,
      });

      if (!response.data) {
        throw new Error("Failed to update task status");
      }

      if (onUpdate) onUpdate();

      toast.success("Task status updated!", {
        description: `Task marked as ${newStatus
          .toLowerCase()
          .replace("_", " ")}.`,
      });
    } catch (error) {
      toast.error("Failed to update task status", {
        description: "Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      const response = await baseApi.delete(`/v1/tasks/${task.id}/delete`);

      if (!response.data) {
        throw new Error("Failed to delete task");
      }

      if (onUpdate) onUpdate();
      setShowDeleteConfirm(false);

      toast.success("Task deleted successfully!", {
        description: "The task has been removed from your project.",
      });
    } catch (error) {
      toast.error("Failed to delete task", {
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-200 ${
        isOverdue ? "border-red-200" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            {getStatusIcon(task.status)}
            <CardTitle className="text-lg">{task.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              P{task.priority}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(task.status)}`}>
              {getStatusLabel(task.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              Due {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && " (Overdue)"}
            </span>
          </div>

          {subtaskCount > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtasks</span>
                <span className="text-gray-900 font-medium">
                  {completedSubtasks}/{subtaskCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      subtaskCount > 0
                        ? (completedSubtasks / subtaskCount) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 ${
                task.status === "COMPLETED"
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
              onClick={handleStatusUpdate}
              disabled={isUpdating}
            >
              {isUpdating
                ? "Updating..."
                : task.status === "COMPLETED"
                ? "Mark Pending"
                : "Mark Done"}
            </Button>
          </div>
        </div>
      </CardContent>
      <BaseDialog
        title="Delete Task"
        onSubmit={handleDeleteTask}
        loading={isDeleting}
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete &quot;{task.title}&quot;? This action
          cannot be undone.
        </p>
      </BaseDialog>
      <EditTaskModal
        task={task}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={onUpdate}
      />
    </Card>
  );
}
