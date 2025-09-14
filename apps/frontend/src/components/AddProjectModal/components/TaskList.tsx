import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  onRemoveTask: (index: number) => void;
}

export function TaskList({ tasks, onRemoveTask }: TaskListProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-4 sticky top-0 bg-white z-10">
        Tasks ({tasks.length})
      </h3>
      <div className="space-y-2 pr-2">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  P{task.priority}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">{task.dueDate}</span>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveTask(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
