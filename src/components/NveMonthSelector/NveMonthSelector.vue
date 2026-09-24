<script setup lang="ts">
import { NveInput } from "nve-designsystem";
import { computed, ref, watch } from "vue";

interface ComboboxOption {
  label: string;
  value: string;
  selected?: boolean;
}

const emit = defineEmits(["blur", "change", "input", "update:modelValue"]);

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
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

const monthValues = monthOptions.map((_month, index) =>
  (index + 1).toString().padStart(2, "0"),
);

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
const selectedMonth = ref<string | undefined>(
  props.modelValue?.split("-")?.[1],
);
const selectedYear = ref<string | undefined>(props.modelValue?.split("-")?.[0]);

const monthOptionsForCombobox = computed<ComboboxOption[]>(() =>
  monthOptions.map((month, index) => ({
    label: month,
    value: monthValues[index],
    selected: monthValues[index] === selectedMonth.value,
  })),
);

const monthInput = (event: CustomEvent<{ value: ComboboxOption[] }>) => {
  selectedMonth.value = event.detail.value?.[0]?.value;
  selectorsChange();
};

const yearInput = (event: CustomEvent<{ value: ComboboxOption[] }>) => {
  selectedYear.value = event.detail.value?.[0]?.value;
  selectorsChange();
};

const selectorsChange = () => {
  if (selectedYear.value && selectedMonth.value) {
    const value = `${selectedYear.value}-${selectedMonth.value}`;
    emit("update:modelValue", value);
  } else {
    emit("update:modelValue", undefined);
  }
};

const selectorsBlur = (event: any) => {
  emit("blur", event);
};

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      selectedYear.value = undefined;
      selectedMonth.value = undefined;
      return;
    }

    const [year, month] = value.split("-");
    if (year && month) {
      selectedYear.value = year;
      selectedMonth.value = month;
    }
  },
  { immediate: true },
);

const yearOptionsForCombobox = computed<ComboboxOption[]>(() =>
  Array.from({ length: 50 }, (_e, index) => {
    const year = (thisYear - 25 + index).toString();
    return {
      label: year,
      value: year,
      selected: year === selectedYear.value,
    };
  }),
);
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
  <div v-if="!isSupported" class="selector-fields">
    <nve-combobox
      v-bind="$attrs"
      :label="monthLabel"
      :options="monthOptionsForCombobox"
      @blur="selectorsBlur"
      @value="monthInput"
    >
    </nve-combobox>

    <nve-combobox
      v-bind="$attrs"
      :label="yearLabel"
      :options="yearOptionsForCombobox"
      @blur="selectorsBlur"
      @value="yearInput"
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
