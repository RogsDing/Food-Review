// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 数据验证 - 必填字段检查
    const requiredFields = ['shopName', 'area', 'city', 'content', 'category']
    for (const field of requiredFields) {
      if (!event[field] || (typeof event[field] === 'string' && event[field].trim() === '')) {
        return {
          success: false,
          error: `缺少必填字段: ${field}`
        }
      }
    }

    // 验证评分范围
    if (!event.rating || typeof event.rating !== 'number' || event.rating < 0 || event.rating > 5) {
      return {
        success: false,
        error: '评分必须在0-5之间'
      }
    }

    // 验证消费金额和人数（如果提供）
    if (event.expense && (isNaN(Number(event.expense)) || Number(event.expense) < 0)) {
      return {
        success: false,
        error: '消费金额必须是有效的正数'
      }
    }

    if (event.people && (isNaN(Number(event.people)) || Number(event.people) < 1 || !Number.isInteger(Number(event.people)))) {
      return {
        success: false,
        error: '消费人数必须是有效的正整数'
      }
    }

    // 验证图片数量限制
    if (event.imageFileIDs && Array.isArray(event.imageFileIDs) && event.imageFileIDs.length > 9) {
      return {
        success: false,
        error: '最多只能上传9张图片'
      }
    }

    // 获取作者信息：优先使用前端传入的，否则从 users 集合查询
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
        console.log('[addReview] 查询用户信息失败:', e.message)
      }
    }
    
    if (!author) {
      author = { nickName: '微信用户', avatarUrl: '' }
    }

    let visitCount = 1
    try {
      const historyResult = await db.collection('reviews')
        .where({
          openId: wxContext.OPENID,
          shopName: event.shopName.trim()
        })
        .count()
      visitCount = (historyResult.total || 0) + 1
      console.log('[addReview] 历史记录数=', historyResult.total, ', 本次visitCount=', visitCount)
    } catch (e) {
      console.log('[addReview] 查询历史记录数失败:', e.message)
    }

    // 构建点评数据
    const reviewData = {
      shopName: event.shopName.trim(),
      area: event.area.trim(),
      city: event.city.trim(),
      diningTime: event.diningTime || new Date().toISOString().split('T')[0],
      rating: Number(event.rating),
      content: event.content.trim(),
      imageFileIDs: event.imageFileIDs || [],
      createTime: event.createTime || new Date().toISOString(),
      openId: wxContext.OPENID,
      expense: event.expense ? Number(event.expense) : null,
      people: event.people ? Number(event.people) : null,
      category: event.category.trim(),
      author: author,
      visitCount: visitCount,
      updateTime: new Date().toISOString()
    }
    
    console.log('[addReview] 准备插入数据:', JSON.stringify({
      ...reviewData,
      imageFileIDs: `[${reviewData.imageFileIDs.length}张图片]`
    }))
    
    // 插入数据到数据库
    const result = await db.collection('reviews').add({
      data: reviewData
    })
    
    console.log('[addReview] 插入成功, reviewId=', result._id)
    
    return {
      success: true,
      reviewId: result._id
    }
  } catch (err) {
    console.error('[addReview] 错误:', err)
    return {
      success: false,
      error: err.message
    }
  }
}