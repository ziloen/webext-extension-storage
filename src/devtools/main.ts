// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (browser.devtools && browser.devtools.panels) {
  const inspectWindow = browser.devtools.inspectedWindow

  browser.devtools.panels.create(
    'WebExt Storage',
    '',
    '/dist/devtools/panel/index.html'
  )
}