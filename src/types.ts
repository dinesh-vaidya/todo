export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

export type SortType = 'priority' | 'datetime';
export type SortDirection = 'asc' | 'desc';