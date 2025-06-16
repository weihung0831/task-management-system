export type TaskPriority = "高優先" | "中優先" | "低優先";
export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  assignee: string;
}