import { callCloudFunction } from '@/utils/request'

export function adminGetUsers(params = {}) {
  return callCloudFunction('adminGetUsers', params)
}

export function adminUpdateUser(id, data) {
  return callCloudFunction('adminUpdateUser', { id, ...data })
}
