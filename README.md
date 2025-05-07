# @norges-vassdrags-og-energidirektorat/nve-vue-components

Vue-komponenter som bygger på [NVE Designsystem](https://designsystem.nve.no/), men som er for komplekse til å implementeres som rene web-komponenter.

## 📦 Installasjon

```bash
npm install @norges-vassdrags-og-energidirektorat/nve-vue-components
```

## 🚀 Bruk i Vue 3-prosjekter 

```ts
import { NveButton, NveTable } from '@norges-vassdrags-og-energidirektorat/nve-vue-components'
````

Eller registrer hele pakken globalt:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import NVEComponents from '@norges-vassdrags-og-energidirektorat/nve-vue-components'

const app = createApp(App)
app.use(NVEComponents)
app.mount('#app')
````

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

### 📄 Lisens

MIT © NVE

