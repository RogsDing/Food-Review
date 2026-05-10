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
        console.log('查询用户信息失败:', e.message)
      }
    }
    
    if (!author) {
      author = { nickName: '微信用户', avatarUrl: '' }
    }

    // 构建点评数据
    const reviewData = {
      shopName: event.shopName,
      area: event.area,
      city: event.city,
      diningTime: event.diningTime,
      rating: event.rating,
      content: event.content,
      imageFileIDs: event.imageFileIDs || [],
      createTime: event.createTime || new Date().toISOString(),
      openId: wxContext.OPENID,
      expense: event.expense,
      people: event.people,
      category: event.category,
      author: author
    }
    
    // 插入数据到数据库
    const result = await db.collection('reviews').add({
      data: reviewData
    })
    
    return {
      success: true,
      reviewId: result._id
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}