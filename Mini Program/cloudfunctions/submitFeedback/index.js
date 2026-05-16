const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    if (!event.content || event.content.trim() === '') {
      return {
        success: false,
        error: '反馈内容不能为空'
      }
    }

    const feedbackData = {
      content: event.content.trim(),
      userInfo: event.userInfo || {},
      openId: wxContext.OPENID,
      createTime: new Date().toISOString(),
      status: 'pending',
      read: false
    }

    console.log('[submitFeedback] 准备插入反馈数据:', JSON.stringify(feedbackData))

    const result = await db.collection('feedback').add({
      data: feedbackData
    })

    console.log('[submitFeedback] 反馈插入成功, feedbackId=', result._id)

    return {
      success: true,
      feedbackId: result._id
    }
  } catch (err) {
    console.error('[submitFeedback] 错误:', err)
    return {
      success: false,
      error: err.message
    }
  }
}