<script setup lang="ts">
import NveTable from "../../../src/components/NveTable/NveTable.vue";
import type { TableHeader } from "../../../src/components/NveTable/table.types";
import countries from "../components/countries.json";
import { computed,  type Ref } from "vue";
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

import { h } from "vue";

const metaData = [
  {
    key: "name",
    title: "Navn",
  },
  {
    key: "governmentType",
    title: "Styreform",
    component: RedComponent,
  },
  {
    key: "capital",
    title: "Hovedstad",
    component: RedComponent,
  },
  {
    key: "continent",
    title: "Kontinent",
    component: RedComponent,
  },
  {
    key: "population",
    title: "Befolkning",
    component: NumberComponent,
  },
  { key: "actions", title: "Actions", component: ButtonThatLogs },
];

/** Her lager vi noen kjappe komponenter som vi bruker i tabellen.
 * Disse komponentene vil vanligvis være i egne filer og mest trolig mer komplekse.
 * */
type CustomProps = {
  value: string;
  country: Country;
};

function RedComponent(props: CustomProps) {
  return h(
    "span",
    {
      style: {
        color: "red",
      },
    },
    [props.value]
  );
}
function NumberComponent(props: CustomProps) {
  return h("span", [prettyPrintNumber(Number(props.value))]);
}

function DefaultComponent(props: CustomProps) {
  return h("span", [props.value]);
}

function ButtonThatLogs(props: CustomProps) {
  return h(
    "nve-button",
    {
      variant: "default",
      size: "small",
      onClick: () => {
        console.dir(props.country);
      },
    },
    [h("nve-icon", { name: "info" })]
  );
}
/** komponent-liste slutt */

type TableHeaderWithComponent<T> = TableHeader<T> & {
  component?: any;
};

const tableHeaders: Ref<Array<TableHeaderWithComponent<Country>>> = computed(
  () => {
    return metaData.map((header) => {
      return {
        key: header.key,
        title: header.title,
        component: header.component ?? DefaultComponent,
      };
    });
  }
);

const prettyPrintNumber = (number: number): string => {
  return new Intl.NumberFormat("no-NO", {
    notation: "standard",
    maximumFractionDigits: 2,
  }).format(number);
};
</script>

<template>
  <div class="nve-table-demo">
    <h2>NveTable Demo med Programmatiske celler</h2>
    <NveTable
      :headers="tableHeaders"
      :data="countries"
      striped
      :page-size="15"
      :item-id="(country: Country) => country.countryCode"
      :hide-text-filter="true"
    >
      <template v-for="col in tableHeaders" #[`item.${col.key}`]="row">
        <component :is="col.component" :value="row.value" :country="row.item" />
      </template>
    </NveTable>
  </div>
</template>

<style scoped></style>
