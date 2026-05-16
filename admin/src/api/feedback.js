import { callCloudFunction } from '@/utils/request'

export function adminGetFeedback(params = {}) {
  return callCloudFunction('adminGetFeedback', params)
}

export function adminUpdateFeedback(id, data) {
  return callCloudFunction('adminUpdateFeedback', { id, ...data })
}
