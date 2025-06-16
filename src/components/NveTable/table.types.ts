import type { StyleValue } from "vue";

export type SorterType = {
  field: string;
  direction: "ASC" | "DESC";
};

export type SortFunction = (sort: SorterType) => (a: any, b: any) => number;

export type TableHeader<T> = {
  key: string;
  title: string;
  sort?: SortFunction;
  accessor?: (item: T) => string | number | Date | boolean | null | undefined;
  width?: string;
  cellClass?: ((item: T) => string) | string;
  style?: StyleValue;
  headerClass?: string;
  headerWrap?: boolean;
  hidden?: boolean;
};

export type TableProps<T> = {
  headers: Array<TableHeader<T>>;
  itemId: (item: T, index: number) => string | number;
  pageSize?: number;
  striped?: boolean;
  hideTextFilter?: boolean;
  onClickRow?: (item: T, event: MouseEvent) => void;
  hasClickForRow?: (row: T) => boolean;
  rowClass?: (item: T) => string;
  initialSort?: SorterType | null;
  hidePagination?: boolean;
  hideHeader?: boolean;
  hideTableHeader?: boolean;
  hideEmpty?: boolean;
  tableclass?: string;
  tableholderclass?: string;
  stickyHeader?: boolean;
  scrollToTopOnPageSwitch?: boolean;
  hideAllFilters?: boolean;
};

export type SyncTableProps<T> = TableProps<T> & {
  async?: false;
  data: Array<T>;
  saveStateId?: string;
  filterFunction?: (searchString: string) => Array<T>;
  getData?: never;
  totalHits?: never;
};

export type AsyncTableProps<T> = TableProps<T> & {
  async: true;
  getData: (
    pageNumber: number,
    filterText: string,
    sort: SorterType | null
  ) => Promise<Array<T>>;
  totalHits: number;
  data?: never;
  saveStateId?: never;
  filterFunction?: never;
};
