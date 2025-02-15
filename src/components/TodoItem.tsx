import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Check, X, Save } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isEditing: boolean;
  onUpdate: (todo: Todo) => void;
}

const priorityColors = {
  low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
  medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
  high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
};

export function TodoItem({ todo, onToggle, onDelete, onEdit, isEditing, onUpdate }: TodoItemProps) {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedPriority, setEditedPriority] = useState(todo.priority);

  useEffect(() => {
    if (isEditing) {
      setEditedTitle(todo.title);
      setEditedDescription(todo.description);
      setEditedPriority(todo.priority);
    }
  }, [isEditing, todo]);

  const handleUpdate = () => {
    if (!editedTitle.trim()) return;
    onUpdate({
      ...todo,
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    });
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 dark:border-gray-600'
        } flex items-center justify-center`}
      >
        {todo.completed && <Check className="w-4 h-4 text-white" />}
      </button>
      
      <div className="flex-grow">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              rows={3}
            />
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value as Todo['priority'])}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <h3 className={`text-lg font-medium ${
                todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
              }`}>
                {todo.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
                {todo.priority}
              </span>
            </div>
            <p className="mt-1 text-gray-600 dark:text-gray-300">{todo.description}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {new Date(todo.createdAt).toLocaleString()}
            </p>
          </>
        )}
      </div>

      <div className="flex-shrink-0 space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="p-2 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(todo.id)}
              className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(todo.id)}
              className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}