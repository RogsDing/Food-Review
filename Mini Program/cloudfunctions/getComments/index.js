const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const { reviewId } = event

    if (!reviewId) {
      return { success: false, comments: [], count: 0 }
    }

    const result = await db.collection('comments')
      .where({ reviewId: reviewId })
      .orderBy('createTime', 'asc')
      .get()

    let comments = result.data || []
    const currentOpenId = wxContext.OPENID

    const openIds = [...new Set(comments.map(c => c.openId).filter(Boolean))]
    let userMap = {}

    if (openIds.length > 0) {
      try {
        const userResult = await db.collection('users')
          .where({ openId: db.command.in(openIds) })
          .get()
        userResult.data.forEach(user => {
          userMap[user.openId] = {
            nickName: user.nickName || '微信用户',
            avatarUrl: user.avatarUrl || ''
          }
        })
      } catch (e) {
        console.log('[getComments] 批量查询用户信息失败:', e.message)
      }
    }

    comments = comments.map(comment => {
      comment.isAuthor = !!(comment.openId && comment.openId === currentOpenId)

      if (comment.openId && userMap[comment.openId]) {
        comment.author = userMap[comment.openId]
      }

      if (!comment.author || !comment.author.nickName) {
        comment.author = comment.author || { nickName: '微信用户', avatarUrl: '' }
      }

      return comment
    })

    console.log('[getComments] 查询成功, reviewId=', reviewId, ', count=', comments.length)

    return {
      success: true,
      comments: comments,
      count: comments.length
    }
  } catch (err) {
    console.error('[getComments] 错误:', err)
    return {
      success: false,
      comments: [],
      count: 0,
      error: err.message
    }
  }
}
