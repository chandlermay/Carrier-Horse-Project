import { supabase } from '../utils/supabase'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/auth', component: () => import('../views/AuthView.vue') },
    { path: '/dashboard', component: () => import('../views/Dashboard.vue') }
  ]
})

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  if (to.path === '/dashboard' && !user) {
    return '/auth'
  }
})

export default router