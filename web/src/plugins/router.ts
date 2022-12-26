import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/poll',
      component: () => import('../views/Poll.vue')
    },
    {
      path: '/list',
      component: () => import('../views/List.vue')
    },
  ],
})
