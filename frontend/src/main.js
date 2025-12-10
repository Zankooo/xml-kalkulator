import { createApp } from "vue"
import App from "./App.vue"
import { router } from "./router/index.js"  // <-- TO JE PRAVILNO

createApp(App).use(router).mount("#app")
