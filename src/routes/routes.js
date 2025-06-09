const routes = [
  {
    path: '/login',
    component: 'Login',
    auth: false
  },
  {
    path: '/dashboard',
    component: 'Dashboard',
    auth: true
  },
  {
    path: '/items',
    component: 'ItemsList',
    auth: true
  },
  {
    path: '/item/:id',
    component: 'ItemDetails',
    auth: true
  },
  {
    path: '/item/:id/edit',
    component: 'EditItem',
    auth: true
  },
  {
    path: '/add-item',
    component: 'AddNewItem',
    auth: true
  }
];

export default routes;
