import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/Users.vue'
import Right from '../components/Right.vue'
import Roles from '../components/Roles.vue'
import Category from '../components/Category.vue'
import Goods from '../components/Goods.vue'
import GoodsAdd from '../components/GoodsAdd.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Right
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'category',
        component: Category
      },
      {
        path: '/goods',
        name: 'goods',
        component: Goods
      },
      {
        path: '/goods-add',
        name: 'goods-add',
        component: GoodsAdd
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.path === '/login' || localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})

export default router
