const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const { shopName } = event
    const openId = wxContext.OPENID

    if (!shopName || typeof shopName !== 'string' || shopName.trim() === '') {
      return { success: false, exists: false, count: 0, reviews: [] }
    }

    const trimmedShopName = shopName.trim()

    const result = await db.collection('reviews')
      .where({
        openId: openId,
        shopName: trimmedShopName
      })
      .orderBy('createTime', 'desc')
      .get()

    const reviews = result.data || []
    const count = reviews.length

    console.log('[checkShopHistory] shopName=', trimmedShopName, ', openId=', openId, ', count=', count)

    return {
      success: true,
      exists: count > 0,
      count: count,
      reviews: reviews.map(r => ({
        _id: r._id,
        rating: r.rating,
        content: r.content ? r.content.substring(0, 50) + (r.content.length > 50 ? '...' : '') : '',
        diningTime: r.diningTime,
        createTime: r.createTime,
        visitCount: r.visitCount || 1,
        expense: r.expense || null,
        people: r.people || null,
        category: r.category || '',
        imageFileIDs: r.imageFileIDs || []
      }))
    }
  } catch (err) {
    console.error('[checkShopHistory] 错误:', err)
    return {
      success: false,
      exists: false,
      count: 0,
      reviews: [],
      error: err.message
    }
  }
}
