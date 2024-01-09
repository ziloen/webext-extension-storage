<template>
  <div class="flex flex-col w-full text-14px leading-22px focus:bg-white/3" tabindex="0">
    <div
      :class="[
        'flex items-center w-full gap-2 text-#cfd3dc',
        !isDataPrimitive && 'cursor-pointer'
      ]"
      @click="onExpandClick"
    >
      <IconChevronRIght
        :class="[
          'shrink-0 text-white',
          expanded ? 'opacity-100' : 'opacity-35',
          isDataPrimitive && 'invisible',
          expanded && 'rotate-90',
        ]"
      />
      <div class="shrink-0">{{ propName }}:</div>

      <ValueViewer :data="data" :is-primitive="isDataPrimitive" />
    </div>

    <div v-if="!isDataPrimitive && expanded" class="pl-4 relative">
      <template v-if="Array.isArray(data)">
        <DataType v-for="(d, i) of data" :path="[...path, i]" :key="i" :prop-name="i" :data="d" />
      </template>
      <template v-else>
        <DataType
          v-for="[k, v] of Object.entries(data as object)"
          :key="k"
          :path="[...path, k]"
          :prop-name="k"
          :data="v"
        />
      </template>

      <div class="absolute h-full w-px bg-white/10 left-2 top-0"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ValueViewer from './DataValueViewer.vue'

import { isPrimitive } from '@wai-ri/core'
import IconChevronRIght from '~icons/carbon/chevron-right'
import { useExpandState } from "~/store"

const props = defineProps<{
  propName: string | number
  path: (string | number)[]
  data: unknown
}>()

const expandedStore = useExpandState()

const expanded = computed(() => {
  return expandedStore.getExpandState(props.path)
})

function onExpandClick() {
  expandedStore.setExpandState(props.path, !expanded.value)
}

const isDataPrimitive = computed(() => isPrimitive(props.data))
</script>