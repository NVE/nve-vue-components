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
  /* if true: Vis teksten på en linje. Kutt den med "...", vis hele teksten på hover */
  /* Kan kun brukes på "enkel" celle. Dersom du bruker template etc så må du gjøre dette selv */
  singleLineOverflow?: boolean;
};

export type TableProps<T> = {
  headers: Array<TableHeader<T>>;
  itemId: (item: T, index: number) => string | number;
  pageSize?: number;
  pageSizeOptions?: Array<number>;
  striped?: boolean;
  hideTextFilter?: boolean;
  /* 
    brukes ikke direkte, men kun via eventlistener 
    vi har det her for å kunne sjekke om det finnes en listener i parent
  */
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
  filterTextInputSize?: "small" | "medium";
  hoverRowEffect?: boolean;
  tableBorder?: boolean /* (!) Dersom cellBorder er satt har tableBorder ingen effekt */;
  cellBorder?: boolean;
  hideUnderline?: boolean;
  stickyFirstColumn?: boolean;
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
