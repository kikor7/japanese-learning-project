import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import registerView from '@/views/RegisterView.vue'
import GameView from '../views/GameView.vue'
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
