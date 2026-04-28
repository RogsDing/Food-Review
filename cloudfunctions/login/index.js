// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  console.log('云函数接收到的事件:', event)
  
  try {
    const userInfo = event.userInfo || {
      openId: wxContext.OPENID,
      appId: wxContext.APPID,
      unionId: wxContext.UNIONID
    }
    
    userInfo.openId = wxContext.OPENID
    
    console.log('用户信息:', userInfo)
    
    // 查询是否已存在用户信息
    console.log('开始查询用户:', wxContext.OPENID)
    const existUser = await db.collection('users')
      .where({ openId: wxContext.OPENID })
      .get()
    
    console.log('查询用户结果:', existUser)
    
    if (existUser.data && existUser.data.length > 0) {
      // 用户已存在，更新用户信息
      console.log('开始更新用户信息')
      await db.collection('users')
        .where({ openId: wxContext.OPENID })
        .update({
          data: {
            nickName: userInfo.nickName || '',
            avatarUrl: userInfo.avatarUrl || '',
            signature: userInfo.signature || '',
            updateTime: new Date().toISOString()
          }
        })
    } else {
      // 首次登录，创建用户信息
      console.log('开始创建新用户')
      await db.collection('users')
        .add({
          data: {
            openId: wxContext.OPENID,
            nickName: userInfo.nickName || '',
            avatarUrl: userInfo.avatarUrl || '',
            signature: userInfo.signature || '',
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          }
        })
    }
    
    // 返回完整的用户信息
    const result = {
      success: true,
      userInfo: userInfo
    }
    
    console.log('返回结果:', result)
    
    return result
  } catch (err) {
    console.error('错误:', err)
    return {
      success: false,
      error: err.message
    }
  }
}