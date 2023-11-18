export type TaskType = "task" | "subtask";

export interface Task {
  id: string;
  title: string;
  vender: string;
  quantity: number;
  quatUnit: string;
  materialCost: number;
  totalMaterial: number;
  labourCost: number;
  totalLabour: number;
  totalPrice: number;
  note: string;
  type: TaskType;
}

export interface TaskData extends Task {
  subtasks?: Task[];
}
