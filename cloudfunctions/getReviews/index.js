// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 构建查询条件
    let query = db.collection('reviews')
    
    // 按地区筛选
    if (event.city) {
      query = query.where({ city: event.city })
    }
    
    // 按分类筛选
    if (event.category) {
      query = query.where({ category: event.category })
    }
    
    // 按关键词搜索
    if (event.keyword) {
      query = query.where(_.or([
        {
          shopName: db.RegExp({
            regexp: event.keyword,
            options: 'i'
          })
        },
        {
          content: db.RegExp({
            regexp: event.keyword,
            options: 'i'
          })
        }
      ]))
    }
    
    // 按用户筛选（我的点评）
    if (event.type === 'my') {
      query = query.where({ openId: wxContext.OPENID })
    }
    
    // 排序
    if (event.sortBy) {
      const sortOrder = event.sortOrder === 'desc' ? 'desc' : 'asc'
      query = query.orderBy(event.sortBy, sortOrder)
    } else {
      // 默认按创建时间倒序
      query = query.orderBy('createTime', 'desc')
    }
    
    // 执行查询
    const result = await query.get()
    const reviews = result.data
    
    // 为每条点评关联查询发布用户的头像和昵称
    const enrichedReviews = await enrichReviewsWithAuthor(reviews)
    
    return enrichedReviews
  } catch (err) {
    console.error(err)
    return []
  }
}

async function enrichReviewsWithAuthor(reviews) {
  if (!reviews || reviews.length === 0) return reviews

  const openIds = [...new Set(reviews.map(r => r.openId).filter(Boolean))]
  console.log('[getReviews] 共 ' + reviews.length + ' 条点评，唯一 openId 数: ' + openIds.length, JSON.stringify(openIds))
  
  if (openIds.length === 0) {
    console.log('[getReviews] 没有有效的 openId，跳过用户信息查询')
    return reviews
  }

  const userMap = {}
  try {
    const userQueries = openIds.map(openId =>
      db.collection('users').where({ openId: openId }).get()
        .then(res => res.data && res.data[0] ? res.data[0] : null)
        .catch(e => {
          console.log('[getReviews] 查询用户 ' + openId + ' 失败:', e.message)
          return null
        })
    )
    
    const users = await Promise.all(userQueries)
    
    console.log('[getReviews] users 查询结果数: ' + users.filter(Boolean).length)
    users.forEach(user => {
      if (user) {
        userMap[user.openId] = {
          avatarUrl: user.avatarUrl || '',
          nickName: user.nickName || '微信用户'
        }
        console.log('[getReviews] 用户: openId=' + user.openId + ', nickName=' + user.nickName + ', avatarUrl=' + (user.avatarUrl ? user.avatarUrl.substring(0, 30) + '...' : '(空)'))
      }
    })
  } catch (e) {
    console.log('[getReviews] 查询用户信息失败:', e.message, e.stack)
  }

  // 诊断：列出 users 集合中所有记录
  try {
    const allUsers = await db.collection('users').limit(100).get()
    console.log('[getReviews] users 集合总数: ' + allUsers.data.length)
    if (allUsers.data.length > 0) {
      allUsers.data.forEach((u, i) => {
        console.log('[getReviews] users[' + i + ']: openId=' + u.openId + ', nickName=' + u.nickName)
      })
    } else {
      console.log('[getReviews] ⚠️ users 集合为空，没有任何用户记录！')
      console.log('[getReviews] ⚠️ 请确认 login 云函数已部署并正常工作')
    }
  } catch (e) {
    console.log('[getReviews] 查询所有用户失败，集合可能不存在:', e.message)
  }

  if (Object.keys(userMap).length === 0) {
    console.log('[getReviews] userMap 为空，所有点评将使用默认头像和昵称')
    console.log('[getReviews] 需要匹配的 openId:', JSON.stringify(openIds))
  }

  return reviews.map(review => {
    // 优先使用 users 集合中的最新信息，其次使用 review 自身存储的 author，最后用默认值
    const dbAuthor = userMap[review.openId]
    const storedAuthor = review.author
    const fallbackAuthor = { avatarUrl: '', nickName: '微信用户' }
    
    const author = dbAuthor || storedAuthor || fallbackAuthor
    
    return {
      ...review,
      author: author
    }
  })
}