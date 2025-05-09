<script setup lang="ts" generic="T extends Record<string, any>">
import {
  computed,
  ref,
  watch,
  type StyleValue,
  onMounted,
  type Ref,
} from "vue";
import { NveButton, NveInput, NveIcon, NveSpinner } from "nve-designsystem";
import { computedAsync } from "@vueuse/core";

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
  cellClass?: string;
  style?: StyleValue;
  headerClass?: string;
  headerWrap?: boolean;
  hidden?: boolean;
};
export type TableProps<T> = {
  headers: Array<TableHeader<T>>;
  itemId: (item: T, index: number) => string | number;
  pageSize?: number;
  /* zebra-striper eller underline */
  striped?: boolean;
  hideTextFilter?: boolean;
  onClickRow?: (item: T, event: MouseEvent) => void;
  /** Brukes for å stoppe klikk på en row
   * (kan være at akkurat rad 5 ikke skal kunne klikkes på f.eks)
   * Da vil ikke styling vise "klikkbar" på denne raden
   */
  hasClickForRow?: (row: T) => boolean;
  /* (i) Dersom du har funksjonsknapper i celler, pass på å kjøre stopPropagation på disse for å ikke kalle onClickRow */
  rowClass?: (item: T) => string;
  /* Initiell sortering dersom man ønsker å sortere på en kolonne ved oppstart */
  initialSort?: SorterType | null;
  /* Gjemmer hele pagineringen. Bruk dersom du skal vise alle */
  hidePagination?: boolean;
  /* Tar bort hele header over tabellen (inkludert filter) */
  hideHeader?: boolean;
  /* Viser ikke <thead> med <th> */
  hideTableHeader?: boolean;
  /* Viser ikke tabellen dersom det ikke er data */
  hideEmpty?: boolean;
  /* Klasse for tabellen */
  tableclass?: string;
  /* Klasse for tableholder. Slot subheader, Tabellen, paginering og slot tablefooter er inne i denne */
  tableholderclass?: string;
  /* header er sticky. Ved scroll vil ikke header følge med */
  stickyHeader?: boolean;
  /* For paginering. Dersom man går til side 2 i tabellen så scroller vi til topp */
  scrollToTopOnPageSwitch?: boolean;
  hideAllFilters?: boolean;
};

