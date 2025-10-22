<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch, onMounted, type Ref } from "vue";
import { computedAsync } from "@vueuse/core";

import {
  type TableHeader,
  type SorterType,
  type SyncTableProps,
  type AsyncTableProps,
} from "./table.types";
defineOptions({ name: "NveTable" });

/** Legg merke til pageChange-evented. Den er null-indexed */
const emit = defineEmits<{
  setExternalData: [val: Record<string, any>];
  pageSizeChange: [val: number];
  pageChange: [newPage: number];
  sortChange: [newSort: SorterType | null];
  filterTextChange: [newFilterText: string];
}>();
type PropsType = SyncTableProps<T> | AsyncTableProps<T>;

const props = withDefaults(defineProps<PropsType>(), {
  async: false,
  pageSize: undefined,
  filterFunction: undefined,
  saveStateId: undefined,
  tableclass: undefined,
  tableholderclass: undefined,
  hasClickForRow: undefined,
  stickyHeader: false,
  scrollToTopOnPageSwitch: false,
  filterTextInputSize: "medium",
  initialSort: null,
  rowClass: undefined,
  itemId: (_, index: number) => index,
  hideAllFilters: false,
  stickyFirstColumn: false,
});

const localPageSize = ref(props.pageSize);
watch(
  () => props.pageSize,
  (newVal) => {
    localPageSize.value = newVal;
  }
);
const onChangePageSize = (event: any) => {
  const newSize = Number(event.target.value);
  localPageSize.value = newSize;
  emit("pageSizeChange", newSize);
  pageNumber.value = 0; // går til første side
};

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
watch(
  () => filterText.value,
  (newVal) => {
    emit("filterTextChange", newVal);
  }
);

const pageNumber = ref<number>(0);

watch(pageNumber, (newPage) => {
  emit("pageChange", newPage);
});

