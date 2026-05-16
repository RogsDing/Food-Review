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
      return null
    }

    const result = await db.collection('reviews').doc(reviewId).get()
    const review = result.data

    if (!review) {
      return null
    }

    const currentOpenId = wxContext.OPENID
    review.isAuthor = !!(review.openId && review.openId === currentOpenId)

    console.log('[getReview] review.openId=' + (review.openId || '(空)') + ', 当前用户OPENID=' + currentOpenId + ', isAuthor=' + review.isAuthor)

    if (review.openId) {
      let dbAuthor = null
      try {
        const userResult = await db.collection('users').where({ openId: review.openId }).get()
        if (userResult.data.length > 0) {
          const user = userResult.data[0]
          dbAuthor = { nickName: user.nickName || '微信用户', avatarUrl: user.avatarUrl || '' }
        }
      } catch (e) {
        console.log('查询用户信息失败:', e.message)
      }

      const storedAuthor = review.author
      const fallbackAuthor = { nickName: '微信用户', avatarUrl: '' }
      review.author = dbAuthor || storedAuthor || fallbackAuthor
    }

    return review
  } catch (err) {
    console.error(err)
    return null
  }
}
