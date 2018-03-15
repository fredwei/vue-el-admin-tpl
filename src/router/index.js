import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
//当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面(默认 false)
hidden: true

//当设置 noredirect 的时候该路由不会在面包屑导航中出现
redirect: noredirect

//当设置 true 的时候永远会显示根菜单，不设置的情况下只有当子路由个数大于一个时才会显示根菜单
//当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式。只有一个时会将那个子路由当做根路由
alwaysShow: true

name:'router-name'            //设定路由的名字，一定要填写不然 使用 <keep-alive> 时会出现各种问题
meta : {
  roles: ['admin','editor']   //设置该路由进入的权限，支持多个权限叠加
  title: 'title'              //设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name'            //设置该路由的图标
  noCache: true               //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
}
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: _import('home/index'),
      name: 'home',
      meta: {
        title: 'home',
        icon: 'chart',
        noCache: true
      }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

/*
  1、路由管理
  会根据用户权限生成新的路由表存入state
  所以当设置无权限访问某个页面时，该页面的路由不会被存入state的路由表中
  在页面上点击链接或者输入地址访问时，会因为找不到页面跳转404，而永远跳转不到401

  2、hidden: true
  设置hidden为true时，导航中不会出现该菜单
  如果是子路由设置hidden为true，父级路由在计算子路由个数时仍然还会统计
  子路由全部设置hidden为true时，父级路由点击无法跳转，展开也无内容
  所以 —— 判断子路由第一个子项的hidden为true时，会跳转到该路由的redirect
*/
export const asyncRouterMap = [
  // 产品
  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    meta: {
      title: 'product',
      icon: 'component'
    },
    children: [{
      // 首页
      path: 'index',
      component: _import('product/index'),
      name: 'product',
      hidden: true,
      meta: {
        title: 'product',
        icon: 'component'
      }
    }, {
      // 新增
      path: 'add',
      component: _import('product/add'),
      name: 'productAdd',
      hidden: true,
      meta: {
        title: 'productAdd',
        icon: 'form',
        roles: ['admin', 'editor']
      }
    }, {
      // 编辑
      path: 'edit/:id',
      component: _import('product/edit'),
      name: 'productEdit',
      hidden: true,
      meta: {
        title: 'productEdit',
        icon: 'form',
        roles: ['admin']
      }
    }]
  },
  // 404页面拦截
  { path: '*', redirect: '/404', hidden: true }
]