const isFetchingData = ref(false);
const numPages = computed(() => {
  if (isAsyncTable(props)) {
    return Math.ceil(props.totalHits / (localPageSize.value ?? 1));
  } else if (isSyncTable(props)) {
    return localPageSize.value
      ? Math.ceil((filteredData.value?.length ?? 0) / localPageSize.value)
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
  emit("sortChange", newSort);
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
    const pS = localPageSize.value;
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
const externalDataForSaving = ref({} as Record<string, unknown>);
const saveExternalData = (data: Record<string, unknown>) => {
  externalDataForSaving.value = data;
};

const tableholder: Ref<HTMLDivElement | null> = ref(null);

watch(
  [externalDataForSaving, currentSort, pageNumber, filterText, localPageSize],
  (newdata, olddata) => {
    if (isSyncTable(props) && props.saveStateId) {
      let savedState = JSON.stringify({
        externalDataForSaving: JSON.stringify(externalDataForSaving.value),
        currentSort: JSON.stringify(currentSort.value),
        pageNumber: pageNumber.value,
        filterText: filterText.value,
        pageSize: localPageSize.value,
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
      if (savedState.pageSize) {
        localPageSize.value = Number(savedState.pageSize);
        emit("pageSizeChange", localPageSize.value);
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
  return false;
});

const showTable = computed(() => {
  if (isAsyncTable(props)) {
    return !isFetchingData.value && props.totalHits > 0;
  } else if (isSyncTable(props)) {
    return props.data?.length > 0;
  }
  return false;
});

const getCellClass = (
  cellClass: undefined | string | ((item: T) => string),
  item: T
) => {
  if (!cellClass) {
    return "";
  }
  if (typeof cellClass === "string") {
    return cellClass;
  }
  return cellClass(item);
};

const clickRow = (row: T, event: MouseEvent) => {
  if (props.onClickRow) {
    /* Vi gjør ikke denne via event fordi vi sjekker hasClickForRow for å sette cursor og hover-effekt */
    props.onClickRow(row, event);
  }
};
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
        :size="props.filterTextInputSize"
        filled
        type="search"
        placeholder="Søk"
        data-test="filter-input"
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
      :class="[
        tableclass,
        {
          striped: striped,
          stickyheader: stickyHeader,
          tableborder: tableBorder,
          cellborder: cellBorder,
          hoverrow: hoverRowEffect,
          hideunderline: hideUnderline,
          stickyfirstcolumn: stickyFirstColumn,
        },
      ]"
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
              class="headersort"
              @click="() => sortFunction(header)"
            >
              {{
                /* Innholdet i header kan være en slot. Den samme koden er her i 'header med sort-knapp' og under hvor header ikke er sorterbar (v-else-if) */ ""
              }}
              <template v-if="$slots[`header.${header.key}`]">
                <slot :name="`header.${header.key}`" :header="header"></slot>
              </template>
              <span v-else>{{ header.title }}</span>

              {{ /* Ikon for sortering */ "" }}
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
            <template v-else-if="$slots[`header.${header.key}`]">
              <slot :name="`header.${header.key}`" :header="header"></slot>
            </template>
            <span v-else>{{ header.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(item, rowIndex) in visibleData"
          :key="props.itemId(item, rowIndex)"
        >
          <tr
            class="table-row"
            :class="[
              { hasclick: hasClickForRow(item) },
              props.rowClass ? props.rowClass(item) : '',
            ]"
            @click="(e: MouseEvent) => clickRow(item, e)"
          >
            <td
              v-for="header in props.headers"
              :key="header.key"
              class="table-cell"
              :class="[
                getCellClass(header.cellClass, item),
                {
                  hidden: header.hidden,
                  'single-line-overflow': header.singleLineOverflow,
                },
              ]"
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
                  :original-index="
                    data?.findIndex((i: any) => i === item) ?? null
                  "
                ></slot>
              </template>
              <span
                v-else
                :class="{
                  'single-line-overflow-inner': header.singleLineOverflow,
                }"
              >
                {{
                  header.accessor
                    ? header.accessor(item)
                    : (item[header.key] ?? "")
                }}
              </span>
            </td>
          </tr>
          <slot
            name="afterrow"
            :item="item"
            :index="rowIndex"
            :original-index="data?.findIndex((i: any) => i === item) ?? null"
          />
        </template>
      </tbody>
    </table>

    <div v-if="!props.hideEmpty && !showTable && !isFetchingData">
      Ingen data
    </div>
    <div v-if="numPages > 0 && !hidePagination" class="pagination">
      <div
        v-if="pageSizeOptions && pageSizeOptions.length > 0"
        class="pagesize"
      >
        Rader per side
        <select :value="localPageSize?.toString()" @change="onChangePageSize">
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
      <div class="spacer" />
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
          data-test="next-button"
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
  --_row-border-bottom: var(--border-width-default) solid
    var(--neutrals-border-subtle);
  &.cellborder {
    --_cell-border: var(--border-width-default) solid
      var(--neutrals-border-subtle);
    --_row-border-bottom: none;
  }
  &:is(.cellborder, .tableborder) {
    --_br: var(--border-radius-large);
    border-radius: var(--_br);
    border: var(--border-width-default) solid var(--neutrals-border-subtle);
    & thead {
      & tr {
        border-top-left-radius: var(--_br);
        border-top-right-radius: var(--_br);
        & th:first-of-type {
          border-top-left-radius: var(--_br);
        }
        & th:last-of-type {
          border-top-right-radius: var(--_br);
        }
      }
    }
    & tbody {
      & tr:last-of-type {
        border-bottom-left-radius: var(--_br);
        border-bottom-right-radius: var(--_br);
        & td:first-of-type {
          border-bottom-left-radius: var(--_br);
        }
        & td:last-of-type {
          border-bottom-right-radius: var(--_br);
        }
      }
    }
  }
  &.striped {
    --_row-border-bottom: none;
  }
  &.hoverrow {
    tbody {
      & tr {
        transition: background-color 0.3s;
      }
      & tr:hover {
        --_row-color: var(--_row-hover-color);
      }
    }
  }
  &:not(.hoverrow) tr {
    --_row-hover-color: initial !important;
  }
}

thead {
  background-color: var(--neutrals-background-canvas);
  & tr {
    height: 40px;
    background-color: var(--neutrals-background-canvas);
    & button.headersort {
      color: inherit;
      font: inherit;
      cursor: pointer;
      width: 100%;
      text-align: left;
      display: flex;
      /*justify-content: space-between;*/
      gap: var(--spacing-large);
      align-items: center;
      background: transparent;
      border: none;
    }
    & th {
      @supports not (grid-template-columns: subgrid) {
        width: var(--_width);
      }
      &.hidden {
        visibility: collapse;
        padding: 0;
      }
      &:has(button) {
        transition: background-color 0.3s;
        &:hover {
          background-color: var(--neutrals-background-secondary);
        }
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

thead {
  & tr {
    &:has(.headersort) {
      min-height: 44px;
    }
    & th {
      border-bottom: var(--_cell-border);
      border-right: var(--_cell-border);
      &.hidden {
        visibility: collapse;
        padding: 0;
      }
      &:last-child {
        border-right: none;
      }
    }
  }
}

tbody {
  & tr {
    min-height: 44px;
    --_row-color: var(--neutrals-background-primary);
    background-color: var(--_row-color);
    --_row-hover-color: var(--neutrals-background-secondary);
    & td {
      border-bottom: var(--_cell-border);
      border-right: var(--_cell-border);
      &.hidden {
        visibility: collapse;
        padding: 0;
      }
      &:last-child {
        border-right: none;
      }
      &.single-line-overflow {
        min-width: 0;
        & .single-line-overflow-inner {
          display: block;
          max-width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &:hover {
            max-width: max-content;
            z-index: 1;
            overflow: visible;
            background: var(--_row-hover-color, var(--_row-color));
            display: flex;
            align-items: center;
            height: 100%;
          }
        }
      }
    }
    &:last-child {
      & td {
        border-bottom: none;
      }
    }
  }
}

tr {
  border-bottom: var(--_row-border-bottom);

  & :is(th, td) {
    text-align: left;
    padding-left: 1.125rem;
    padding-right: 0.75rem;
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
table.hideunderline {
  & tr.hasclick {
    & td:hover {
      text-decoration: none;
    }
  }
}

.striped tbody tr {
  &:nth-child(2n of .table-row) {
    --_row-color: var(--neutrals-background-canvas);
    --_row-hover-color: var(--neutrals-background-secondary);
  }
  &:nth-of-type(2n + 1 of .table-row) {
    --_row-color: var(--neutrals-background-primary);
  }
}
.pagination {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 2rem;
  margin-top: 0.5rem;
  & .number {
    font-weight: var(--font-weight-semibold);
  }
  & .spacer {
    flex-grow: 1;
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

.stickyfirstcolumn {
  max-width: 100%;
  overflow: auto;
  & th:first-child,
  & td:first-child {
    position: sticky;

    z-index: 2;
    container-type: scroll-state;
    inset-inline: 0;
    /* legger på en skygge for å indikere at det er mer innhold til høyre */
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.2);
  }
  & td:first-child {
    background: var(--_row-color);
  }
  & th:first-child {
    background: var(--neutrals-background-canvas);
  }
}

.pagesize {
  font: var(--body-xsmall);
  color: var(--neutrals-foreground-subtle);
  & select {
    margin-left: 0.5rem;
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    border-radius: var(--border-radius-small);
    padding: 0.25rem 0.5rem;
    &:focus {
      outline: none;
    }
    &:focus-visible {
      outline: 1px solid var(--neutrals-foreground-primary);
    }
    & option {
      color: var(--neutrals-foreground-primary);
      background-color: var(--neutrals-background-primary);
    }
  }
}
</style>
