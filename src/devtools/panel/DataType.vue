<template>
  <div class="flex flex-col w-full">
    <div class="flex items-center w-full gap-2 text-#75bfe9" @click="onExpandClick">
      <octicon:chevron-right-24 :class="['shrink-0 text-white', { 'opacity-0': isDataPrimitive }]" />
      <div class="shrink-0">{{ propName }}:</div>

      <div
        class="shrink text-ellipsis whitespace-nowrap break-all overflow-hidden" :title="dataLabel"
        :style="{ color: dataColor }"
      >
        {{ dataLabel }}
      </div>
    </div>

    <div v-if="!isDataPrimitive && expanded" class="pl-4">
      <template v-if="Array.isArray(data)">
        <DataType v-for="(d, i) of data" :key="i" :prop-name="i" :data="d" />
      </template>
      <template v-else>
        <DataType v-for="[k, v] of Object.entries(data)" :key="k" :prop-name="k" :data="v" />
      </template>
    </div>
  </div>
</template>



<script lang="ts" setup>
import { isPrimitive } from '~/logic'

const props = defineProps<{
  propName: string | number
  data: unknown
}>()

const expanded = ref(false)

function onExpandClick(e: MouseEvent) {
  expanded.value = !expanded.value
}

const isDataPrimitive = computed(() => isPrimitive(props.data))
const dataColor = computed(() => {
  const data = props.data
  if (isDataPrimitive.value) {
    if (typeof data === 'string') return '#98c379'
    else return '#d19a66'
  } else if (Array.isArray(data)) {
    return '#e5c07b'
  } else {
    return '#61afef'
  }
})

const dataLabel = computed<string>(() => {
  const data = props.data
  if (isDataPrimitive.value) {
    if (typeof data === 'string') return `"${data}"`
    else return String(data)
  } else if (Array.isArray(data)) {
    return `Array(${data.length})`
  } else if (data instanceof Set) {
    return `Set[${data.size}]`
  } else if (data instanceof Map) {
    return `Map[${data.size}]`
  } else if (data instanceof Date) {
    return `Date(${data.toISOString()})`
  } else {
    return `Object(${Object.keys(data as object).length})`
  }
})
</script>



<style lang="scss" scoped></style>