export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ITask {
  createdAt: string;
  updatedAt: string;
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  parentTaskId: string | null;
  projectId: string;
  dueDate: string;
  subtasks: ITask[];
}

export interface IProject {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  description: string;
  userId: string;
}

export interface IProjectWithTasks extends IProject {
  tasks: ITask[];
}
