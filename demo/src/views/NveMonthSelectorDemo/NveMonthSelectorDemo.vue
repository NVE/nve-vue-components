<script setup lang="ts">
import NveMonthSelector from "../../../../src/components/NveMonthSelector/NveMonthSelector.vue";
import { ref } from "vue";

const input = ref("2023-05");

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
        Et Vue 3-komponent med automatisk fallback for nettlesere som ikke
        støtter input type="month", som Firefox og Safari. Komponentet gir en
        enkel og gjenbrukbar løsning som kan brukes på tvers av prosjekter, uten
        at hvert prosjekt må lage sin egen implementasjon. Komponentet er basert
        på nve-designsystem, og støtter v-model og flere språk.
      </p>
    </div>
    <div class="demo-section">
      <h2 class="subtitle">Demonstrasjon</h2>
      <div v-if="!isSupported" class="demo-field">
        <p>Slik vil komponentet bli seendes ut i Firefox og Safari.</p>
        <NveMonthSelector v-model="input" :labels="false" />
      </div>

      <div v-if="isSupported" class="demo-field">
        <p>
          Slik ser komponentet ut i nettlesere som støtter input type="month",
          som Chrome og Edge (med kalender velger).
        </p>
        <NveMonthSelector v-model="input" label="Dato" />
        <p>
          Under er skjermdump på hvordan komponentet vil bli seendes ut i
          Firefox og Safari. Dersom du har tilgang til en av disse nettleserne
          kan du teste komponentet direkte der.
        </p>
        <img
          src="./assets//nve-month-selector.png"
          alt="Nve Month Selector forhåndsvisning"
        />
      </div>
    </div>

    <div class="info-section">
      <h2>Hvordan bruke komponentet</h2>
      <p>
        Komponenten gjør en sjekk på om nettleseren støtter input type="month".
        Hvis denne input-typen ikke er støttet, blir NveMonthSelector benyttes
        som fallback. Eksempel på bruk i kode:
      </p>
      <p class="code-snippet">
        Standard:
        <code>&lt;NveMonthSelector v-model="input"/&gt;</code>
      </p>
      <p class="code-snippet">
        Engelsk:
        <code> &lt;NveMonthSelector v-model="input" language="en"/&gt; </code>
      </p>
    </div>

    <div class="info-section">
      <h2>Attributter</h2>
      <p>
        Språk på labels og måneder er standard definert til norsk bokmål, men
        nynorsk og engelsk er også støttet. Endre språk ved å sende inn "nb",
        "nn" eller "en" language-attributten. modelValue-attributten brukes til
        å hente og sette verdien på til «YYYY-MM» format.
      </p>

      <ul class="attributes-list">
        <li><b>modelValue</b> (string) - Verdien på formatet "YYYY-MM".</li>
        <li>
          <b>language</b> ("nb" | "nn" | "en") - Språket som skal brukes på
          labels og måneder i nedtrekk.
        </li>
        <li>
          <b>labels</b> (boolean) - Bestemmer om labels skal vises eller ikke.
        </li>
      </ul>
    </div>

    <div class="info-section">
      <h2>Emits</h2>
      <p>
        Sl-blur, change, input og update:modelValue events blir emittet ut fra
        komponentet som kan brukes.
      </p>
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

.code-snippet {
  display: flex;
  flex-direction: column;
}
.code-snippet > code {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--neutrals-border-default);
}

.attributes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-x-small);
  padding-top: var(--spacing-x-small);
}
.attributes-list > li {
  list-style-type: none;
}

.attributes-list > li > b {
  font-weight: 600;
}
</style>
