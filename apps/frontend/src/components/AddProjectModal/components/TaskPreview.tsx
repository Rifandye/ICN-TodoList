import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "../types";

interface TaskPreviewProps {
  tasks: Task[];
  onRemoveTask: (index: number) => void;
}

interface TaskPreviewEmptyProps {
  className?: string;
}

interface TaskPreviewListProps {
  tasks: Task[];
  onRemoveTask: (index: number) => void;
}

interface TaskPreviewCardProps {
  task: Task;
  index: number;
  onRemove: (index: number) => void;
}

const getPriorityStyle = (priority: number) => {
  switch (priority) {
    case 1:
      return "bg-red-100 text-red-700";
    case 2:
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
};

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1:
      return "High";
    case 2:
      return "Medium";
    default:
      return "Low";
  }
};

function TaskPreviewEmpty({ className = "" }: TaskPreviewEmptyProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 ${className}`}
    >
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <Plus className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium mb-1">No tasks yet</p>
      <p className="text-xs text-center px-4">
        Add tasks using the form to see them here
      </p>
    </div>
  );
}

function TaskPreviewCard({ task, index, onRemove }: TaskPreviewCardProps) {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm mb-2 truncate">
            {task.title}
          </h4>
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityStyle(
                task.priority
              )}`}
            >
              {getPriorityLabel(task.priority)}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500 truncate">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function TaskPreviewList({ tasks, onRemoveTask }: TaskPreviewListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <TaskPreviewCard
          key={index}
          task={task}
          index={index}
          onRemove={onRemoveTask}
        />
      ))}
    </div>
  );
}

export function TaskPreview({ tasks, onRemoveTask }: TaskPreviewProps) {
  if (tasks.length === 0) {
    return <TaskPreviewEmpty />;
  }

  return <TaskPreviewList tasks={tasks} onRemoveTask={onRemoveTask} />;
}

export { TaskPreviewEmpty, TaskPreviewList, TaskPreviewCard };
