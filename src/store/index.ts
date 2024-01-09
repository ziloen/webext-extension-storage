import { defineStore } from 'pinia'

type ExpandTree = {
  expanded: boolean,
  children: Record<string | number, ExpandTree>
}


export const useExpandState = defineStore('expand-state', () => {
  const expanded = ref<Record<string | number, ExpandTree>>({})

  function setExpandState(
    path: (string | number)[],
    state: boolean,
    current = expanded.value
  ) {
    const [key, ...rest] = path
    if (key === undefined) return

    if (rest.length === 0) {
      if (current[key]) {
        current[key]!.expanded = state
      } else {
        current[key] = {
          expanded: state,
          children: {}
        }
      }
    } else {
      if (!current[key]) {
        current[key] = {
          expanded: false,
          children: {}
        }
      }

      setExpandState(rest, state, current[key]!.children)
    }
  }

  function getExpandState(
    path: (string | number)[],
    current = expanded.value
  ): boolean {
    const [key, ...rest] = path
    if (key === undefined) return false

    if (rest.length === 0) {
      return !!current[key]?.expanded
    } else {
      return getExpandState(rest, current[key]?.children)
    }
  }

  return {
    expanded,
    setExpandState,
    getExpandState
  }
})