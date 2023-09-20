import { Task } from '../board/tasks.model';

export const mockTask: Task = {
  id: 1,
  name: 'Task Name',
  description: 'Task Description',
  tags: [1, 2],
  assignee: 'test',
  blockedBy: [1],
  status: 'TODO',
};

export const mockTaskMissingRequiredFields: Task = {
  id: 1,
  name: '',
  description: 'Task Description',
  tags: [1, 2],
  assignee: 'test',
  blockedBy: [1],
  status: 'TODO',
};

export const mockTasks: Task[] = [
  {
    id: 1,
    name: 'Task 1',
    status: 'TODO',
    assignee: '',
    description: '',
    tags: [],
    blockedBy: [],
  },
  {
    id: 2,
    name: 'Task 2',
    status: 'DOING',
    assignee: '',
    description: '',
    tags: [],
    blockedBy: [],
  },
  {
    id: 3,
    name: 'Task 3',
    status: 'DONE',
    assignee: '',
    description: '',
    tags: [],
    blockedBy: [],
  },
];

export const mockTasks2: Task[] = [
  {
    id: 1,
    name: 'Task 1',
    status: 'TODO',
    assignee: '',
    description: '',
    tags: [],
    blockedBy: [],
  },
  {
    id: 2,
    name: 'Task 2',
    status: 'DOING',
    assignee: '',
    description: '',
    tags: [],
    blockedBy: [],
  },
  {
    id: 3,
    name: 'Task 3',
    status: 'DONE',
    assignee: '',
    description: '',
    tags: [],
    blockedBy: [],
  },
];

export const mockTags = [
  {
    id: 1,
    name: 'bug',
  },
  {
    id: 2,
    name: 'feature',
  },
];
