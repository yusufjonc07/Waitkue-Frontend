export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'queues',
      displayName: 'menu.queues',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'services',
      displayName: 'menu.services',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'waitlist',
      displayName: 'menu.waitlist',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'users',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
      },
    },

    {
      name: 'preferences',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
