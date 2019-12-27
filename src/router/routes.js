// [OAUTH] meta requiresAuth: true => Authentification nécessaire pour accéder à la route
// [ROLE] meta requiresAdmin: true => Contôle sur utilisateur du group "admin" pour accéder à route
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        name: 'img_selection',
        component: () => import('pages/ImagesSelection.vue'),
        props: {},
        meta: { requiresAdmin: false },
      },
      {
        path: '/galerie/:id',
        name: 'galerie',
        component: () => import('pages/Galerie.vue'),
        meta: { requiresAdmin: false },
      },
    ],
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    meta: {
      requiresAuth: false,
      requiresAdmin: false,
    },
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
