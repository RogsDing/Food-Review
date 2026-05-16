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

  const { page = 1, pageSize = 20, status = '' } = event
  const skip = (page - 1) * pageSize

  try {
    let query = {}
    if (status) {
      query = { status }
    }

    const [countRes, dataRes] = await Promise.all([
      db.collection('feedback').where(query).count(),
      db.collection('feedback').where(query)
        .orderBy('createTime', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get()
    ])

    return {
      success: true,
      data: { list: dataRes.data, total: countRes.total, page, pageSize }
    }
  } catch (err) {
    return { success: false, message: '查询失败：' + err.message }
  }
}
