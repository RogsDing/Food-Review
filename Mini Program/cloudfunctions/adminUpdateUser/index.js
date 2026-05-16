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

  if (!id) return { success: false, message: '缺少用户ID' }

  const { nickName, status } = event

  try {
    const updateData = { updateTime: db.serverDate() }
    if (nickName !== undefined) updateData.nickName = nickName
    if (status !== undefined) updateData.status = status

    await db.collection('users').doc(id).update({ data: updateData })
    return { success: true, message: '更新成功' }
  } catch (err) {
    return { success: false, message: '更新失败：' + err.message }
  }
}
