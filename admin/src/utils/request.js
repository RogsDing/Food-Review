import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      ElMessage.error('无法连接到代理服务，请确保已启动 npm run server')
    } else {
      ElMessage.error(error.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export async function callCloudFunction(name, data = {}) {
  const token = localStorage.getItem('admin_token')

  const res = await api.post('/callFunction', {
    name,
    data: {
      ...data,
      adminToken: token
    }
  })

  if (!res.success && res.message === '未授权') {
    ElMessage.error('登录已过期，请重新登录')
    localStorage.removeItem('admin_token')
    router.push('/login')
    throw new Error('未授权')
  }

  return res
}
