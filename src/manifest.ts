import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    devtools_page: './dist/devtools/index.html',
    permissions: [
      'activeTab',
      'clipboardRead',
      'clipboardWrite',
      // 'devtools',
      'storage',
      'tabs',
    ],
    host_permissions: [
      '<all_urls>',
    ],
    web_accessible_resources: [
      {
        matches: ['<all_urls>'],
        resources: ['dist/contentScripts/style.css'],
      }
    ],
    content_security_policy: {
      extension_pages: isDev
        ? `script-src 'self' http://localhost:${port}; object-src 'self'`
        : "script-src 'self'; object-src 'self'",
    }
  }

  if (isDev) {
    manifest.permissions?.push('webNavigation')
  }

  return manifest
}