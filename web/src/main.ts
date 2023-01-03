import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import { loadFonts } from './plugins/webfontloader'
// import VConsole from 'vconsole';

// const vConsole = new VConsole();

loadFonts()

createApp(App).use(router).use(vuetify).mount('#app')
