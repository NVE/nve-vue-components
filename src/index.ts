import { App, Plugin } from 'vue'
import { sortByFunction, sortByProperty } from './components/tableSortFunctions'

// Automatisk import av alle .vue-komponenter i ./components
const modules = import.meta.glob('./components/**/*.vue', { eager: true })

const NVEComponents: Plugin = {
  install(app: App) {
    for (const path in modules) {
      const mod = modules[path] as any
      const component = mod.default
      if (component?.name) {
        app.component(component.name, component)
      }
    }
  }
}

export default NVEComponents 

// Named exports
export { sortByFunction, sortByProperty }
