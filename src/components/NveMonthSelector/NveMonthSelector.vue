<script setup lang="ts">
import { NveInput, NveOption, NveSelect } from "nve-designsystem";
import { ref } from "vue";

const emit = defineEmits(["change", "input", "update:modelValue"]);

const { modelValue, months, labelLanguage } = defineProps<{
  modelValue: string;
  months: string[];
  labelLanguage: "nb" | "nn" | "en";
}>();

const monthLabel =
  labelLanguage === "en" ? "Month" : labelLanguage === "nn" ? "Månad" : "Måned";

const yearLabel =
  labelLanguage === "en" ? "Year" : labelLanguage === "nn" ? "År" : "År";

// Check if the browser supports input type="month"
const testInput = document.createElement("input");
testInput.type = "month";
const isSupported = testInput.type === "month";

const changeField = (event: any) => {
  emit("update:modelValue", event.target.value);
};

const thisYear = new Date().getFullYear();
const selectedMonth = ref(modelValue?.split("-")?.[1] || "1");
const selectedYear = ref(modelValue?.split("-")?.[0] || thisYear.toString());

// Flytte dette ut?
const monthInput = (event: any) => {
  selectedMonth.value = event.target.value;
  selectorsChange();
};

const yearInput = (event: any) => {
  selectedYear.value = event.target.value;
  selectorsChange();
};

const selectorsChange = () => {
  if (selectedYear.value != null && selectedMonth.value != null) {
    emit("update:modelValue", `${selectedYear.value}-${selectedMonth.value}`);
  }
};
</script>

<template>
  <nve-input
    v-if="isSupported"
    v-bind="$attrs"
    :value="modelValue"
    @sl-input="(event: any) => changeField(event)"
  />
  <div v-if="!isSupported" v-bind="$attrs" class="selector-fields">
    <nve-select
      :label="monthLabel"
      :value="selectedMonth"
      @sl-input="monthInput"
    >
      <nve-option
        v-for="(month, index) in 12"
        :key="index"
        :value="month.toString().padStart(2, '0')"
      >
        {{ months[index] }}
      </nve-option>
    </nve-select>
    <nve-select :label="yearLabel" :value="selectedYear" @sl-input="yearInput">
      <nve-option
        v-for="(_e, index) in 50"
        :key="index"
        :value="(thisYear - 25 + index).toString()"
      >
        {{ thisYear - 25 + index }}
      </nve-option>
    </nve-select>
  </div>
</template>

<style scoped>
.selector-fields {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}

nve-select {
  flex: 1;
}
</style>
