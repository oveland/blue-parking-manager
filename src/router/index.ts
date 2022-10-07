import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import IndexPage from '../views/Index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: IndexPage,
    children: [
      {
        path: '',
        redirect: '/reservation'
      },
      {
        path: '/reservation',
        component: () => import('@/views/reservation/List.vue')
      },
      {
        path: '/reservation/create',
        component: () => import('@/views/reservation/Form.vue')
      },
      {
        path: '/account',
        component: () => import('@/views/account/Detail.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