export type SyncTableProps<T> = TableProps<T> & {
  async?: false;
  data: Array<T>;
  /* Dersom denne er satt så lagrer vi state i localstorage slik at denne beholdes ved navigering */
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

const emit = defineEmits<{
  setExternalData: [val: Record<string, any>];
}>();
const props = withDefaults(
  defineProps<SyncTableProps<T> | AsyncTableProps<T>>(),
  {
    async: false,
    pageSize: undefined,
    onClickRow: undefined,
    filterFunction: undefined,
    saveStateId: undefined,
    tableclass: undefined,
    tableholderclass: undefined,
    hasClickForRow: undefined,
    stickyHeader: false,
    scrollToTopOnPageSwitch: false,
    initialSort: null,
    rowClass: undefined,
    itemId: (_, index: number) => index,
    hideAllFilters: false,
  }
);

function isAsyncTable(
  props: SyncTableProps<T> | AsyncTableProps<T>
): props is AsyncTableProps<T> {
  return props.async === true;
}

function isSyncTable(
  props: SyncTableProps<T> | AsyncTableProps<T>
): props is SyncTableProps<T> {
  return props.async === false;
}
let filterText = ref("");
const pageNumber = ref<number>(0);
const isFetchingData = ref(false);
const numPages = computed(() => {
  if (isAsyncTable(props)) {
    return Math.ceil(props.totalHits / (props.pageSize ?? 1));
  } else if (isSyncTable(props)) {
    return props.pageSize
      ? Math.ceil((filteredData.value?.length ?? 0) / props.pageSize)
      : 1;
  }
  return 1;
});

const currentSort = ref<SorterType | null>(props.initialSort);
const sortFunction = (header: TableHeader<T>) => {
  if (!header.sort) {
    return;
  }
  const headerkey = header.key;
  const newSort: SorterType = { field: headerkey, direction: "ASC" };
  if (currentSort.value?.field === headerkey) {
    newSort.direction = currentSort.value.direction === "DESC" ? "ASC" : "DESC";
  }
  currentSort.value = newSort;
};
const filteredData = computed(() => {
  if (isSyncTable(props)) {
    if (!props.data?.length) {
      return [];
    }
    let allData = [...props.data];
    if (props.filterFunction) {
      allData = props.filterFunction(filterText.value);
    }
    return allData;
  }
  return [];
});

const visibleData = computedAsync(async () => {
  if (isAsyncTable(props)) {
    isFetchingData.value = true;
    const newData = await props.getData(
      pageNumber.value,
      filterText.value,
      currentSort.value
    );
    isFetchingData.value = false;
    return newData;
  } else if (isSyncTable(props)) {
    const allData = filteredData.value;
    let pN = pageNumber.value;
    // når vi legger på filtre, så er det mulig at numPages > pageNumber (man blar til side 5, så filtrerer vi og det er 2 sider med data)
    // Fikser dette slik at man da ser siste side
    if (pN >= numPages.value) {
      pN = numPages.value - 1;
    }
    const pS = props.pageSize;
    const sort = currentSort?.value;

    if (sort) {
      const sortHeader = props.headers.find((h) => h.key === sort.field);
      if (sortHeader?.sort) {
        const sortFn = sortHeader.sort(sort);
        allData.sort(sortFn);
      }
    }
    if (pS) {
      return Promise.resolve(allData.slice(pN * pS, (pN + 1) * pS));
    }
    return Promise.resolve(allData);
  }
  throw new Error("Ingen data i tabellen");
});

const subgridTemplateStyle = () => {
  const gridTemplateArr: string[] = [];
  for (const header of props.headers) {
    if (header.hidden) {
      gridTemplateArr.push("0px");
    } else {
      gridTemplateArr.push(header.width || "auto");
    }
  }
  return gridTemplateArr.join(" ");
};
const externalDataForSaving = ref({} as Record<string, any>);
const saveExternalData = (data: Record<string, any>) => {
  externalDataForSaving.value = data;
};

const tableholder: Ref<HTMLDivElement | null> = ref(null);

watch(
  [externalDataForSaving, currentSort, pageNumber, filterText],
  (newdata, olddata) => {
    if (isSyncTable(props) && props.saveStateId) {
      let savedState = JSON.stringify({
        externalDataForSaving: JSON.stringify(externalDataForSaving.value),
        currentSort: JSON.stringify(currentSort.value),
        pageNumber: pageNumber.value,
        filterText: filterText.value,
      });
      localStorage.setItem(props.saveStateId, savedState);
    }
    if (props.scrollToTopOnPageSwitch && tableholder.value) {
      if (newdata[2] !== olddata[2]) {
        // vi har byttet side
        //sjekker om tabellen sin topp er utenfor vinduet, og i så fall: scroll
        // dersom tabellen er lenger ned på siden (f.eks. ved initiell lasting) så scroller vi ikke
        if (tableholder.value.getBoundingClientRect().top < 0) {
          tableholder.value.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth",
          });
        }
      }
    }
  }
);
defineExpose({ saveExternalData });

onMounted(() => {
  if (isSyncTable(props) && props.saveStateId) {
    const savedRawData = localStorage.getItem(props.saveStateId);
    if (savedRawData) {
      const savedState = JSON.parse(savedRawData);
      if (savedState.currentSort) {
        const sort = JSON.parse(savedState.currentSort);
        if (sort?.field) {
          currentSort.value = {
            direction: sort.direction || "ASC",
            field: sort.field,
          };
        }
      }
      if (savedState.pageNumber) {
        pageNumber.value = Number(savedState.pageNumber);
      }
      if (savedState.filterText) {
        filterText.value = savedState.filterText;
      }
      if (savedState.externalDataForSaving) {
        emit("setExternalData", savedState);
      }
    }
  }
});

