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

  if (!id) return { success: false, message: '缺少菜谱ID' }

  try {
    await db.collection('recipes').doc(id).remove()
    return { success: true, message: '删除成功' }
  } catch (err) {
    return { success: false, message: '删除失败：' + err.message }
  }
}
