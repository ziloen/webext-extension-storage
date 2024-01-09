import 'element-plus/dist/index.css'
import '~/styles'

import { createPinia } from "pinia"
import { createApp } from 'vue'
import App from './Panel.vue'

const app = createApp(App)
app
  .use(createPinia())
  .mount('#app')
