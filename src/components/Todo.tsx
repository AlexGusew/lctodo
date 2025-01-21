"use client";

import { useCallback, useEffect, useState } from "react";
import type { TodoItem } from "@/app/types";
import TodoItemComponent from "@/components/TodoItemComponent";

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTodo = useCallback((initialItem: Partial<TodoItem> = {}) => {
    const newTodo: TodoItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      done: false,
      ...initialItem,
    };
    setTodos((todos) => [newTodo, ...todos]);
  }, []);

  const onSetSelectedValue = (id: string) => (title: string) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, title };
        }
        return todo;
      })
    );
    if (todos[0].title) {
      addTodo();
    }
  };

  const toggleTodo = (id: string) => () => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });
      newTodos.sort((a, b) => {
        if (!a.title) {
          return -1;
        }
        if (!b.title) {
          return 1;
        }
        if (a.done && !b.done) {
          return 1;
        }
        if (!a.done && b.done) {
          return -1;
        }
        return 0;
      });
      return newTodos;
    });
  };

  useEffect(() => {
    if (todos.length === 0 || todos[0].title) {
      addTodo();
    }
  }, [addTodo, todos]);

  const addDate = (id: string) => (value: number) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id && todo.date) {
          const newDate = new Date(todo.date);
          newDate.setDate(newDate.getDate() + value);
          return { ...todo, date: newDate };
        }
        return todo;
      });
      return newTodos;
    });
  };

  const handleDateChange = (id: string) => (date?: Date) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, date };
        }
        return todo;
      });
      return newTodos;
    });
  };

  return (
    <>
      <ul className="grid grid-cols-1 gap-6">
        {todos.map((todo) => (
          <TodoItemComponent
            key={todo.id.toString()}
            todo={todo}
            toggleTodo={toggleTodo(todo.id)}
            handleDateChange={handleDateChange(todo.id)}
            addDate={addDate(todo.id)}
            onSetSelectedValue={onSetSelectedValue(todo.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default Todo;
