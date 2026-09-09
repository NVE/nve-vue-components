<script setup lang="ts">
import NveTable from "../../../../src/components/NveTable/NveTable.vue";
import {
  sortByProperty,
  sortByFunction,
} from "../../../../src/components/NveTable/tableSortFunctions";
import type {
  SorterType,
  TableHeader,
} from "../../../../src/components/NveTable/table.types";
import { NveCheckbox, NveAccordionItem } from "nve-designsystem";
import countries from "../../components/countries.json";
import { ref, type Ref } from "vue";
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
    sort: (sorter) => {
      const sF = sortByProperty(sorter.direction);
      return (a: Country, b: Country) => sF(a["name"], b["name"]);
    },
  },
  {
    key: "governmentType",
    title: "Styreform",
    hidden: false,
    sort: (sorter) => {
      const sF = sortByFunction<Country>(sorter.direction);
      return (a: Country, b: Country) =>
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
  },
]);

const tableFilter = (
  textSearch: string,
  data: Array<Country> = countries,
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
  return data;
};

const prettyPrintNumber = (number: number): string => {
  return new Intl.NumberFormat("no-NO", {
    notation: "standard",
    maximumFractionDigits: 2,
  }).format(number);
};

const toggleColumn = (header: TableHeader<Country>) => {
  header.hidden = !header.hidden;
  tableHeaders.value = [...tableHeaders.value];
};

const pageSize = 15; // Antall rader per side
const totalHits = ref(countries.length); // Totalt antall rader i dataen
const timeoutMs = ref(1000); // Simulerer en 1 sekunders forsinkelse for å hente data

const getData = (
  page: number,
  filterText: string,
  sort: SorterType | null,
): Promise<Array<Country>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = tableFilter(filterText, countries);

      if (sort) {
        const sortHeader = tableHeaders.value.find((h) => h.key === sort.field);
        if (sortHeader?.sort) {
          const sortFn = sortHeader.sort(sort);
          data.sort(sortFn);
        }
      }
      const start = page * pageSize;
      const end = start + pageSize;
      totalHits.value = data.length; // Oppdaterer totalHits med antall rader i dataen
      resolve(data.slice(start, end));
    }, timeoutMs.value);
  });
};
</script>

<template>
  <div class="nve-table-demo">
    <h1>Nve-Table Demo Async</h1>
    <p class="info-text">
      Dette er en rask versjon. Async-versjonen av NveTable er ikke i bruk i
      noen prosjekter akkurat nå, så skriv gjerne om funksjonalitet slik at den
      er bedre dersom du tar den i bruk.
    </p>
    <nve-accordion-item variant="secondary" :open="true">
      <div slot="summary">Slå av og på kolonner</div>
      <div class="column-toggles">
        <nve-checkbox
          v-for="col in tableHeaders"
          :key="col.key"
          :checked="!col.hidden"
          @change="() => toggleColumn(col)"
        >
          {{ col.title }}
        </nve-checkbox>
      </div>
    </nve-accordion-item>
    <NveTable
      :headers="tableHeaders"
      async
      :get-data="getData"
      :total-hits="totalHits"
      striped
      :page-size="15"
      :initial-sort="{ field: 'name', direction: 'ASC' }"
      :item-id="(country: Country) => country.countryCode"
    >
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
.info-text {
  margin-bottom: var(--spacing-medium);
  max-width: 100ch;
}
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

.column-toggles {
  display: flex;
  gap: var(--spacing-small);
}
nve-accordion-item {
  margin-block-end: var(--spacing-large);
}
</style>
