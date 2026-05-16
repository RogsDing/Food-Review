const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const { commentId } = event

    if (!commentId) {
      return { success: false, error: '缺少评论ID' }
    }

    const result = await db.collection('comments').doc(commentId).get()
    const comment = result.data

    if (!comment) {
      return { success: false, error: '评论不存在' }
    }

    if (comment.openId !== wxContext.OPENID) {
      return { success: false, error: '无权限删除此评论' }
    }

    await db.collection('comments').doc(commentId).remove()

    console.log('[deleteComment] 删除成功, commentId=', commentId)

    return {
      success: true
    }
  } catch (err) {
    console.error('[deleteComment] 错误:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
