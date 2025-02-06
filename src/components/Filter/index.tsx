import { AnimatedList } from "@/components/Filter/AnimatedList";
import { Button } from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import {
  addFilterAtom,
  filtersAtom,
  filtersOpenAtom,
  removeFilterAtom,
  selectedFiltersAtom,
} from "@/state";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelIconFilled } from "@heroicons/react/24/solid";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export const Filter = () => {
  const [filtersOpen, setFiltersOpen] = useAtom(filtersOpenAtom);
  const selectedFilters = useAtomValue(selectedFiltersAtom);

  return (
    <>
      <Button
        size="icon"
        variant={filtersOpen ? "default" : "outline"}
        aria-label="Filters"
        onClick={() => setFiltersOpen()}
      >
        {filtersOpen || !!selectedFilters.size ? (
          <FunnelIconFilled />
        ) : (
          <FunnelIcon />
        )}
      </Button>
    </>
  );
};

export const FilterOptions = () => {
  const [tags, diff] = useAtomValue(filtersAtom);
  const filtersOpen = useAtomValue(filtersOpenAtom);
  const selectedFilters = useAtomValue(selectedFiltersAtom);
  const addFilter = useSetAtom(addFilterAtom);
  const removeFilter = useSetAtom(removeFilterAtom);

  if (!filtersOpen) return null;

  return (
    <div className="mt-6">
      <AnimatedList
        key={1}
        className="flex flex-wrap gap-2 mb-2"
        items={diff}
        getKey={String}
        getValue={(value) => (
          <Chip
            button
            onClick={() => {
              if (selectedFilters.has(value)) {
                removeFilter(value);
              } else {
                addFilter(value);
              }
            }}
            variant={"difficulty"}
            outline={selectedFilters.has(value) ? "selected" : undefined}
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
              if (selectedFilters.has(value)) {
                removeFilter(value);
              } else {
                addFilter(value);
              }
            }}
            variant={"tag"}
            outline={selectedFilters.has(value) ? "selected" : undefined}
            key={value}
          >
            {value}
          </Chip>
        )}
      />
    </div>
  );
};
