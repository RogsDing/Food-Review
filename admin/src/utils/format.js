export function formatTime(timeStr) {
  if (!timeStr) return '-'
  const date = new Date(timeStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

export function formatDate(timeStr) {
  if (!timeStr) return '-'
  const date = new Date(timeStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function truncate(str, len = 50) {
  if (!str) return '-'
  return str.length > len ? str.substring(0, len) + '...' : str
}

export function ratingText(rating) {
  if (rating === undefined || rating === null) return '-'
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}

export function difficultyText(level) {
  const map = { 1: '简单', 2: '较简单', 3: '中等', 4: '较难', 5: '困难' }
  return map[level] || '-'
}

export function feedbackStatusText(status) {
  const map = { pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭' }
  return map[status] || '待处理'
}

export function feedbackStatusType(status) {
  const map = { pending: 'warning', processing: 'primary', resolved: 'success', closed: 'info' }
  return map[status] || 'warning'
}
