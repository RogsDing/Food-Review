const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  console.log('云函数接收到的事件:', event)
  
  try {
    const userInfo = event.userInfo
    
    console.log('用户信息:', userInfo)
    
    // 验证用户信息
    if (!userInfo) {
      console.error('用户信息为空')
      return {
        success: false,
        error: '用户信息为空'
      }
    }
    
    // 确保用户信息包含必要字段
    const userData = {
      nickName: userInfo.nickName || '',
      avatarUrl: userInfo.avatarUrl || '',
      signature: userInfo.signature || '',
      updateTime: new Date().toISOString()
    }
    
    console.log('处理后的用户数据:', userData)
    
    // 查询是否已存在用户信息
    console.log('开始查询用户:', wxContext.OPENID)
    const existUser = await db.collection('users')
      .where({ openId: wxContext.OPENID })
      .get()
    
    console.log('查询用户结果:', existUser)
    
    if (existUser.data && existUser.data.length > 0) {
      // 更新已有用户信息
      console.log('开始更新用户信息')
      const updateResult = await db.collection('users')
        .where({ openId: wxContext.OPENID })
        .update({
          data: userData
        })
      
      console.log('更新用户结果:', updateResult)
    } else {
      // 创建新用户信息
      console.log('开始创建新用户')
      const addResult = await db.collection('users')
        .add({
          data: {
            openId: wxContext.OPENID,
            ...userData,
            createTime: new Date().toISOString()
          }
        })
      
      console.log('添加用户结果:', addResult)
    }
    
    const result = {
      success: true,
      userInfo: {
        ...userInfo,
        openId: wxContext.OPENID
      }
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