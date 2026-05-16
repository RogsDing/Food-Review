const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const userInfo = event.userInfo || {}
    userInfo.openId = wxContext.OPENID

    const nickName = userInfo.nickName || ''
    const avatarUrl = userInfo.avatarUrl || ''

    // 查询是否已存在用户
    let existUser = { data: [] }
    try {
      existUser = await db.collection('users')
        .where({ openId: wxContext.OPENID })
        .get()
    } catch (e) {
      console.log('查询用户失败，将创建新用户:', e.message)
    }

    if (existUser.data && existUser.data.length > 0) {
      // 用户已存在，只更新有值的字段
      const updateData = {
        updateTime: new Date().toISOString()
      }
      if (nickName) updateData.nickName = nickName
      if (avatarUrl) updateData.avatarUrl = avatarUrl

      await db.collection('users')
        .where({ openId: wxContext.OPENID })
        .update({ data: updateData })

      // 返回合并后的最新数据
      const existing = existUser.data[0]
      return {
        success: true,
        userInfo: {
          openId: wxContext.OPENID,
          nickName: nickName || existing.nickName || '微信用户',
          avatarUrl: avatarUrl || existing.avatarUrl || ''
        }
      }
    } else {
      // 用户不存在，创建新用户
      const finalNickName = nickName || '微信用户_' + wxContext.OPENID.slice(-6)
      await db.collection('users')
        .add({
          data: {
            openId: wxContext.OPENID,
            nickName: finalNickName,
            avatarUrl: avatarUrl,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          }
        })

      return {
        success: true,
        userInfo: {
          openId: wxContext.OPENID,
          nickName: finalNickName,
          avatarUrl: avatarUrl
        }
      }
    }
  } catch (err) {
    console.error('updateUserInfo error:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
