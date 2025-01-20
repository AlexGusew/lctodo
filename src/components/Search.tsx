import React from "react";
import { Input } from "@/components/ui/input";
import type { Question, TodoItem } from "@/app/types";

interface SearchProps {
  todo: TodoItem;
  toggleChangeTodo: (id: string) => void;
  changeTodo: (id: string, title: string) => void;
  questions: Question[] | null;
}

const Search: React.FC<SearchProps> = ({
  todo,
  toggleChangeTodo,
  changeTodo,
  questions,
}) => {
  console.log(questions);
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        toggleChangeTodo(todo.id);
      }}
    >
      <Input
        placeholder="Problem number or link"
        onFocus={(e) => e.target.select()}
        type="text"
        value={todo.title}
        onBlur={() => toggleChangeTodo(todo.id)}
        onChange={(e) => changeTodo(todo.id, e.target.value)}
        className="border-none !ring-0 !text-base"
        autoFocus
      />
    </form>
  );
};

export default Search;
