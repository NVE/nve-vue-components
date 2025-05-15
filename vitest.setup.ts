import { vi } from 'vitest'

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor() {}
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
 
global.IntersectionObserver = IntersectionObserverMock as any

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()
