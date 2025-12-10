import { createRouter, createWebHistory } from "vue-router"

import HomePage from "../pages/HomePage.vue"
import AboutPage from "../pages/About.vue"
import Delovanje from "../pages/Delovanje.vue"

const routes = [
  { path: "/", component: HomePage },
  { path: "/about", component: AboutPage },
  { path: "/delovanje", component: Delovanje }
]

export const router = createRouter({   // <-- POIMENOVAN EXPORT
  history: createWebHistory(),
  routes
})
