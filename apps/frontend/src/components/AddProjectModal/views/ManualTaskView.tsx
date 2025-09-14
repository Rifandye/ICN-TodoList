import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Lightbulb } from "lucide-react";
import { ManualTaskViewProps } from "../types";

export function ManualTaskView({
  currentTask,
  onTaskChange,
  onAddTask,
  onModeChange,
}: ManualTaskViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onModeChange("ai-input")}
          className="flex-1"
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          Get AI Suggestions
        </Button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <Input
              type="text"
              value={currentTask.title}
              onChange={(e) => onTaskChange("title", e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={currentTask.dueDate}
              onChange={(e) => onTaskChange("dueDate", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <Input
            type="text"
            value={currentTask.description}
            onChange={(e) => onTaskChange("description", e.target.value)}
            placeholder="Enter task description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={currentTask.priority}
            onChange={(e) => onTaskChange("priority", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>High (1)</option>
            <option value={2}>Medium (2)</option>
            <option value={3}>Low (3)</option>
          </select>
        </div>
        <Button
          type="button"
          onClick={onAddTask}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
