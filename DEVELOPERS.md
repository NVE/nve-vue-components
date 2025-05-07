# 📕 DEVELOPERS.md

Her finner du informasjon for deg som utvikler eller vedlikeholder `@norges-vassdrags-og-energidirektorat/nve-vue-components`.

## 📚 Dokumentasjon

- Dokumentasjon skrives på norsk – dette gjelder også kommentarer og JsDoc i koden.
- Eksempler og komponentbruk finnes i /demo-mappen.

## 🛠️ Kjøremiljø og utvikling

Prosjektet inneholder:

- Kildekode (/src/components)
- Demo-applikasjon (/demo)

## Starte demo-løsningen

1) Kjør npm install i rot og i /demo

2) Kjør npm run demo fra rotmappen

## Lokal testing i et annet prosjekt

Etter  `npm run build`, lenk inn biblioteket:

```bash
npm install <path-til-denne-koden>
```

### 🧪 Lint med [ESLint](https://eslint.org/)

```sh
npm run lint
```


## 🧱 Lage nye komponenter

For å legge til nye komponenter i biblioteket, følg disse stegene:

### 1. 📁 Legg komponenten i `src/components/`

Opprett en ny fil, f.eks. `NveAlert.vue`

```ts
<script setup lang="ts">
defineOptions({ name: 'NveAlert' })
</script>

<template>
  <div class="alert"><slot /></div>
</template>
```

### 2. 🏷️ Viktig: Sett `name` med `defineOptions`

```ts
defineOptions({ name: 'NveAlert' })
```

Dette fungerer med `<script setup>` i Vue 3.

### 3.💡 Tips for kvalitet og gjenbruk

- Navngi komponenter med prefiks `Nve` (f.eks. `NveDialog`, `NveTable`)
- Bruk props og typer konsekvent med `defineProps` og `withDefaults`
- Skriv JsDoc-kommentarer på norsk for alle offentlige props
- Bruk `defineExpose` hvis du eksporterer metoder fra komponenten

### 4. 📝 Legg til komponenten manuelt i src/index.ts

Etter at du har opprettet komponenten, må du eksportere den manuelt fra `index.ts`:

```ts
export { default as NveAlert } from './components/NveAlert.vue';
```

Dette er nødvendig for at komponenten skal kunne importeres eksplisitt:

```ts
import { NveAlert } from '@norges-vassdrags-og-energidirektorat/nve-vue-components';
```


### 5. 🔬 Test komponenten i `/demo`-appen

Bruk demo-prosjektet for å verifisere utseende og funksjonalitet.

## 📦 Eksportstruktur

Dette biblioteket tilbyr:

- `default` eksport for global registrering
- `named` eksport for individuell import

`vite.config.ts` bruker `output.exports = "named"` for å unngå advarsler og støtte begge måter. Dette er bevisst valgt for fleksibilitet.
