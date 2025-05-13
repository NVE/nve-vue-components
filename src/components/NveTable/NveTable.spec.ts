/* eslint-disable max-lines-per-function */
import { mount } from '@vue/test-utils'
import NveTable from './NveTable.vue'
import { describe, it, expect } from 'vitest'

const headers = [
  { key: 'name', title: 'Navn' },
  { key: 'age', title: 'Alder' }
]

const testData = [
  { name: 'Kari', age: 31 },
  { name: 'Ola', age: 29 }
]

describe('NveTable', () => {
  it('renderar rader korrekt', async () => {
    const wrapper = mount(NveTable, {
      props: {
        headers,
        async: false as const,
        data: testData,
        itemId: (_, i) => i
      }
    })

    await new Promise(resolve => setTimeout(resolve))
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Kari')
    expect(rows[1].text()).toContain('Ola')
  })

  it('sorterer ASC og deretter DESC ved klikk på kolonne', async () => {
    const sortableHeaders = [
      { key: 'name', title: 'Navn' },
      {
        key: 'age',
        title: 'Alder',
        sort: (sorter: { direction: string }) => {
          return (a: { age: number }, b: { age: number }) => {
            const diff = a.age - b.age
            return sorter.direction === 'ASC' ? diff : -diff
          }
        }
      }
    ]

    const sortData = [
      { name: 'Kari', age: 31 },
      { name: 'Ola', age: 29 },
      { name: 'Per', age: 40 }
    ]

    const wrapper = mount(NveTable, {
      props: {
        headers: sortableHeaders,
        async: false as const,
        data: sortData,
        itemId: (_, i) => i
      }
    })

    await new Promise(resolve => setTimeout(resolve))
    await wrapper.vm.$nextTick()

    let rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Kari')

    await wrapper.get('thead th:nth-child(2) button').trigger('click')
    await wrapper.vm.$nextTick()

    rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Ola')

    await wrapper.get('thead th:nth-child(2) button').trigger('click')
    await wrapper.vm.$nextTick()

    rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Per')
  })

it('filtrerer rader basert på filterFunction og tekst', async () => {
  const wrapper = mount(NveTable, {
    props: {
      headers,
      async: false as const,
      data: testData,
      itemId: (_, i) => i,
      hideTextFilter: false,
      hideAllFilters: false,
      filterFunction: (searchText: string) => {
        return testData.filter((row) =>
          row.name.toLowerCase().includes(searchText.toLowerCase())
        )
      }
    },
    attachTo: document.body
  })

  await wrapper.vm.$nextTick()
  await new Promise(resolve => setTimeout(resolve, 10))

  // Hitta webkomponenten
  const filterInput = wrapper.find('[data-test="filter-input"]')
  expect(filterInput.exists()).toBe(true)

  // Emulera v-model-manipulation
  const el = filterInput.element as HTMLInputElement
  el.value = 'kari'
  el.dispatchEvent(new Event('input')) // Triggar v-model

  await wrapper.vm.$nextTick()
  await new Promise(resolve => setTimeout(resolve, 10))

  const rows = wrapper.findAll('tbody tr')
  expect(rows.length).toBe(1)
  expect(rows[0].text().toLowerCase()).toContain('kari')
})

it('viser korrekt side ved paginering', async () => {
  const paginatedData = [
    { name: 'Kari', age: 31 },
    { name: 'Ola', age: 29 },
    { name: 'Per', age: 40 },
    { name: 'Lise', age: 35 }
  ]

  const wrapper = mount(NveTable, {
    props: {
      headers,
      async: false as const,
      data: paginatedData,
      pageSize: 2,
      itemId: (_, i) => i
    },
    attachTo: document.body
  })

  await wrapper.vm.$nextTick()
  await new Promise(resolve => setTimeout(resolve, 10))

  // Første side: Kari og Ola
  let rows = wrapper.findAll('tbody tr')
  expect(rows.length).toBe(2)
  expect(rows[0].text()).toContain('Kari')
  expect(rows[1].text()).toContain('Ola')

  // Bytt til side 2 via data-test
  const nextButton = wrapper.find('[data-test="next-button"]')
  expect(nextButton.exists()).toBe(true)
  await nextButton.trigger('click')
  await wrapper.vm.$nextTick()
  await new Promise(resolve => setTimeout(resolve, 10))

  // Andre side: Per og Lise
  rows = wrapper.findAll('tbody tr')
  expect(rows.length).toBe(2)
  expect(rows[0].text()).toContain('Per')
  expect(rows[1].text()).toContain('Lise')
})

it('viser "Ingen data" når listen er tom', async () => {
  const wrapper = mount(NveTable, {
    props: {
      headers,
      async: false as const,
      data: [],
      itemId: (_, i) => i
    }
  })

  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toContain('Ingen data')
})
})
