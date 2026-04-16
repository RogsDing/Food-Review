// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { phrase1, thing2, thing5, time6, thing7 } = event
    
    // 发送订阅消息
    const result = await cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      templateId: 'mPBTma8iiO0plnhED029wfU2t2uxx151nGel5YoP80A',
      page: '/pages/index/index',
      data: {
        phrase1: {
          value: phrase1
        },
        thing2: {
          value: thing2
        },
        thing5: {
          value: thing5
        },
        time6: {
          value: time6
        },
        thing7: {
          value: thing7
        }
      }
    })
    
    return {
      success: true,
      result: result
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err.message
    }
  }
}