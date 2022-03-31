import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../pages/Index";
Vue.use(VueRouter);
const routes = [
    {
        path: "/",
        redirect: "/index"
    },
    {
        path: "/index",
        name: "/index",
        component: Index,
    }
];
const router = new VueRouter({
    routes,
});
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转
    next();
});

export default router;
