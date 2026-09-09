<script setup lang="ts">
import { NveInput, NveCombobox } from "nve-designsystem";
import { ref, watch } from "vue";

const emit = defineEmits(["blur", "change", "input", "update:modelValue"]);

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    language?: "nb" | "nn" | "en";
    labels?: boolean;
  }>(),
  {
    labels: true,
  },
);

const norwegianMonths = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const englishMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthOptions =
  props.language === "en"
    ? englishMonths
    : props.language === "nn"
      ? norwegianMonths
      : norwegianMonths;

const monthOptionsForCombobox = monthOptions.map((month, index) => ({
  label: month,
  value: (index + 1).toString().padStart(2, "0"),
}));

const monthLabel =
  props.labels === false
    ? ""
    : props.language === "en"
      ? "Month"
      : props.language === "nn"
        ? "Månad"
        : "Måned";

const yearLabel =
  props.labels === false
    ? ""
    : props.language === "en"
      ? "Year"
      : props.language === "nn"
        ? "År"
        : "År";

// Check if the browser supports input type="month"
const testInput = document.createElement("input");
testInput.type = "month";
const isSupported = testInput.type === "month";

const changeField = (event: any) => {
  emit("update:modelValue", event.target.value);
};

const thisYear = new Date().getFullYear();
const selectedMonth = ref(props.modelValue?.split("-")?.[1] || "1");
const selectedYear = ref(
  props.modelValue?.split("-")?.[0] || thisYear.toString(),
);

const monthInput = (event: any) => {
  selectedMonth.value = (event.target as NveCombobox).selectedValues?.[0];
  selectorsChange();
};

const yearInput = (event: any) => {
  selectedYear.value = (event.target as NveCombobox).selectedValues?.[0];
  selectorsChange();
};

const selectorsChange = () => {
  if (selectedYear.value != null && selectedMonth.value != null) {
    const value = `${selectedYear.value}-${selectedMonth.value}`;
    emit("update:modelValue", value);
  }
};

const selectorsBlur = (event: any) => {
  emit("blur", event);
};

watch(
  () => props.modelValue,
  (value) => {
    if (!value) return;

    const [year, month] = value.split("-");
    if (year && month) {
      selectedYear.value = year;
      selectedMonth.value = month;
    }
  },
  { immediate: true },
);

const yearOptionsForCombobox = Array.from({ length: 50 }, (_e, index) => {
  const year = thisYear - 25 + index;
  return {
    label: year.toString(),
    value: year.toString(),
  };
});
</script>

<template>
  <nve-input
    v-if="isSupported"
    v-bind="$attrs"
    :value="modelValue"
    type="month"
    @blur="(event: any) => emit('blur', event)"
    @input="(event: any) => changeField(event)"
  />
  <div v-if="!isSupported" v-bind="$attrs" class="selector-fields">
    <nve-combobox
      :label="monthLabel"
      :selectedValues="[selectedMonth]"
      :options="monthOptionsForCombobox"
      @blur="selectorsBlur"
      @change="monthInput"
    >
    </nve-combobox>

    <nve-combobox
      :label="yearLabel"
      :selectedValues="[selectedYear]"
      :options="yearOptionsForCombobox"
      @blur="selectorsBlur"
      @change="yearInput"
    >
    </nve-combobox>
  </div>
</template>

<style scoped>
.selector-fields {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}

nve-combobox {
  flex: 1;
}
</style>
