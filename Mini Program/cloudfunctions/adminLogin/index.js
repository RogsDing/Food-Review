const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { username, password } = event

  if (!username || !password) {
    return { success: false, message: '请输入账号和密码' }
  }

  try {
    const res = await db.collection('admins').where({ username }).get()

    if (res.data.length === 0) {
      return { success: false, message: '账号不存在' }
    }

    const admin = res.data[0]

    if (admin.status === 'disabled') {
      return { success: false, message: '账号已被禁用' }
    }

    if (admin.password !== password) {
      return { success: false, message: '密码错误' }
    }

    const token = 'admin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)

    await db.collection('admins').doc(admin._id).update({
      data: {
        lastLoginTime: db.serverDate(),
        token: token
      }
    })

    return {
      success: true,
      token,
      username: admin.username,
      role: admin.role || 'admin'
    }
  } catch (err) {
    return { success: false, message: '登录失败：' + err.message }
  }
}
