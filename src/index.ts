import NveTable from "./components/NveTable.vue";
import type {
  TableHeader,
  SortFunction,
  SorterType,
  TableProps,
} from "./components/NveTable.vue";
import {
  sortByFunction,
  sortByProperty,
} from "./components/tableSortFunctions";

export { NveTable };
export { sortByFunction, sortByProperty };
export type { TableHeader, SortFunction, SorterType, TableProps };
