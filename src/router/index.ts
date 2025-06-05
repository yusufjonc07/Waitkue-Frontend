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
      roles: ['admin', 'service_admin', 'client'], // clients need access to settings/logout
    },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
        meta: {
          roles: ['admin', 'service_admin'],
        },
      },
      {
        name: 'queues',
        path: 'queues',
        component: () => import('../pages/queues/QueuesPage.vue'),
        meta: {
          roles: ['admin', 'service_admin'],
        },
      },
      {
        name: 'waitlist',
        path: 'waitlist',
        component: () => import('../pages/queues/WaitlistPage.vue'),
        meta: {
          roles: ['admin', 'service_admin'],
        },
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
        meta: {
          roles: ['admin'],
        },
      },
      {
        name: 'services',
        path: 'services',
        component: () => import('../pages/services/ServicesPage.vue'),
        meta: {
          roles: ['admin', 'service_admin'],
        },
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
        name: 'home',
        path: 'home',
        component: () => import('../pages/client/HomePage.vue'),
      },
    ],
    meta: {
      roles: ['client'],
    },
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

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    return next({ name: 'login' })
  }

  if (!isLoggedIn) {
    if (to.path === '/' || (!to.path.startsWith('/auth') && to.name !== 'home')) {
      return next({ name: 'home' })
    }
    return next()
  }

  if (isLoggedIn && isAuthPage) {
    if (userRole === 'client') return next({ name: 'home' })
    return next({ name: 'dashboard' })
  }
})

export default router
