<script setup lang="ts">
import NveTable from "../../../src/components/NveTable/NveTable.vue";
import {
  sortByProperty,
  sortByFunction,
  simpleSortByAccessor,
} from "../../../src/components/NveTable/tableSortFunctions";
import type { TableHeader } from "../../../src/components/NveTable/table.types";
import {
  NveButton,
  NveCheckboxGroup,
  NveCheckbox,
  NveIcon,
  NveAccordionItem,
} from "nve-designsystem";
import countries from "../components/countries.json";
import { ref, type Ref, useTemplateRef } from "vue";
type Country = {
  name: string;
  governmentType: string;
  countryCode: string;
  capital: string;
  continent: string;
  population: number;
  area: number;
  foundingYear: number;
};

// For å demonstrere sortering med funksjon så bruker vi en egen sorteringsfunksjon for styreform.
// Den sier at monarkier sorteres øverst, så republikker, og så alt annet.
// Andorra er et eksempel på en styreform som ikke er monarki eller republikk (diarki, eller "dobbelt monarki").

const governmentSorterFunction = (governmentType: string) => {
  if (governmentType.toLowerCase().includes("monarchy")) {
    return 1;
  } else if (governmentType.toLowerCase().includes("republic")) {
    return 2;
  } else {
    return 3;
  }
};

const tableHeaders: Ref<Array<TableHeader<Country>>> = ref([
  {
    key: "name",
    title: "Navn",
    hidden: false,
    sort: simpleSortByAccessor<Country>((c) => c.name),
  },
  {
    key: "governmentType",
    title: "Styreform",
    singleLineOverflow: true,
    hidden: false,
    sort: (sorter) => {
      const sF = sortByFunction<Country>(sorter.direction);
      return (a, b) =>
        sF(a, b, (d) => governmentSorterFunction(d.governmentType));
    },
  },
  {
    key: "countryCode",
    title: "Flagg",
    hidden: false,
    sort: (sorter) => {
      const sF = sortByProperty(sorter.direction);
      return (a: Country, b: Country) => sF(a["countryCode"], b["countryCode"]);
    },
  },
  {
    key: "capital",
    title: "Hovedstad",
    hidden: false,
    sort: (sorter) => {
      const sF = sortByProperty(sorter.direction);
      return (a: Country, b: Country) => sF(a["capital"], b["capital"]);
    },
  },
  {
    key: "continent",
    title: "Kontinent",
    hidden: false,
    sort: (sorter) => {
      const sF = sortByProperty(sorter.direction);
      return (a: Country, b: Country) => sF(a["continent"], b["continent"]);
    },
  },
  {
    key: "population",
    title: "Befolkning",
    hidden: false,
    sort: (sorter) => {
      const sF = sortByProperty(sorter.direction, true); // true her gjør at vi sorterer som tall
      return (a: Country, b: Country) => sF(a["population"], b["population"]);
    },
    accessor: (row: Country) => prettyPrintNumber(row["population"]),
  },
  {
    key: "area",
    title: "Areal",
    hidden: false,
    sort: (sorter) => {
      const sF = sortByProperty(sorter.direction, true); // true her gjør at vi sorterer som tall
      return (a: Country, b: Country) => sF(a["area"], b["area"]);
    },
    accessor: (row: Country) => `${prettyPrintNumber(row["area"])} km²`,
    cellClass: (item: Country) => (item.area > 50000 ? "big" : "small"),
  },
  {
    key: "foundingYear",
    title: "Grunnlagt",
    hidden: false,
    sort: (sorter) => {
      const sF = sortByProperty(sorter.direction, true); // true her gjør at vi sorterer som tall
      return (a: Country, b: Country) =>
        sF(a["foundingYear"], b["foundingYear"]);
    },
    cellClass: "year",
  },
]);

const tableFilter = (
  textSearch: string,
  data: Array<Country> = countries
): Array<Country> => {
  if (textSearch && textSearch.trim().length > 0) {
    const search = textSearch.toLowerCase();
    data = data.filter((row) => {
      return (
        row.name.toLowerCase().includes(search) ||
        row.countryCode.toLowerCase().includes(search) ||
        row.capital.toLowerCase().includes(search) ||
        row.continent.toLowerCase().includes(search)
      );
    });
  }
  data = data.filter((row) => {
    // Russland, Tyrkia er i både Europa og Asia. Så litt avansert filtrering. De er som "Europe/Asia" og "Asia/Europe" i json-fila.
    return selectedContinents.value.some((sc) =>
      row.continent.split("/").includes(sc)
    );
  });
  return data;
};

const prettyPrintNumber = (number: number): string => {
  return new Intl.NumberFormat("no-NO", {
    notation: "standard",
    maximumFractionDigits: 2,
  }).format(number);
};

const filterOpen = ref(false);

const allContinents = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];
const selectedContinents: Ref<Array<string>> = ref([...allContinents]);

