import { AnimatedList } from "@/components/Filter/AnimatedList";
import { Button } from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import {
  addFilterAtom,
  anyFilterSelectedAtom,
  filtersAtom,
  filtersOpenAtom,
  removeFilterAtom,
  resetFiltersAtom,
  selectedFiltersAtom,
} from "@/state";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelIconFilled } from "@heroicons/react/24/solid";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export const Filter = () => {
  const [filtersOpen, setFiltersOpen] = useAtom(filtersOpenAtom);
  const isAnyFilterSelected = useAtomValue(anyFilterSelectedAtom);
  const [todos, diff] = useAtomValue(filtersAtom);

  return (
    <Button
      disabled={
        !isAnyFilterSelected && !todos.length && !diff.length && !filtersOpen
      }
      size="icon"
      variant={filtersOpen ? "default" : "outline"}
      aria-label="Filters"
      onClick={() => setFiltersOpen()}
    >
      {filtersOpen || isAnyFilterSelected ? (
        <FunnelIconFilled />
      ) : (
        <FunnelIcon />
      )}
    </Button>
  );
};

export const FilterOptions = () => {
  const [tags, diff] = useAtomValue(filtersAtom);
  const filtersOpen = useAtomValue(filtersOpenAtom);
  const selectedFilters = useAtomValue(selectedFiltersAtom);
  const addFilter = useSetAtom(addFilterAtom);
  const removeFilter = useSetAtom(removeFilterAtom);
  const resetFilters = useSetAtom(resetFiltersAtom);
  const isAnyFilterSelected = useAtomValue(anyFilterSelectedAtom);

  if (!filtersOpen) return null;

  return (
    <div className="mt-6">
      <Button
        disabled={!isAnyFilterSelected}
        className="mb-2 px-0"
        variant="link"
        onClick={resetFilters}
      >
        Reset filters
      </Button>
      <AnimatedList
        key={1}
        className="flex flex-wrap gap-2 mb-2"
        items={diff}
        getKey={String}
        getValue={(value) => (
          <Chip
            button
            onClick={() => {
              if (selectedFilters.difficulty.has(value)) {
                removeFilter(value, "difficulty");
              } else {
                addFilter(value, "difficulty");
              }
            }}
            variant={"difficulty"}
            outline={
              selectedFilters.difficulty.has(value) ? "selected" : undefined
            }
            difficulty={value as (typeof diff)[number]}
            key={value}
          >
            {value}
          </Chip>
        )}
      />
      <AnimatedList
        className="flex flex-wrap gap-2 mt-2"
        items={tags}
        getKey={String}
        getValue={(value) => (
          <Chip
            button
            onClick={() => {
              if (selectedFilters.tags.has(value)) {
                removeFilter(value, "tags");
              } else {
                addFilter(value, "tags");
              }
            }}
            variant={"tag"}
            outline={selectedFilters.tags.has(value) ? "selected" : undefined}
            key={value}
          >
            {value}
          </Chip>
        )}
      />
    </div>
  );
};
