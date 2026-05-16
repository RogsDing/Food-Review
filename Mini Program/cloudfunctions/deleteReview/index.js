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
    const { reviewId } = event
    
    if (!reviewId) {
      return {
        success: false,
        error: '缺少reviewId参数'
      }
    }
    
    // 验证点评是否存在且属于当前用户
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
        error: '无权删除此点评'
      }
    }
    
    // 删除点评
    await db.collection('reviews').doc(reviewId).remove()
    
    return {
      success: true
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err.message
    }
  }
}