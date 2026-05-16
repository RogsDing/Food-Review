const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

async function verifyAdmin(token) {
  if (!token) return false
  const res = await db.collection('admins').where({ token }).get()
  return res.data.length > 0
}

exports.main = async (event) => {
  const { adminToken } = event
  if (!(await verifyAdmin(adminToken))) {
    return { success: false, message: '未授权' }
  }

  const { id, ids, batch } = event

  try {
    if (batch && ids && ids.length > 0) {
      const tasks = ids.map(reviewId =>
        db.collection('reviews').doc(reviewId).remove()
      )
      await Promise.all(tasks)
      return { success: true, message: `已批量删除 ${ids.length} 条点评` }
    }

    if (id) {
      await db.collection('reviews').doc(id).remove()
      return { success: true, message: '删除成功' }
    }

    return { success: false, message: '缺少点评ID' }
  } catch (err) {
    return { success: false, message: '删除失败：' + err.message }
  }
}
