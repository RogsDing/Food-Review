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
      return null
    }
    
    // 查询点评详情
    const result = await db.collection('reviews').doc(reviewId).get()
    
    return result.data
  } catch (err) {
    console.error(err)
    return null
  }
}