# Vue-komponenter for NVE Designsystem

NVE's standard komponentbibliotek er implementert som web-components. Mer info om dette finner du her: https://designsystem.nve.no/

Dette prosjektet inneholder komponenter som bygger på NVE sitt designsystem, men som blir ansett som for komplekse til å være rene web-komponenter.

## Dokumentasjon

Vi dokumenterer på norsk. Gjelder også JsDoc og kommentarer i koden.

## Kjøremiljø

Dette prosjektet inneholder selve koden, og en demo-applikasjon som ligger i `/demo`-mappen

For å kjøre demo-applikasjonen, sørg først for at du har gjort en `npm install` i rot og i `/demo`, kjør deretter `npm run demo` i rot-mappen

## Bruk i prosjekt

For info om komponentene, se demo-mappen.
Husk at du også må inkludere `nve-vue-components.css` i prosjektet ved bruk.

## Utvikling

For å teste koden i et lokalt miljø kan du kjøre en `npm run build` for så å kjøre `npm install <path-til-denne-koden>` i et prosjekt. Husk å også endre path til css-filen.
