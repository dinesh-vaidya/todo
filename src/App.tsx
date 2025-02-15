import React, { useState, useEffect } from 'react';
import { ArrowDownAZ, ArrowUpAZ, Calendar, Trash2 } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { Todo, SortType, SortDirection } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    }
    return [];
  });
  
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  const [activeSortType, setActiveSortType] = useState<SortType>('datetime');
  const [activeSortDirection, setActiveSortDirection] = useState<SortDirection>('desc');
  const [completedSortType, setCompletedSortType] = useState<SortType>('datetime');
  const [completedSortDirection, setCompletedSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const addTodo = (todoData: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    setEditingTodo(null);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const deleteAllCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const deleteAllActive = () => {
    setTodos(prev => prev.filter(todo => todo.completed));
  };

  const sortTodos = (todos: Todo[], sortType: SortType, sortDirection: SortDirection) => {
    return [...todos].sort((a, b) => {
      if (sortType === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return sortDirection === 'desc' ? diff : -diff;
      } else {
        const diff = b.createdAt.getTime() - a.createdAt.getTime();
        return sortDirection === 'desc' ? diff : -diff;
      }
    });
  };

  const activeTodos = sortTodos(
    todos.filter(todo => !todo.completed),
    activeSortType,
    activeSortDirection
  );

  const completedTodos = sortTodos(
    todos.filter(todo => todo.completed),
    completedSortType,
    completedSortDirection
  );

  const TodoList = ({ 
    title, 
    todos, 
    sortType, 
    sortDirection, 
    onSortTypeChange, 
    onSortDirectionChange,
    onDeleteAll,
    deleteButtonText
  }: {
    title: string;
    todos: Todo[];
    sortType: SortType;
    sortDirection: SortDirection;
    onSortTypeChange: () => void;
    onSortDirectionChange: () => void;
    onDeleteAll: () => void;
    deleteButtonText: string;
  }) => (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onSortTypeChange}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowDownAZ className="w-5 h-5" />
            <span>Sort by {sortType === 'priority' ? 'Date' : 'Priority'}</span>
          </button>
          <button
            onClick={onSortDirectionChange}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {sortDirection === 'desc' ? (
              <ArrowDownAZ className="w-5 h-5" />
            ) : (
              <ArrowUpAZ className="w-5 h-5" />
            )}
            <span>{sortDirection === 'desc' ? 'Descending' : 'Ascending'}</span>
          </button>
          {todos.length > 0 && (
            <button
              onClick={onDeleteAll}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>{deleteButtonText}</span>
            </button>
          )}
        </div>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Calendar className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">No {title.toLowerCase()}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={() => setEditingTodo(todo)}
              isEditing={editingTodo?.id === todo.id}
              onUpdate={updateTodo}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Todo App
          </h1>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>

        <TodoForm onAdd={addTodo} />

        <TodoList
          title="Active Tasks"
          todos={activeTodos}
          sortType={activeSortType}
          sortDirection={activeSortDirection}
          onSortTypeChange={() => setActiveSortType(activeSortType === 'priority' ? 'datetime' : 'priority')}
          onSortDirectionChange={() => setActiveSortDirection(activeSortDirection === 'desc' ? 'asc' : 'desc')}
          onDeleteAll={deleteAllActive}
          deleteButtonText="Delete All Active"
        />

        <TodoList
          title="Completed Tasks"
          todos={completedTodos}
          sortType={completedSortType}
          sortDirection={completedSortDirection}
          onSortTypeChange={() => setCompletedSortType(completedSortType === 'priority' ? 'datetime' : 'priority')}
          onSortDirectionChange={() => setCompletedSortDirection(completedSortDirection === 'desc' ? 'asc' : 'desc')}
          onDeleteAll={deleteAllCompleted}
          deleteButtonText="Delete All Completed"
        />
      </div>
    </div>
  );
}

export default App;