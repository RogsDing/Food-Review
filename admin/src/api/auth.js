import { callCloudFunction } from '@/utils/request'

export function adminLogin(username, password) {
  return callCloudFunction('adminLogin', { username, password })
}
