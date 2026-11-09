import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Dashboard from '@/views/Dashboard.vue'
import SignUp from '@/views/SignUp.vue'
import HowDoesItWork from '@/views/HowDoesItWork.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/howdoesitwork',
      name: 'howdoesitwork',
      component: HowDoesItWork,
    },
  ],
})

export default router