const continents = useTemplateRef("continents-checkbox-group");
const updateContinents = () => {
  selectedContinents.value = continents.value?.selectedValues ?? [];
};

const toggleColumn = (header: TableHeader<Country>) => {
  header.hidden = !header.hidden;
  tableHeaders.value = [...tableHeaders.value];
};

const tableBorder = ref(false);
const cellBorder = ref(false);
const striped = ref(true);
const hoverrow = ref(false);
const stickyHeader = ref(false);
</script>

<template>
  <div class="nve-table-demo">
    <h2>NveTable Demo</h2>
    <nve-accordion-item variant="secondary" :open="true">
      <div slot="summary">Slå av og på kolonner</div>
      <div class="toggles">
        <nve-checkbox
          v-for="col in tableHeaders"
          :key="col.key"
          :checked="!col.hidden"
          @sl-change="() => toggleColumn(col)"
        >
          {{ col.title }}
        </nve-checkbox>
      </div>
    </nve-accordion-item>
    <nve-accordion-item variant="secondary" :open="false">
      <div slot="summary">Slå av og på properties</div>
      <div class="toggles">
        <nve-checkbox
          :checked="tableBorder"
          @sl-change="() => (tableBorder = !tableBorder)"
        >
          Ramme rundt tabell
        </nve-checkbox>
        <nve-checkbox
          :checked="cellBorder"
          @sl-change="() => (cellBorder = !cellBorder)"
        >
          Ramme rundt hver celle
        </nve-checkbox>
        <nve-checkbox
          :checked="striped"
          @sl-change="() => (striped = !striped)"
        >
          Zebra-striper
        </nve-checkbox>
        <nve-checkbox
          :checked="hoverrow"
          @sl-change="() => (hoverrow = !hoverrow)"
        >
          Hover-effekt på rader
        </nve-checkbox>
        <nve-checkbox
          :checked="stickyHeader"
          @sl-change="() => (stickyHeader = !stickyHeader)"
        >
          Gjør header "sticky"
        </nve-checkbox>
      </div>
    </nve-accordion-item>
    <NveTable
      :headers="tableHeaders"
      :data="countries"
      :striped="striped"
      :page-size="15"
      :initial-sort="{ field: 'name', direction: 'ASC' }"
      :filter-function="tableFilter"
      :item-id="(country: Country) => country.countryCode"
      :sticky-header="stickyHeader"
      :table-border="tableBorder"
      :cell-border="cellBorder"
      :hover-row-effect="hoverrow"
      :scroll-to-top-on-page-switch="true"
    >
      <template #filterbutton>
        <nve-button variant="ghost" @click="filterOpen = !filterOpen">
          <nve-icon slot="prefix" name="filter_alt" />
          Filtrer
        </nve-button>
      </template>
      <template #subheader>
        <Transition :duration="400" name="filter">
          <div v-if="filterOpen" class="filter-wrapper">
            <div class="filter">
              <nve-checkbox-group
                :value="selectedContinents"
                orientation="horizontal"
                :[`selectedValues`]="selectedContinents"
                ref="continents-checkbox-group"
                @input="updateContinents"
              >
                <nve-checkbox
                  v-for="cont of allContinents"
                  :key="cont"
                  :value="cont"
                >
                  {{ cont }}
                </nve-checkbox>
              </nve-checkbox-group>
            </div>
          </div>
        </Transition>
      </template>
      <template #[`header.countryCode`]="item">
        <span style="display: flex; gap: 4px">
          <span>{{ item.header.title }}</span>
          <span>🚩</span>
        </span>
      </template>
      <template #[`item.countryCode`]="row">
        <span class="country-code">
          <img
            :src="`https://hatscripts.github.io/circle-flags/flags/${row.value.toLowerCase()}.svg`"
            width="32"
          />
        </span>
      </template>
    </NveTable>
  </div>
</template>

<style scoped>
.filter-wrapper {
  display: grid;
  grid-template-rows: 1fr;
  transition:
    grid-template-rows 0.3s ease-out,
    padding-block-end 0.3s ease-in-out;
  padding-block-end: var(--spacing-large);
  & .filter {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-small);
  }
  &:is(.filter-enter-from, .filter-leave-to) {
    grid-template-rows: 0fr;
    padding-block-end: 0;
  }
  &:is(.filter-leave-from, .filter-enter-to) {
    grid-template-rows: 1fr;
  }
}

.toggles {
  display: flex;
  gap: var(--spacing-small);
}
nve-accordion-item {
  margin-block-end: var(--spacing-large);
}
.nve-table-demo :deep(.table-cell.year) {
  ::before {
    content: "📅";
  }
}
.nve-table-demo :deep(.table-cell.small) {
  font-size: 95%;
}
.nve-table-demo :deep(.table-cell.big) {
  font-size: 105%;
}
</style>
