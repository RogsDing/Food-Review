import { callCloudFunction } from '@/utils/request'

export function adminGetReviews(params = {}) {
  return callCloudFunction('adminGetReviews', params)
}

export function adminDeleteReview(id) {
  return callCloudFunction('adminDeleteReview', { id })
}

export function adminBatchDeleteReviews(ids) {
  return callCloudFunction('adminDeleteReview', { ids, batch: true })
}
