export type TaskType = "task" | "subtask";

export interface Task {
  id: string;
  title: string;
  description: string;
  note: string;
  type: TaskType;
}

export interface TaskData extends Task {
  subtasks?: Task[];
}
