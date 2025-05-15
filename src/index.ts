import type { App, Plugin } from 'vue';
import { sortByFunction, sortByProperty } from './components/NveTable/tableSortFunctions';

//  Automatisk global registrering
const modules = import.meta.glob('./components/**/*.vue', { eager: true });

const NVEComponents: Plugin = {
  install(app: App) {
    for (const path in modules) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = modules[path] as any;
      const component = mod.default;
      if (component?.name) {
        app.component(component.name, component);
      }
    }
  },
};

export default NVEComponents;

// Vi eksporterer både default og named exports for å støtte fleksibel import:
// - `import NVEComponents from 'vue-components'` (standardbruk)
// - `import { NveTable } from 'vue-components'` (direkte komponentbruk)

//  Named exports
export { sortByFunction, sortByProperty };

//  Legg til en eksport for hver komponent du ønsker å kunne importere separat:
export * from './components/NveTable';

