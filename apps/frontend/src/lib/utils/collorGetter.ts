import { TaskStatus } from "../interfaces/task.interface";

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "PENDING":
      return "Pending";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

export const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1:
      return "bg-red-100 text-red-800";
    case 2:
      return "bg-orange-100 text-orange-800";
    case 3:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
