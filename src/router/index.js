import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/inbound/stock'),
        name: 'Dashboard',
        meta: { title: '仓储管理系统', icon: 'dashboard', affix: true }
      }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/inbound',
    component: Layout,
    children: [
      {
        path: 'stock',
        component: () => import('@/views/inbound/stock'),
        name: 'Stock',
        meta: { title: '入库', icon: 'component' }
      }
    ]
  },
  {
    path: '/outbound',
    component: Layout,
    children: [
      {
        path: 'shipped',
        component: () => import('@/views/outbound/shipped'),
        name: 'Shipped',
        meta: { title: '出库', icon: 'clipboard' }
      }
    ]
  },
  {
    path: '/download',
    component: Layout,
    children: [
      {
        path: 'download',
        component: () => import('@/views/download/index'),
        name: 'download',
        meta: { title: '其他下载', icon: 'clipboard' }
      }
    ]
  },
  {
    path: '/front-desk-charge',
    component: Layout,
    children: [
      {
        path: 'front-desk-charge',
        component: () => import('@/views/front-desk-charge/index'),
        name: 'frontDeskCharge',
        meta: { title: '前台收费报表', icon: 'clipboard' }
      }
    ]
  },
  {
    path: '/account-manage',
    component: Layout,
    children: [
      {
        path: 'account-manage',
        component: () => import('@/views/account-manage/index'),
        name: 'AccountManage',
        meta: { title: '客户管理', icon: 'component' }
      }
    ]
  },
  {
    path: '/statement',
    component: Layout,
    redirect: '/statement/inboundFee',
    name: 'Statement',
    meta: {
      title: '对账单',
      icon: 'example'
    },
    children: [
      {
        path: 'stockFee',
        component: () => import('@/views/statement/stockFee'),
        name: 'StockFee',
        meta: { title: '入仓费用表', icon: 'list' }

      },
      {
        path: 'shippedFee',
        component: () => import('@/views/statement/shippedFee'),
        name: 'ShippedFee',
        meta: { title: '出仓费用表', icon: 'list' }

      },
      {
        path: 'stockGoods',
        component: () => import('@/views/statement/stockGoods'),
        name: 'StockGoods',
        meta: { title: '入仓货物表', icon: 'list' }

      },
      {
        path: 'shippedGoods',
        component: () => import('@/views/statement/shippedGoods'),
        name: 'ShippedGoods',
        meta: { title: '出仓货物表', icon: 'list' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '系统管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '个人中心'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '用户管理',
          roles: ['admin']
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
