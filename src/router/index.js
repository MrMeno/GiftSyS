import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            component: resolve => require(['../view/login/index.vue'], resolve)
        }

        , {
            path: '/login',
            component: resolve => require(['../view/login/index.vue'], resolve)
        },
        {
            path: '/award',
            component: resolve => require(['../view/award/index.vue'], resolve)
        },
        {
            path: '/list',
            component: resolve => require(['../view/award/list.vue'], resolve)
        },
        {
            path: '/manage',
            component: resolve => require(['../view/manage/index.vue'], resolve)
        }
    ]
})