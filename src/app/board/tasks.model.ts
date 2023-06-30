export type Task = {
  id: number;
  reporter: string;
  assignee: string | null;
  name: string;
  description: string;
  status: string;
  tags: number[];
  blockedBy: number[];
};

export type Tasks = {
  todo: Task[];
  doing: Task[];
  done: Task[];
};
