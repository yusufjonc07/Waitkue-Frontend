import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import ClientLayout from '../layouts/ClientLayout.vue'
import { useAuthStore } from '../stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' },
  },
  {
    name: 'admin',
    path: '/admin',
    component: AppLayout,
    redirect: '/dashboard',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'queues',
        path: 'queues',
        component: () => import('../pages/queues/QueuesPage.vue'),
      },
      {
        name: 'waitlist',
        path: 'waitlist',
        component: () => import('../pages/queues/WaitlistPage.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'services',
        path: 'services',
        component: () => import('../pages/services/ServicesPage.vue'),
      },
      {
        name: 'logout',
        path: 'logout',
        component: () => import('../pages/auth/Logout.vue'),
      },
    ],
  },
  {
    path: '/',
    component: ClientLayout,
    children: [
      {
        path: '',
        redirect: { name: 'home' },
      },
      {
        name: 'home',
        path: 'home',
        component: () => import('../pages/client/HomePage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isLoggedIn = auth.isAuthenticated
  const userRole = auth.currentUser?.role

  const isAuthPage = to.path.startsWith('/auth')
  const isHomePage = to.path.startsWith('/home')
  const isAdminPage = to.path.includes('/dashboard')

  if (isLoggedIn && (isAuthPage || isAdminPage) && userRole == 'client') {
    next({ name: 'home' })
  } else if (isLoggedIn && (isAuthPage || isHomePage) && userRole == 'admin') {
    next({ name: 'dashboard' })
  } else if (!isLoggedIn && to.meta.requiresAuth) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
