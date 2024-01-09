<template>
  <div
    class="shrink text-ellipsis whitespace-nowrap break-all overflow-hidden"
    :style="{ color: dataColor }"
    :title="dataLabel.title"
  >
    <Comp />
  </div>
</template>

<script lang="tsx" setup>
const props = defineProps<{
  data: unknown,
  isPrimitive: boolean
}>()

const dataColor = computed(() => {
  const data = props.data
  if (props.isPrimitive) {
    if (typeof data === 'string') return '#98c379'
    else return '#d19a66'
  } else if (Array.isArray(data)) {
    return '#e5c07b'
  } else {
    return '#61afef'
  }
})

const dataLabel = computed(() => {
  const data = props.data

  if (props.isPrimitive) {
    if (typeof data === 'string') {
      return {
        title: data,
        Comp: <>"{data}"</>
      }
    }
    else {
      return {
        title: String(data),
        Comp: <>{String(data)}</>
      }
    }
  }

  if (Array.isArray(data)) {
    return {
      title: `Array [${data.length}]`,
      Comp: <>
        Array
        <span class="text-#999">[{data.length}]</span>
      </>
    }
  }

  if (data instanceof Set) {
    return {
      title: `Set [${data.size}]`,
      Comp: <>
        Set
        <span class="text-#aaa">[{data.size}]</span>
      </>
    }
  }

  if (data instanceof Map) {
    return {
      title: `Map [${data.size}]`,
      Comp: <>
        Map
        <span class="text-#999">[{data.size}]</span>
      </>
    }
  }

  if (data instanceof Date) {
    return {
      title: `Date(${data.toISOString()})`,
      Comp: <>
        Date
        <span class="text-#aaa">({data.toISOString()})</span>
      </>
    }
  }

  return {
    title: `Object {${Object.keys(data as object).length}}`,
    Comp: <>
      Object
      <span class="text-#aaa">{"{"}{Object.keys(data as object).length}{"}"}</span>
    </>
  }
})

const Comp = computed(() => dataLabel.value.Comp)
</script>