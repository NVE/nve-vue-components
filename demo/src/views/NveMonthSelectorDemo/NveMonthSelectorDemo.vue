<script setup lang="ts">
import NveMonthSelector from "../../../../src/components/NveMonthSelector/NveMonthSelector.vue";
import { ref } from "vue";

const test = ref("2023-05-01");

const months = [
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

// Checks if the browser supports input type="month"
const testInput = document.createElement("input");
testInput.type = "month";
const isSupported = testInput.type === "month";
</script>

<template>
  <div class="view-container">
    <h1>Nve-Month-Selector Demo</h1>

    <div class="info-section">
      <p>
        Dette komponentet er utviklet på bakgrunn av at nettleserne Firefox og
        Safari mangler støtte for input-felt av typen month. I stedet for at
        hvert prosjekt som benytter <i>nve-input type="month"</i> må
        implementere sin egen løsning, er det laget et enkelt og gjenbrukbart
        komponent som kan brukes på tvers av prosjekter.
      </p>
    </div>

    <div class="demo-section">
      <h2 class="subtitle">Demonstasjon</h2>
      <div v-if="!isSupported" class="demo-field">
        <p>Slik vil komponentet bli seendes ut i Firefox og Safari.</p>
        <NveMonthSelector v-model="test" :months="months" label-language="nb" />
      </div>

      <div v-if="isSupported" class="demo-field">
        <p>
          Skjermdump på hvordan komponentet vil bli seendes ut i Firefox og
          Safari. Dersom du har tilgang til en av disse nettleserne kan du teste
          komponentet direkte der.
        </p>
        <img
          src="./assets//nve-month-selector.png"
          alt="Nve Month Selector skjermdump"
        />
      </div>
    </div>

    <div class="info-section">
      <h2>Hvordan bruke komponentet</h2>
      <p>
        Velg språk ved å sende inn et egendefinert datasett i
        months-attributtet. Per nå støttes bokmål, nynorsk og engelsk i
        labels-attributtet. I demoen er det brukt et datasett med norske
        månedsnavn og norsk bokmål til labels. modelValue-attributten brukes til
        å sette og hente verdien på formatet «ÅÅÅÅ-MM».
      </p>

      <ul class="attributes-list">
        <li><b>modelValue</b> (string) - Verdien på formatet "ÅÅÅÅ-MM".</li>
        <li>
          <b>months</b> (string[]) - Et datasett med månedsnavn som skal vises i
          nedtrekksmenyen.
        </li>
        <li>
          <b>labelLanguage</b> ("nb" | "nn" | "en") - Språket som skal brukes på
          labels.
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="css" scoped>
.info-section {
  max-width: 85ch;
}

.info-section > p {
  margin-bottom: var(--spacing-small);
}

.info-section > h2,
.demo-section > h2 {
  margin: var(--spacing-x-large) 0 var(--spacing-small) 0;
  font-size: var(--font-size-medium);
}

.demo-section {
  margin-bottom: var(--spacing-x-large);
}

.demo-field {
  display: flex;
  width: 60%;
  flex-direction: column;
  gap: var(--spacing-medium);
}

.attributes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  padding-top: var(--spacing-small);
}
.attributes-list > li {
  list-style-type: none;
}

.attributes-list > li > b {
  font-weight: 600;
}
</style>
