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
    const { reviewId, ...updateData } = event
    
    // 检查点评是否存在且是否属于当前用户
    const review = await db.collection('reviews').doc(reviewId).get()
    if (!review.data) {
      return {
        success: false,
        error: '点评不存在'
      }
    }
    
    if (review.data.openId !== wxContext.OPENID) {
      return {
        success: false,
        error: '无权限编辑此点评'
      }
    }
    
    // 构建更新数据
    const updateFields = {
      shopName: updateData.shopName,
      area: updateData.area,
      city: updateData.city,
      diningTime: updateData.diningTime,
      rating: updateData.rating,
      content: updateData.content,
      imageFileIDs: updateData.imageFileIDs || [],
      updateTime: new Date().toISOString(),
      expense: updateData.expense,
      people: updateData.people,
      category: updateData.category
    }
    
    // 更新数据到数据库
    const result = await db.collection('reviews').doc(reviewId).update({
      data: updateFields
    })
    
    return {
      success: true,
      updated: result.updated
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}