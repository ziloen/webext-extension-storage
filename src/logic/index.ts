import { isFirefox } from '~/env'

export * from './storage'


export const getScript = (name: string) => `${isFirefox ? '' : '.'}/dist/contentScripts/${name}.js`


export async function inspectedEval<T>(fn: (chrome: typeof browser, id: string) => T) {
  const src = `(${fn.toString()})(chrome, ${JSON.stringify(browser.runtime.id)})`

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [res, info] = await browser.devtools.inspectedWindow.eval(src)

  if (info.isError) {
    throw new Error(info.value)
  }

  return res as T
}


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



/**
 * Return `true` if the given `val` is a primitive type. Otherwise return `false`.
 */
export function isPrimitive(val: unknown): val is string | number | boolean | symbol | bigint | null | undefined {
  return (
    typeof val !== 'object' && typeof val !== 'function' ||
    val === null
  )
}
