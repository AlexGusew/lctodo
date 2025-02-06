import type { TodoItem } from "@/app/types";
import { getDisplayDate } from "@/components/TodoDatePicker";
import { AnimatePresence } from "motion/react";
import { Fragment, useMemo, type ReactNode } from "react";

interface TodosByDateProps {
  todos: TodoItem[];
  renderTodo: (todo: TodoItem) => ReactNode;
  increasing?: boolean;
}

export const TodosByDate = ({
  todos,
  renderTodo,
  increasing = true,
}: TodosByDateProps) => {
  const [grouped, keys, rest] = useMemo(() => {
    const groupedByDate = todos.reduce(
      (acc, todo) => {
        const key = todo.date ? todo?.date?.getTime() : "rest";
        if (!(key in acc)) {
          acc[key] = [];
        }
        acc[key].push(todo);
        return acc;
      },
      { rest: [] } as Record<string | "rest", TodoItem[]>
    );

    const rest = groupedByDate["rest"];
    delete groupedByDate["rest"];
    const keys = Object.keys(groupedByDate);
    if (increasing) {
      keys.sort((a, b) => Number(a) - Number(b));
    } else {
      keys.sort((a, b) => Number(b) - Number(a));
    }
    return [groupedByDate, keys, rest];
  }, [increasing, todos]);

  const mapTodos = (todos: TodoItem[]) => {
    return (
      <ul className="grid grid-cols-1 gap-2">
        <AnimatePresence initial={false}>
          {todos.map(renderTodo)}
        </AnimatePresence>
      </ul>
    );
  };

  const renderTitle = (title: string) => {
    return (
      <div className="mt-10 mb-6 opacity-60 text-sm first:mt-0">{title}</div>
    );
  };

  const rendered = (
    <>
      {keys.map((key) => {
        const todos = grouped[key];
        const date = todos[0].date;

        return (
          <Fragment key={key}>
            {renderTitle(getDisplayDate(date))}
            {mapTodos(todos)}
          </Fragment>
        );
      })}
      {!!rest.length && (
        <>
          {renderTitle("Better Late Than Never")}
          {mapTodos(rest)}
        </>
      )}
    </>
  );

  return <ul className="mt-4">{rendered}</ul>;
};
