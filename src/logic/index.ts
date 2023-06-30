import { isFirefox } from '~/env'

export * from './storage'


export const getScript = (name: string) => `${isFirefox ? '' : '.'}/dist/contentScripts/${name}.js`