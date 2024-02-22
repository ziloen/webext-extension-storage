<template>
  <div class="w-full h-full flex flex-col px-2 py-2 bg-#1e2227">
    <div class="text-#c5c5c5">
      <!-- TODO: local / sync switch -->
      <div class="flex-align gap-2">
        <button class="btn" @click="currentArea = 'local'">storage.local</button>
        <button class="btn" @click="currentArea = 'sync'">storage.sync</button>
        <span>{{ currentArea }}</span>

        <div
          class="cursor-pointer rounded-4px hover:bg-white/20 p-2px active:opacity-85"
          @click="expandedStore.clear()"
          title="Collapse All"
        >
          <IconCollapseAll class="text-16px" />
        </div>
      </div>
      <!-- TODO: filter & search & order -->
      <!-- <input /> -->
    </div>
    <div class="flex flex-col h-0 grow of-y-auto py-2 font-mono">
      <DataType
        v-for="[k, v] of Object.entries(currentArea === 'local' ? local : sync)"
        :key="k"
        :prop-name="k"
        :path="[k]"
        :data="v"
      />
    </div>
  </div>
</template>



<script lang="ts" setup>
import DataType from './DataType.vue'

import Browser from 'webextension-polyfill'
import { inspectedEval } from '~/logic'
import { useExpandState } from '~/store'
import IconCollapseAll from '~icons/codicon/collapse-all'

const expandedStore = useExpandState()

const local = ref<Record<string, any>>({})
const sync = ref<Record<string, any>>({})


const currentArea = ref<AreaName>('local')

type AreaName = 'local' | 'sync'

type MsgType = {
  type: 'init'
  data: Record<string, any>
  areaName: AreaName
} | {
  type: 'change'
  data: Browser.Storage.StorageAreaOnChangedChangesType
  areaName: AreaName
}

browser.runtime.onConnectExternal.addListener(port => {
  if (port.name !== 'devtools' || port.sender?.tab?.id !== browser.devtools.inspectedWindow.tabId) return

  port.onMessage.addListener((msg: MsgType) => {
    if (msg.type === 'init') {
      if (msg.areaName === 'local') {
        local.value = msg.data
      } else {
        sync.value = msg.data
      }
    } else {
      if (msg.areaName === 'local') {
        for (const [key, change] of Object.entries(msg.data)) {
          if (Object.hasOwn(change, 'newValue')) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            local.value[key] = change.newValue
          } else {
            Reflect.deleteProperty(local.value, key)
          }
        }
      } else {
        for (const [key, change] of Object.entries(msg.data)) {
          if (Object.hasOwn(change, 'newValue')) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            sync.value[key] = change.newValue
          } else {
            Reflect.deleteProperty(sync.value, key)
          }
        }
      }
    }
  })
})

onMounted(() => {
  inspectedEval((chrome, id) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chrome.storage) return

    const port = chrome.runtime.connect(id, { name: 'devtools' })

    function onStorageChange(
      changes: Browser.Storage.StorageAreaOnChangedChangesType,
      areaName: string
    ) {
      port.postMessage({ type: 'change', data: changes, areaName })
    }

    chrome.storage.onChanged.addListener(onStorageChange)

    chrome.storage.local.get(null).then(res => {
      port.postMessage({ type: 'init', data: res, areaName: 'local' })
    })

    chrome.storage.sync.get(null).then(data => {
      port.postMessage({ type: 'init', data, areaName: 'sync' })
    })

    port.onDisconnect.addListener(() => {
      chrome.storage.onChanged.removeListener(onStorageChange)
    })
  })
})

</script>



<style lang="scss" scoped></style>