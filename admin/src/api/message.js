import { callCloudFunction } from '@/utils/request'

export function adminGetMessages(params = {}) {
  return callCloudFunction('adminGetMessages', params)
}

export function adminDeleteMessage(id) {
  return callCloudFunction('adminDeleteMessage', { id })
}
