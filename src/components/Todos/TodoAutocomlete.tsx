import { AutoComplete } from "@/components/Search";
import type { TodoItem } from "@/app/types";
import { getSuggestions, type SuggestionDto } from "@/actions/problems";
import { useState, type FC } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useDebouncedEffect } from "@/lib/useDebouncedEffect";
import { useInitialRender } from "@/lib/useInitialRender";
import { useSetAtom } from "jotai";
import { todosAtom } from "@/state";

interface TodoAutocompleteProps {
  todo: TodoItem;
}

export const TodoAutocomplete: FC<TodoAutocompleteProps> = ({ todo }) => {
  const [searchValue, setSearchValue] = useState(todo.title);
  const [items, setItems] = useState<SuggestionDto>([]);
  const [debSearchValue, setDebSearchValue] = useDebounceValue<string>("", 300);
  const [isLoading, setIsLoading] = useState(false);
  const initialRender = useInitialRender();
  const setTodos = useSetAtom(todosAtom);

  const onSetSelectedValue =
    (id: string) => async (suggestion: SuggestionDto[number] | null) => {
      setTodos((todos) =>
        todos.map((todo) => {
          if (todo.id === id) {
            if (!suggestion) {
              return {
                ...todo,
                title: "",
                difficulty: undefined,
              };
            }
            return {
              ...todo,
              title: suggestion.label,
              difficulty: suggestion.data.difficulty,
              tags: suggestion.data.topicTags,
              titleSlug: suggestion.data.titleSlug,
              QID: suggestion.id,
            };
          }
          return todo;
        })
      );
    };

  const onSetSearchValue = (id: string) => async (title: string) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title,
          };
        }
        return todo;
      })
    );
  };

  const _onSetSearchValue = (value: string) => {
    setSearchValue(value);
    onSetSearchValue(value);
    setDebSearchValue(value);
  };

  const load = async () => {
    if (initialRender || isLoading || searchValue.length < 3) return;

    setIsLoading(true);
    const data = await getSuggestions(searchValue);
    setIsLoading(false);
    setItems(data);
  };

  useDebouncedEffect(
    () => {
      load();
    },
    [debSearchValue],
    300
  );

  return (
    <AutoComplete
      searchValue={searchValue}
      onSearchValueChange={_onSetSearchValue}
      items={items}
      onSelectedValueChange={(s) => {
        onSetSelectedValue(s);
      }}
      selectedId={todo.QID}
      emptyMessage="Search by problem number, title or URL"
      isLoading={isLoading}
    />
  );
};
