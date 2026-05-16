import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminLogin } from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const username = ref(localStorage.getItem('admin_username') || '')
  const isLoggedIn = ref(!!token.value)

  async function login(user, password) {
    const res = await adminLogin(user, password)
    if (res.token) {
      token.value = res.token
      username.value = res.username
      isLoggedIn.value = true
      localStorage.setItem('admin_token', res.token)
      localStorage.setItem('admin_username', res.username)
      return true
    }
    throw new Error(res.message || '登录失败')
  }

  function logout() {
    token.value = ''
    username.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    router.push('/login')
  }

  return { token, username, isLoggedIn, login, logout }
})
