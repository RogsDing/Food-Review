const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

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

  const { page = 1, pageSize = 20, keyword = '', reviewId = '' } = event
  const skip = (page - 1) * pageSize

  try {
    let query = {}
    const conditions = []

    if (keyword) {
      conditions.push({ content: db.RegExp({ regexp: keyword, options: 'i' }) })
    }
    if (reviewId) {
      conditions.push({ reviewId })
    }

    if (conditions.length > 0) {
      query = _.and(conditions)
    }

    const [countRes, dataRes] = await Promise.all([
      db.collection('comments').where(query).count(),
      db.collection('comments').where(query)
        .orderBy('createTime', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get()
    ])

    const reviewIds = [...new Set(dataRes.data.map(c => c.reviewId).filter(Boolean))]
    const reviewMap = {}
    if (reviewIds.length > 0) {
      const reviewsRes = await db.collection('reviews')
        .where({ _id: _.in(reviewIds) })
        .field({ shopName: true })
        .get()
      reviewsRes.data.forEach(r => { reviewMap[r._id] = r.shopName })
    }

    const list = dataRes.data.map(c => ({
      ...c,
      shopName: reviewMap[c.reviewId] || '未知店铺'
    }))

    return {
      success: true,
      data: { list, total: countRes.total, page, pageSize }
    }
  } catch (err) {
    return { success: false, message: '查询失败：' + err.message }
  }
}
