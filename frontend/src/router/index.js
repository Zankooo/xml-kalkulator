import { createRouter, createWebHistory } from "vue-router"

import HomePage from "../pages/HomePage.vue"
import AboutPage from "../pages/About.vue"

const routes = [
  { path: "/", component: HomePage },
  { path: "/about", component: AboutPage }
]

export const router = createRouter({   // <-- POIMENOVAN EXPORT
  history: createWebHistory(),
  routes
})
