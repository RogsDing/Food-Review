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
    // 构建点评数据
    const reviewData = {
      shopName: event.shopName,
      area: event.area,
      diningTime: event.diningTime,
      rating: event.rating,
      content: event.content,
      imageFileIDs: event.imageFileIDs || [],
      createTime: event.createTime || new Date().toISOString(),
      openId: wxContext.OPENID
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