import { App } from 'vue'
import { sortByFunction, sortByProperty } from './components/tableSortFunctions'

// Automatisk import av alle .vue-komponenter til ./components
const modules = import.meta.glob('./components/**/*.vue', { eager: true })

const NVEComponents = {
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

// Navngitte eksporter hvis du vil bruke individuelle ting
export { sortByFunction, sortByProperty }
