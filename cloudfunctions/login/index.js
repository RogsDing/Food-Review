// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 获取用户信息
    const userInfo = event.userInfo || {
      openId: wxContext.OPENID,
      appId: wxContext.APPID,
      unionId: wxContext.UNIONID
    }
    
    // 可以在这里添加用户数据到数据库的逻辑
    // const db = cloud.database()
    // await db.collection('users').update({
    //   data: userInfo,
    //   where: { openId: userInfo.openId }
    // })
    
    return {
      success: true,
      userInfo: userInfo
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}