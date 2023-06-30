// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (browser.devtools && browser.devtools.panels) {
  browser.devtools.panels.create(
    'Extension Storage',
    '',
    '/dist/devtools/panel/index.html'
  )
}