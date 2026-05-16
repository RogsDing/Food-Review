const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const { messageId } = event

    if (!messageId) {
      return {
        success: false,
        error: '留言ID不能为空'
      }
    }

    const messageRes = await db.collection('messages').doc(messageId).get()

    if (!messageRes.data) {
      return {
        success: false,
        error: '留言不存在'
      }
    }

    const message = messageRes.data
    const openId = wxContext.OPENID

    if (message.userInfo && message.userInfo.openId && message.userInfo.openId !== openId) {
      return {
        success: false,
        error: '无权删除此留言'
      }
    }

    await db.collection('messages').doc(messageId).remove()

    return {
      success: true
    }
  } catch (err) {
    console.error('[deleteMessage] 云函数错误:', err)
    return {
      success: false,
      error: err.message || '删除留言失败'
    }
  }
}