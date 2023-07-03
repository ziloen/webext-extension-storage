<template>
  <div>
    <!-- TODO: local / sync switch -->
    <div>
      <button class="btn" @click="currentArea = 'local'">storage.local</button>
      <button class="btn" @click="currentArea = 'sync'">storage.sync</button>
      <span>{{ currentArea }}</span>
    </div>
    <!-- TODO: filter & search & order -->
    <!-- <input /> -->
  </div>
  <DataType v-for="[k, v] of Object.entries(currentArea === 'local' ? local : sync)" :key="k" :prop-name="k" :data="v" />
</template>



<script lang="ts" setup>
import Browser from 'webextension-polyfill'
import { inspectedEval } from '~/logic'
import DataType from './DataType.vue'

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