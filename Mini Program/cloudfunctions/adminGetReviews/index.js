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

  const { page = 1, pageSize = 20, keyword = '', category = '', city = '', sortField = 'createTime', sortOrder = 'desc' } = event
  const skip = (page - 1) * pageSize

  try {
    let query = {}
    const conditions = []

    if (keyword) {
      conditions.push(_.or([
        { shopName: db.RegExp({ regexp: keyword, options: 'i' }) },
        { content: db.RegExp({ regexp: keyword, options: 'i' }) }
      ]))
    }
    if (category) {
      conditions.push({ category })
    }
    if (city) {
      conditions.push({ city: db.RegExp({ regexp: city, options: 'i' }) }
      )
    }

    if (conditions.length > 0) {
      query = _.and(conditions)
    }

    const [countRes, dataRes] = await Promise.all([
      db.collection('reviews').where(query).count(),
      db.collection('reviews').where(query)
        .orderBy(sortField, sortOrder)
        .skip(skip)
        .limit(pageSize)
        .get()
    ])

    return {
      success: true,
      data: {
        list: dataRes.data,
        total: countRes.total,
        page,
        pageSize
      }
    }
  } catch (err) {
    return { success: false, message: '查询失败：' + err.message }
  }
}
