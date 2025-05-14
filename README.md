# @norges-vassdrags-og-energidirektorat/nve-vue-components

Vue-komponenter som bygger på [NVE Designsystem](https://designsystem.nve.no/), men som er for komplekse til å implementeres som rene web-komponenter.

## Installasjon

```bash
npm install @norges-vassdrags-og-energidirektorat/nve-vue-components
```

## Bruk i Vue 3-prosjekter

### Importstruktur: Global vs. Lokal bruk

Biblioteket støtter både `global registrering` (hele pakken) og `lokal import` (enkeltkomponenter). Dette gir fleksibilitet i forskjellige prosjektstørrelser og behov.

#### Alternativ 1: Global registrering (app.use)

Registrerer `alle komponenter automatisk globalt`, slik at du slipper å importere dem én og én.

```ts
// main.ts eller main.js
import { createApp } from 'vue'
import App from './App.vue'
import NVEComponents from '@norges-vassdrags-og-energidirektorat/nve-vue-components'

const app = createApp(App)
app.use(NVEComponents)
app.mount('#app')
```

##### Bruk i komponenter uten import

```ts
<template>
  <NveTable :headers="headers" :data="countries" />
</template>

<script setup lang="ts">
// Ingen import av NveTable nødvendig!
</script>
```

#### Alternativ 2: Lokal import (tree-shaking)

Bare komponentene du faktisk bruker blir inkludert i bundlen – ideelt for optimal ytelse.

```ts
<template>
  <NveTable :headers="headers" :data="countries" />
</template>

<script setup lang="ts">
import { NveTable } from '@norges-vassdrags-og-energidirektorat/nve-vue-components'
</script>
```

### Eksempel: Bruk av NveTable

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { NveTable } from '@norges-vassdrags-og-energidirektorat/nve-vue-components'

type Country = { name: string; code: string; capital: string }

const headers = ref([
  { key: 'name', title: 'Navn' },
  { key: 'code', title: 'Kode' },
  { key: 'capital', title: 'Hovedstad' }
])

const countries = ref<Country[]>([
  { name: 'Norge', code: 'NO', capital: 'Oslo' },
  { name: 'Sverige', code: 'SE', capital: 'Stockholm' },
  { name: 'Danmark', code: 'DK', capital: 'København' }
])
</script>

<template>
  <NveTable :headers="headers" :data="countries" :item-id="(item) => item.code" striped />
</template>
```

## Lisens

MIT © NVE

## For utviklere

Hvis du skal bidra eller bygge ut biblioteket: se [CONTRIBUTING.md](./CONTRIBUTING.md)
