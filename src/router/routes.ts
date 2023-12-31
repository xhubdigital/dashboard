import { RouteRecordRaw } from 'vue-router';

export const DEFAULT_DASHBOARD_ROUTE = '/dashboard';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'auth/sign-in',
        component: () => import('pages/auth/SignIn.vue'),
        meta: {
          isAuth: true,
        },
      },
      {
        path: 'sign-up',
        name: 'auth/sign-up',
        component:  () => import('pages/auth/SignUp.vue'),
        meta: {
          isAuth: true,
        },
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        name: 'home/dashboard',
        path: '',
        component: () => import('pages/dashboard/home/HomeDashboard.vue'),
      },
      {
        path: 'menu',
        component: () => import('pages/dashboard/menu/MenuContainer.vue'),
        children: [
          {
            name: 'menu/main-menu',
            path: '',
            component: () => import('pages/dashboard/menu/MainMenu.vue'),
            children: [
              {
                name: 'menu/main-menu/reorder',
                path: 'reorder',
                // eslint-disable-next-line max-len
                component: () => import('pages/dashboard/menu/ReorderProducts.vue'),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'menu/main-menu/add-category',
                path: 'categories/new',
                component: () =>
                  import('pages/dashboard/menu/CategoryForm.vue'),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'menu/main-menu/edit-category',
                path: 'categories/:id',
                component: () =>
                  import('pages/dashboard/menu/CategoryForm.vue'),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'menu/main-menu/add-product',
                path: 'new',
                component: () => import('pages/dashboard/menu/ProductForm.vue'),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'menu/main-menu/edit-product',
                path: ':id',
                component: () => import('pages/dashboard/menu/ProductForm.vue'),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'menu/main-menu/edit-complements',
                path: ':id/complements',
                component: () =>
                  import('pages/dashboard/menu/UpdateComplements.vue'),
                meta: {
                  isDialog: true,
                },
              },
            ],
          },
          {
            name: 'menu/complements',
            path: 'complements',
            component: () => import('pages/dashboard/menu/Complements.vue'),
            children: [
              {
                name: 'menu/complements/add-group',
                path: 'new',
                // eslint-disable-next-line max-len
                component: () => import('pages/dashboard/menu/complements/ComplementGroupForm.vue'),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'menu/complements/edit-group',
                path: ':id',
                // eslint-disable-next-line max-len
                component: () => import('pages/dashboard/menu/complements/ComplementGroupForm.vue'),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'menu/complements/connect-products',
                path: ':id/products',
                // eslint-disable-next-line max-len
                component: () => import('pages/dashboard/menu/complements/ComplementGroupToProductForm.vue'),
                meta: {
                  isDialog: true,
                },
              },
            ],
          },
        ],
      },
      {
        name: 'orders/list',
        path: 'orders',
        component: () => import('pages/dashboard/orders/Orders.vue'),
        children: [
          {
            name: 'orders/open',
            path: '',
            component: () =>
              import('pages/dashboard/orders/tabs/OpenOrders.vue'),
          },
          {
            name: 'orders/closed',
            path: 'closed',
            component: () =>
              import('pages/dashboard/orders/tabs/ClosedOrders.vue'),
          },
        ],
      },
      {
        name: 'clients/list',
        path: 'clients',
        component: () => import('pages/dashboard/clients/List.vue'),
      },
      {
        path: 'policies',
        component: () => import('pages/dashboard/policies/Policies.vue'),
        children: [
          {
            name: 'policies/contents',
            path: '',
            component: () =>
              import('pages/dashboard/policies/tabs/ContentsPolicies.vue'),
          },
          {
            name: 'policies/privacy',
            path: 'privacy',
            component: () =>
              import('pages/dashboard/policies/tabs/PrivacyPolicies.vue'),
          },
          {
            name: 'policies/illicit',
            path: 'illicit',
            component: () =>
              import('pages/dashboard/policies/tabs/IllicitPolicies.vue'),
          },
        ],
      },
      {
        path: 'store',
        component: () => import('pages/dashboard/store/StorePage.vue'),
        children: [
          {
            name: 'store/details',
            path: '',
            component: () =>
              import('pages/dashboard/store/tabs/StoreDetails.vue'),
          },
          {
            name: 'store/members',
            path: 'members',
            component: () =>
              import('pages/dashboard/store/tabs/members/MembersList.vue'),
            children: [
              {
                name: 'store/members/new',
                path: 'new',
                component: () => import(
                  'pages/dashboard/store/tabs/members/MemberForm.vue'
                ),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'store/members/edit',
                path: ':id',
                component: () => import(
                  'pages/dashboard/store/tabs/members/MemberForm.vue'
                ),
                meta: {
                  isDialog: true,
                },
              },
            ],
          },
          {
            name: 'store/delivery-areas',
            path: 'delivery-areas',
            // eslint-disable-next-line max-len
            component: () => import('pages/dashboard/store/tabs/delivery-areas/DeliveryAreas.vue'),
          },
          {
            name: 'store/work-hours',
            path: 'work-hours',
            // eslint-disable-next-line max-len
            component: () => import('pages/dashboard/store/tabs/work-hours/WorkHours.vue'),
            children: [
              {
                name: 'store/work-hours/new',
                path: 'new',
                component: () => import(
                  'pages/dashboard/store/tabs/work-hours/NewWorkHour.vue'
                ),
                meta: {
                  isDialog: true,
                },
              },
              {
                name: 'store/work-hours/edit',
                path: ':id',
                component: () => import(
                  'pages/dashboard/store/tabs/work-hours/EditWorkHour.vue'
                ),
                meta: {
                  isDialog: true,
                },
              },
            ],
          },
        ],
      },
      {
        name: 'inventory/list',
        path: 'inventory',
        component: () => import('pages/dashboard/inventory/ItemsList.vue'),
        children: [
          {
            name: 'inventory/new',
            path: 'new',
            component: () => import(
              'pages/dashboard/inventory/InventoryItemForm.vue'
            ),
            meta: {
              isDialog: true,
            },
          },
          {
            name: 'inventory/edit-item',
            path: ':id',
            component: () => import(
              'pages/dashboard/inventory/InventoryItemForm.vue'
            ),
            meta: {
              isDialog: true,
            },
          },
          {
            name: 'inventory/change-amount',
            path: ':id/amount',
            component: () => import(
              'pages/dashboard/inventory/ChangeItemAmount.vue'
            ),
            meta: {
              isDialog: true,
            },
          },
          {
            name: 'inventory/change-history',
            path: ':id/history',
            component: () => import(
              'pages/dashboard/inventory/InventoryItemHistory.vue'
            ),
            meta: {
              isDialog: true,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'receipt/details',
    path: '/receipt/:id',
    component: () => import('pages/receipt/OrderReceipt.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '*',
  //   component: () => import('pages/Error404.vue'),
  // },
];

export default routes;
