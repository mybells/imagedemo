import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap =[
    { path: '/404', component: () => import('@/views/404.vue'), hidden: true },
    { path: '*', redirect: '/404', hidden: true }
];
export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
