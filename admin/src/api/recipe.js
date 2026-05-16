import { callCloudFunction } from '@/utils/request'

export function adminGetRecipes(params = {}) {
  return callCloudFunction('adminGetRecipes', params)
}

export function adminAddRecipe(data) {
  return callCloudFunction('adminAddRecipe', data)
}

export function adminUpdateRecipe(id, data) {
  return callCloudFunction('adminUpdateRecipe', { id, ...data })
}

export function adminDeleteRecipe(id) {
  return callCloudFunction('adminDeleteRecipe', { id })
}
