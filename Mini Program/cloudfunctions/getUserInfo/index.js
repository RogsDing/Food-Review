const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 查询用户信息
    const result = await db.collection('users')
      .where({ openId: wxContext.OPENID })
      .get()
    
    if (result.data && result.data.length > 0) {
      return {
        success: true,
        userInfo: result.data[0]
      }
    } else {
      return {
        success: false,
        userInfo: null
      }
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err.message
    }
  }
}