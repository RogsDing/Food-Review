import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'DataBoard' }
      },
      {
        path: 'reviews',
        name: 'Reviews',
        component: () => import('@/views/review/ReviewList.vue'),
        meta: { title: '点评管理', icon: 'EditPen' }
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('@/views/comment/CommentList.vue'),
        meta: { title: '评论管理', icon: 'ChatDotRound' }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/message/MessageList.vue'),
        meta: { title: '留言管理', icon: 'Memo' }
      },
      {
        path: 'recipes',
        name: 'Recipes',
        component: () => import('@/views/recipe/RecipeList.vue'),
        meta: { title: '菜谱管理', icon: 'Bowl' }
      },
      {
        path: 'recipes/add',
        name: 'RecipeAdd',
        component: () => import('@/views/recipe/RecipeForm.vue'),
        meta: { title: '新增菜谱', hidden: true }
      },
      {
        path: 'recipes/edit/:id',
        name: 'RecipeEdit',
        component: () => import('@/views/recipe/RecipeForm.vue'),
        meta: { title: '编辑菜谱', hidden: true }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('@/views/feedback/FeedbackList.vue'),
        meta: { title: '反馈管理', icon: 'Comment' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '管理后台'} - 美食点评`
  const token = localStorage.getItem('admin_token')
  if (!to.meta.noAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
