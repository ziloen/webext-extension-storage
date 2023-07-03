import 'element-plus/dist/index.css'
import '~/styles'

import { createApp } from 'vue'
import { setupApp } from '~/logic/common-setup'
import App from './Panel.vue'

const app = createApp(App)
setupApp(app)
app.mount('#app')
