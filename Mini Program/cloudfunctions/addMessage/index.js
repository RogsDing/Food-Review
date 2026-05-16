const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

async function ensureCollectionExists(collectionName) {
  try {
    await db.collection(collectionName).count()
    return true
  } catch (e) {
    if (e.errCode === -502005 || e.message && e.message.includes('not exists')) {
      try {
        await db.createCollection(collectionName)
        return true
      } catch (createErr) {
        console.error('[addMessage] 创建集合失败:', createErr)
        throw createErr
      }
    }
    throw e
  }
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const { content, userInfo } = event

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return {
        success: false,
        error: '留言内容不能为空'
      }
    }

    if (content.length > 500) {
      return {
        success: false,
        error: '留言内容不能超过500字'
      }
    }

    await ensureCollectionExists('messages')

    const messageData = {
      content: content.trim(),
      userInfo: {
        nickName: userInfo?.nickName || '匿名用户',
        avatarUrl: userInfo?.avatarUrl || '',
        openId: userInfo?.openId || wxContext.OPENID
      },
      createTime: db.serverDate()
    }

    const result = await db.collection('messages').add({
      data: messageData
    })

    return {
      success: true,
      messageId: result._id
    }
  } catch (err) {
    console.error('[addMessage] 云函数错误:', err)
    return {
      success: false,
      error: err.message || '添加留言失败'
    }
  }
}