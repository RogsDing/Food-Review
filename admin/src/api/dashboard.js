import { callCloudFunction } from '@/utils/request'

export function getDashboardData() {
  return callCloudFunction('getDashboardData')
}
