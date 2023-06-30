<template>
  <div>Extension Storage Devtools Panel Page</div>
  <div>{{ t }}</div>
  <div v-for="k of Object.keys(all)" :key="k">{{ k }}</div>
</template>



<script lang="ts" setup>
import Browser from 'webextension-polyfill'
import { getScript } from '~/logic'
const t = document.location

const all = ref<Record<string, any>>({})


browser.runtime.onConnect.addListener(port => {
})

onMounted(() => {
  evalFn((chrome, id) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chrome.storage) return

    const port = chrome.runtime.connect(id, { name: 'devtools' })

    function onStorageChange(
      changes: Browser.Storage.StorageAreaOnChangedChangesType,
      areaName: string
    ) {
      port.postMessage({ type: 'storage', changes, areaName })
    }

    chrome.storage.onChanged.addListener(onStorageChange)

    port.onDisconnect.addListener(() => {
      chrome.storage.onChanged.removeListener(onStorageChange)
    })
  })
})

async function injectScript<T>(scriptName: string, module?: boolean): Promise<T> {
  const src = `
    (function() {
      const script = document.constructor.prototype.createElement.call(document, 'script');
      script.src = "${scriptName}";
      ${module ? 'script.type = "module";' : ''}
      document.documentElement.append(script);
      script.remove();
    })()`

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [res, info] = await browser.devtools.inspectedWindow.eval(src)

  if (info.isError) {
    throw new Error(info.value)
  }

  return res as T
}

async function evalFn<T>(fn: (chrome: typeof browser, id: string) => T) {
  const src = `(${fn.toString()})(chrome, ${JSON.stringify(browser.runtime.id)})`

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [res, info] = await browser.devtools.inspectedWindow.eval(src)

  if (info.isError) {
    throw new Error(info.value)
  }

  return res as T
}

</script>



<style lang="scss" scoped></style>