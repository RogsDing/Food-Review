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
    // 查询当前用户的点评数量
    const result = await db.collection('reviews')
      .where({ openId: wxContext.OPENID })
      .count()
    
    return {
      success: true,
      count: result.total
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      count: 0
    }
  }
}