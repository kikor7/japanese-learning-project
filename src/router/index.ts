import HomeView from '../views/homeView.vue'
import LoginView from '../views/loginView.vue'
import registerView from '@/views/registerView.vue'
import GameView from '../views/gameView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'principal', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: registerView },
  { path: '/juego', name: 'game', component: GameView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
