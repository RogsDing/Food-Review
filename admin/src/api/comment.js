import { callCloudFunction } from '@/utils/request'

export function adminGetComments(params = {}) {
  return callCloudFunction('adminGetComments', params)
}

export function adminDeleteComment(id) {
  return callCloudFunction('adminDeleteComment', { id })
}
