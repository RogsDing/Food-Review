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

  const { page = 1, pageSize = 20, keyword = '' } = event
  const skip = (page - 1) * pageSize

  try {
    let query = {}
    if (keyword) {
      query = _.or([
        { nickName: db.RegExp({ regexp: keyword, options: 'i' }) },
        { openId: db.RegExp({ regexp: keyword, options: 'i' }) }
      ])
    }

    const [countRes, dataRes] = await Promise.all([
      db.collection('users').where(query).count(),
      db.collection('users').where(query)
        .orderBy('createTime', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get()
    ])

    const openIds = dataRes.data.map(u => u.openId).filter(Boolean)
    const reviewCountMap = {}

    if (openIds.length > 0) {
      for (const openId of openIds) {
        const countRes = await db.collection('reviews').where({ openId }).count()
        reviewCountMap[openId] = countRes.total
      }
    }

    const list = dataRes.data.map(u => ({
      ...u,
      reviewCount: reviewCountMap[u.openId] || 0
    }))

    return {
      success: true,
      data: { list, total: countRes.total, page, pageSize }
    }
  } catch (err) {
    return { success: false, message: '查询失败：' + err.message }
  }
}