const hasClickForRow = (row: T) => {
  if (!props.onClickRow) {
    return false;
  }
  if (props.hasClickForRow) {
    return props.hasClickForRow(row);
  }
  return true;
};

const observer = new IntersectionObserver(
  ([e]) => e.target.toggleAttribute("data-stuck", e.intersectionRatio < 1),
  { threshold: [1] }
);
const tableheader: Ref<HTMLTableSectionElement | null> = ref(null);
onMounted(() => {
  const thead = tableheader.value;
  if (thead) {
    observer.observe(thead);
  }
});
const hasFilterFunction = computed(() => {
  if (isAsyncTable(props)) {
    return !props.hideAllFilters;
  }
  if (isSyncTable(props)) {
    return !!props.filterFunction;
  }
});

const showTable = computed(() => {
  if (isAsyncTable(props)) {
    return !isFetchingData.value && props.totalHits > 0;
  } else if (isSyncTable(props)) {
    return props.data?.length > 0;
  }
});
</script>

<template>
  <div v-if="!props.hideHeader" class="header_filters">
    <slot name="header" />
    <div class="spacer" />
    <div v-if="hasFilterFunction" class="filter">
      <slot name="filterbutton"></slot>
    </div>
    <div v-if="hasFilterFunction && !props.hideTextFilter" class="filter">
      <nve-input
        v-model="filterText"
        size="medium"
        filled
        type="search"
        placeholder="Søk"
      >
        <nve-icon slot="prefix" name="search" library="Sharp"></nve-icon>
      </nve-input>
    </div>
  </div>
  <div ref="tableholder" class="table-holder" :class="tableholderclass">
    <slot name="subheader" />
    <nve-spinner v-if="isFetchingData" />
    <table
      v-if="showTable"
      :class="[tableclass, { striped: striped, stickyheader: stickyHeader }]"
      :style="`--_numcolumns: ${
        props.headers.length
      }; --_subgridTemplate: ${subgridTemplateStyle()}`"
    >
      <thead v-if="!props.hideTableHeader" ref="tableheader">
        <tr>
          <th
            v-for="header in props.headers"
            :key="header.key"
            :class="[
              header.headerClass,
              { 'can-wrap': header.headerWrap, hidden: header.hidden },
            ]"
            :style="header.width ? `--_width: ${header.width};` : ''"
          >
            <button
              v-if="header.sort"
              type="button"
              variant="ghost"
              class="headersort"
              @click="() => sortFunction(header)"
            >
              <span>{{ header.title }}</span>
              <template v-if="currentSort?.field === header.key">
                <nve-icon
                  v-if="currentSort.direction === 'ASC'"
                  name="arrow_upward"
                />
                <nve-icon
                  v-if="currentSort.direction === 'DESC'"
                  name="arrow_downward"
                />
              </template>
              <template v-else>
                <span style="width: 24px; display: inline-block"></span>
              </template>
            </button>
            <span v-else>
              {{ header.title }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, rowIndex) in visibleData"
          :key="props.itemId(item, rowIndex)"
          :class="[
            { hasclick: hasClickForRow(item) },
            props.rowClass ? props.rowClass(item) : '',
          ]"
          @click="
                        (e: MouseEvent) => {
                            props.onClickRow && hasClickForRow(item) && props.onClickRow(item, e);
                        }
                    "
        >
          <td
            v-for="header in props.headers"
            :key="header.key"
            class="table-cell"
            :class="[header.cellClass, { hidden: header.hidden }]"
            :data-header="header.title"
            :style="header.style"
          >
            <template v-if="$slots[`item.${header.key}`]">
              <slot
                :name="`item.${header.key}`"
                :item="item"
                :value="
                  header.accessor ? header.accessor(item) : item[header.key]
                "
                :index="rowIndex"
                :original-index="data?.findIndex((i: any) => i === item) ?? null"
              ></slot>
            </template>
            <span v-else>
              {{
                header.accessor ? header.accessor(item) : item[header.key] ?? ""
              }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!props.hideEmpty && !showTable && !isFetchingData">
      Ingen data
    </div>
    <div v-if="numPages > 0 && !hidePagination" class="pagination">
      <div class="currentpage">
        Side
        <span class="number">{{ Math.min(numPages, pageNumber + 1) }}</span> av
        <span class="number">{{ numPages }}</span>
      </div>
      <div class="navigationbuttons">
        <nve-button
          variant="ghost"
          title="Første side"
          :disabled="pageNumber === 0"
          @click="() => (pageNumber = 0)"
        >
          <nve-icon name="first_page" library="Sharp"></nve-icon>
        </nve-button>
        <nve-button
          variant="ghost"
          title="Forrige side"
          :disabled="pageNumber === 0"
          @click="() => pageNumber--"
        >
          <nve-icon name="navigate_before" library="Sharp"></nve-icon>
        </nve-button>
        <nve-button
          variant="ghost"
          title="Neste side"
          :disabled="pageNumber >= numPages - 1"
          @click="() => pageNumber++"
        >
          <nve-icon name="navigate_next" library="Sharp"></nve-icon>
        </nve-button>
        <nve-button
          variant="ghost"
          title="Siste side"
          :disabled="pageNumber >= numPages - 1"
          @click="() => (pageNumber = numPages - 1)"
        >
          <nve-icon name="last_page" library="Sharp"></nve-icon>
        </nve-button>
      </div>
    </div>
    <slot name="tablefooter" />
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

thead {
  & tr {
    height: 40px;
    background-color: var(--neutrals-background-canvas);
    & button.headersort {
      width: 100%;
      text-align: left;
      display: flex;
      /*justify-content: space-between;*/
      gap: var(--spacing-large);
      align-items: center;
    }
    & th {
      @supports not (grid-template-columns: subgrid) {
        width: var(--_width);
      }
      &.hidden {
        visibility: collapse;
        padding: 0;
      }
    }
  }
}
.stickyheader {
  position: relative;
  & thead {
    /* top + padding-top er for at intersectionobserver skal fungere ok */
    position: sticky;
    top: -2px;
    padding-top: 2px;
    z-index: 1;
    &[data-stuck] {
      & th {
        border-bottom: 1px solid var(--neutrals-border-default);
      }
    }
  }
}

tbody {
  & tr {
    min-height: 44px;
    & td {
      &.hidden {
        visibility: collapse;
        padding: 0;
      }
    }
  }
}

tr {
  border-bottom: var(--border-width-default) solid var(--neutrals-border-subtle);

  & :is(th, td) {
    text-align: left;
    padding-left: 1.125rem;
    &:deep(button) {
      padding-left: 0 !important;
    }
  }
  &.hasclick {
    cursor: pointer;
    & td:hover {
      text-decoration: underline;
    }
  }
}
.striped tr {
  border-bottom: none;
}
.striped tbody tr {
  &:nth-of-type(2n) {
    background-color: var(--neutrals-background-canvas);
  }
  &:nth-of-type(2n + 1) {
    background-color: var(--neutrals-background-primary);
  }
}
.pagination {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: right;
  gap: 2rem;
  margin-top: 0.5rem;
  & .number {
    font-weight: var(--font-weight-semibold);
  }
}

.header_filters {
  display: flex;
  margin-bottom: 1rem;
  justify-content: flex-end;
  align-items: end;
  gap: var(--spacing-large);
}

@supports (grid-template-columns: subgrid) {
  table {
    display: grid;
    grid-template-columns: var(--_subgridTemplate);
    grid-template-rows: min-content;
    grid-auto-rows: min-content;
    & thead {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      grid-row: 1 / 1;
      & tr {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        height: unset;
        & th {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          min-height: 2em;
          & :deep(.text) {
            white-space: nowrap;
          }
          &.can-wrap {
            :deep(.text) {
              white-space: unset;
            }
          }
        }
      }
    }
    & tbody {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      grid-row-start: 2;
      & tr {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        height: unset;
        & td {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
        }
      }
    }
  }
}
</style>
