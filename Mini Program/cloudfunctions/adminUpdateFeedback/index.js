const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

async function verifyAdmin(token) {
  if (!token) return false
  const res = await db.collection('admins').where({ token }).get()
  return res.data.length > 0
}

exports.main = async (event) => {
  const { adminToken, id } = event
  if (!(await verifyAdmin(adminToken))) {
    return { success: false, message: '未授权' }
  }

  if (!id) return { success: false, message: '缺少反馈ID' }

  const { status, read } = event

  try {
    const updateData = {}
    if (status !== undefined) updateData.status = status
    if (read !== undefined) updateData.read = read

    await db.collection('feedback').doc(id).update({ data: updateData })
    return { success: true, message: '更新成功' }
  } catch (err) {
    return { success: false, message: '更新失败：' + err.message }
  }
}
