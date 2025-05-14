# CONTRIBUTING.md

Her finner du informasjon for deg som utvikler eller vedlikeholder `@norges-vassdrags-og-energidirektorat/nve-vue-components`.

## Dokumentasjon

- Dokumentasjon skrives på norsk – dette gjelder også kommentarer og JsDoc i koden.
- Eksempler og komponentbruk finnes i /demo-mappen.

## Kjøremiljø og utvikling

Prosjektet inneholder:

- Kildekode (/src/components)
- Demo-applikasjon (/demo)

## Starte demo-løsningen

1) Kjør `npm install` i rot og i /demo

2) Kjør `npm run demo` fra rotmappen

### Lint med [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Testing

### Lokal testing i et annet prosjekt

Hvis du jobber med komponentbiblioteket og ønsker å teste det lokalt i et annet prosjekt før publisering til npm, kan du gjøre følgende:

- 1. Bygg biblioteket:

```bash
npm run build
```

- 2.Installer det lokalt i testprosjektet:

```bash
npm install <absolutt/path/til/nve-vue-components>
```

### Enhetstesting

Alle komponenter i biblioteket skal ha tilhørende enhetstester. Du bør alltid kjøre testene før du committer – både når du **lager nye komponenter**, og når du **gjør endringer i eksisterende.**

#### Kjør alle tester

```bash
npm run test
```

#### Kjør kun test for én komponent

Hvis du bare ønsker å teste én spesifikk komponent (for eksempel `NveTable.spec.ts:`), kan du gjøre det slik:

```bash
npx vitest run src/components/NveTable.spec.ts
```

Eller, dersom du bruker script-aliaset:

```bash
npm run test:run src/components/NveTable.spec.ts
```

### Interaktiv testvisning i nettleser (UI-modus)

For en visuell testopplevelse der du kan utforske og kjøre tester i nettleser, bruk:

 ```bash
npm run test:ui
```

## Lage nye komponenter

For å legge til nye komponenter i biblioteket, følg disse stegene:

### 1. Legg komponenten i `src/components/`

Opprett en ny fil, f.eks. `NveAlert.vue`

```ts
<script setup lang="ts">
defineOptions({ name: 'NveAlert' })
</script>

<template>
  <div class="alert"><slot /></div>
</template>
```

### 2. Viktig: Sett `name` med `defineOptions`

```ts
defineOptions({ name: 'NveAlert' })
```

Dette fungerer med `<script setup>` i Vue 3.

### 3. Tips for kvalitet og gjenbruk

- Navngi komponenter med prefiks `Nve` (f.eks. `NveDialog`, `NveTable`)
- Bruk props og typer konsekvent med `defineProps` og `withDefaults`
- Skriv JsDoc-kommentarer på norsk for alle offentlige props
- Bruk `defineExpose` hvis du eksporterer metoder fra komponenten

### 4. Legg til komponenten manuelt i src/index.ts

Etter at du har opprettet komponenten, må du eksportere den manuelt fra `index.ts`:

```ts
export { default as NveAlert } from './components/NveAlert.vue';
```

Dette er nødvendig for at komponenten skal kunne importeres eksplisitt:

```ts
import { NveAlert } from '@norges-vassdrags-og-energidirektorat/nve-vue-components';
```

### 5. Test komponenten i `/demo`-appen

Bruk demo-prosjektet for å verifisere utseende og funksjonalitet.

### 6. Skriv en tilhørende  `.spec.ts`-testfil i samme mappe

Sjekk at testene fungerer:

```bash
npm run test:run src/components/NY_KOMPONENT.spec.ts
```

## Når du gjør endringer i en eksisterende komponent

- Kjør testene relatert til komponenten:

```bash
npm run test:run src/components/KOMPONENT.spec.ts
```

- Sørg for at eksisterende tester fortsatt passerer og oppdater/utvid dem ved behov.

- Hvis du legger til ny funksjonalitet – `skriv en test for det`.

## Eksportstruktur

Dette biblioteket tilbyr:

- `default` eksport for global registrering
- `named` eksport for individuell import

`vite.config.ts` bruker `output.exports = "named"` for å unngå advarsler og støtte begge måter. Dette er bevisst valgt for fleksibilitet.

## Automatisk release og versjonshåndtering 

Prosjektet benytter semantic-release [semantic-release](https://github.com/semantic-release) for helautomatisk versjonshåndtering og publisering til npm. Dette sikrer at nye versjoner publiseres konsekvent og korrekt basert på commit-meldinger, uten manuell inngripen.

### Hva skjer automatisk?

Ved merge til `main`-branchen:

- `semantic-release` kjører i GitHub Actions
- Endringer analyseres og neste versjonsnummer beregnes automatisk (`patch`, `minor`, `major`)
- Endringslogg (release notes) genereres
- Ny versjon tagges i Git
- Pakken publiseres til npm under [@norges-vassdrags-og-energidirektorat](https://www.npmjs.com/package/@norges-vassdrags-og-energidirektorat/nve-vue-components)

### Commit-meldinger (Conventional Commits)

For å utløse riktig versjonstype må commit-meldinger følge [Angular commit-konvensjonen:](https://www.conventionalcommits.org/en/v1.0.0/)

Eksempler:

- `fix: rettet feil i sortering` → patch release
- `feat: lagt til støtte for kolonnegruppering` → minor release
- `feat!: endret API for filtrering + BREAKING CHANGE:` i body → major release

Tips: Bruk `npm run commit` med [Commitizen](https://github.com/commitizen/cz-cli) for veiledet commit.

### Autentisering og tilgang

- **Publisering til npm** gjøres med en _granular access token_ som har:
Read/write-tilgang til `@norges-vassdrags-og-energidirektorat`
Begrenset til kun dette biblioteket

- **GitHub Actions** bruker en `NPM_TOKEN` secret:
Definert i repo: `Settings > Secrets and variables > Actions`
Token må ha tilgang til å publisere under organisasjonen

#### NPM-brukerkonto

Det er opprettet en felles NPM-brukerkonto (nve_design_system) for organisasjonen (norges-vassdrags-og-energidirektorat), og denne brukes til å håndtere tokens for dette biblioteket. Kontoen er tilknyttet en **Service bruker** i NVE.

Som fast ansatt i NVE kan du få tilgang til denne tjenestebrukeren og bruke den ved behov.

**For tilgang til tjenestebrukeren, ta kontakt med IUR.**

### Håndtering av versjoner

- Versjonsnummer i `package.json` oppdateres ikke manuelt
- Endringer følges via GitHub-releases og `CHANGELOG.md`
- Alle utgivelser får en vX.Y.Z Git-tag
