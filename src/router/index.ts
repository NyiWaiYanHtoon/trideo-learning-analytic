import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Auth from '../components/Authentication.vue'
import Layout from '../components/Layout.vue'
import Video from '../components/Video.vue'
import AnalyticDashboard from '@/components/AnalyticDashboard.vue'
import AdminLayout from '@/components/AdminLayout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/home', name: 'Home', component: Home },
    ]
  },
  { path: '/video/:id', name: 'Video', component: Video, props: true },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'analytics', name: 'Analytics', component: AnalyticDashboard }
    ]
  },
  { path: '/Auth', name: 'Auth', component: Auth}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
