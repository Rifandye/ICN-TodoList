import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { AiCustomizeViewProps } from "../types";

export function AiCustomizeView({
  selectedAiTask,
  onUpdateSelectedTask,
  onConfirmTask,
  onCancelTask,
  onModeChange,
}: AiCustomizeViewProps) {
  if (!selectedAiTask) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Customize AI Suggestion</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onModeChange("ai-select")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Task Title</label>
          <Input
            placeholder="Task title"
            value={selectedAiTask.title}
            onChange={(e) => onUpdateSelectedTask("title", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Input
            placeholder="Task description"
            value={selectedAiTask.description}
            onChange={(e) =>
              onUpdateSelectedTask("description", e.target.value)
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Due Date</label>
          <Input
            type="date"
            value={selectedAiTask.dueDate}
            onChange={(e) => onUpdateSelectedTask("dueDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Priority</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedAiTask.priority}
            onChange={(e) =>
              onUpdateSelectedTask("priority", parseInt(e.target.value))
            }
          >
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" onClick={onConfirmTask} className="flex-1">
          Add Task
        </Button>
        <Button type="button" variant="outline" onClick={onCancelTask}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
