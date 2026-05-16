const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

async function safeCount(collectionName, query) {
  try {
    if (query) {
      return (await db.collection(collectionName).where(query).count()).total
    }
    return (await db.collection(collectionName).count()).total
  } catch (e) {
    return 0
  }
}

async function safeGet(collectionName, options = {}) {
  try {
    let query = db.collection(collectionName)
    if (options.where) query = query.where(options.where)
    if (options.orderBy) query = query.orderBy(options.orderBy, options.order || 'desc')
    if (options.limit) query = query.limit(options.limit)
    return await query.get()
  } catch (e) {
    return { data: [] }
  }
}

exports.main = async (event) => {
  const { adminToken } = event

  if (!adminToken) {
    return { success: false, message: '未授权' }
  }

  try {
    const adminRes = await db.collection('admins').where({ token: adminToken }).get()
    if (adminRes.data.length === 0) {
      return { success: false, message: '未授权' }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()

    const [
      usersCount,
      reviewsCount,
      commentsCount,
      recipesCount,
      messagesCount,
      feedbackCount,
      todayUsers,
      todayReviews
    ] = await Promise.all([
      safeCount('users'),
      safeCount('reviews'),
      safeCount('comments'),
      safeCount('recipes'),
      safeCount('messages'),
      safeCount('feedback'),
      safeCount('users', { createTime: _.gte(todayStr) }),
      safeCount('reviews', { createTime: _.gte(todayStr) })
    ])

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString()

    const recentReviews = await safeGet('reviews', {
      where: { createTime: _.gte(sevenDaysAgoStr) },
      orderBy: 'createTime',
      limit: 100
    })

    const trendMap = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      trendMap[key] = 0
    }

    recentReviews.data.forEach(review => {
      if (review.createTime) {
        const date = new Date(review.createTime)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        if (trendMap[key] !== undefined) {
          trendMap[key]++
        }
      }
    })

    const trendDates = Object.keys(trendMap)
    const trendValues = Object.values(trendMap)

    const categoryRes = await safeGet('reviews', { limit: 1000 })
    const categoryMap = {}
    categoryRes.data.forEach(review => {
      const cat = review.category || '其他'
      categoryMap[cat] = (categoryMap[cat] || 0) + 1
    })

    const recentActivities = await safeGet('reviews', { orderBy: 'createTime', limit: 5 })
    const recentComments = await safeGet('comments', { orderBy: 'createTime', limit: 5 })

    const activities = [
      ...recentActivities.data.map(r => ({
        type: 'review',
        content: r.shopName || '未知店铺',
        author: r.author?.nickName || '匿名',
        time: r.createTime
      })),
      ...recentComments.data.map(c => ({
        type: 'comment',
        content: c.content ? c.content.substring(0, 30) : '',
        author: c.author?.nickName || '匿名',
        time: c.createTime
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10)

    return {
      success: true,
      data: {
        overview: {
          users: usersCount,
          reviews: reviewsCount,
          comments: commentsCount,
          recipes: recipesCount,
          messages: messagesCount,
          feedback: feedbackCount,
          todayUsers: todayUsers,
          todayReviews: todayReviews
        },
        trend: {
          dates: trendDates,
          values: trendValues
        },
        categories: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
        activities
      }
    }
  } catch (err) {
    return { success: false, message: '获取数据失败：' + err.message }
  }
}
