<script setup lang="ts">
import { NveInput, NveOption, NveSelect } from "nve-designsystem";
import { ref, watch } from "vue";

const emit = defineEmits(["sl-blur", "change", "input", "update:modelValue"]);

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
  selectedMonth.value = event.target.value;
  selectorsChange();
};

const yearInput = (event: any) => {
  selectedYear.value = event.target.value;
  selectorsChange();
};

const selectorsChange = () => {
  if (selectedYear.value != null && selectedMonth.value != null) {
    const value = `${selectedYear.value}-${selectedMonth.value}`;
    emit("update:modelValue", value);
  }
};

const selectorsBlur = (event: any) => {
  emit("sl-blur", event);
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
</script>

<template>
  <nve-input
    v-if="isSupported"
    v-bind="$attrs"
    :value="modelValue"
    type="month"
    @sl-blur="(event: any) => emit('sl-blur', event)"
    @sl-input="(event: any) => changeField(event)"
  />
  <div v-if="!isSupported" v-bind="$attrs" class="selector-fields">
    <nve-select
      :label="monthLabel"
      :value="selectedMonth"
      @sl-blur="selectorsBlur"
      @sl-input="monthInput"
    >
      <nve-option
        v-for="(month, index) in 12"
        :key="index"
        :value="month.toString().padStart(2, '0')"
      >
        {{ monthOptions[index] }}
      </nve-option>
    </nve-select>

    <nve-select
      :label="yearLabel"
      :value="selectedYear"
      @sl-blur="selectorsBlur"
      @sl-input="yearInput"
    >
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
