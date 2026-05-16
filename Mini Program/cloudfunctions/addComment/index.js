const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    if (!event.reviewId) {
      return { success: false, error: '缺少关联的点评ID' }
    }

    if (!event.content || typeof event.content !== 'string' || event.content.trim() === '') {
      return { success: false, error: '评论内容不能为空' }
    }

    const content = event.content.trim()
    if (content.length > 200) {
      return { success: false, error: '评论内容不能超过200字' }
    }

    let author = event.author || null
    if (!author || !author.nickName) {
      try {
        const userResult = await db.collection('users')
          .where({ openId: wxContext.OPENID })
          .get()
        if (userResult.data && userResult.data.length > 0) {
          const user = userResult.data[0]
          author = {
            nickName: user.nickName || '微信用户',
            avatarUrl: user.avatarUrl || ''
          }
        }
      } catch (e) {
        console.log('[addComment] 查询用户信息失败:', e.message)
      }
    }

    if (!author) {
      author = { nickName: '微信用户', avatarUrl: '' }
    }

    const commentData = {
      reviewId: event.reviewId,
      content: content,
      openId: wxContext.OPENID,
      author: author,
      createTime: new Date().toISOString()
    }

    console.log('[addComment] 准备插入数据:', JSON.stringify(commentData))

    const result = await db.collection('comments').add({
      data: commentData
    })

    console.log('[addComment] 插入成功, commentId=', result._id)

    return {
      success: true,
      commentId: result._id
    }
  } catch (err) {
    console.error('[addComment] 错误:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
