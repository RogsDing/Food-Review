// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 【已修改】phrase 类型字段：只允许纯汉字，最长 5 个字符
function safePhrase(val) {
  if (!val) return '无'
  // 正则：只保留中文字符
  const cleaned = String(val).replace(/[^\u4e00-\u9fa5]/g, '')
  // 微信要求 phrase 必须在 5 个汉字以内
  return cleaned.slice(0, 5) || '无'
}

// thing 类型字段：最长 20 字符，超出截断
function safeThing(val) {
  if (!val) return ''
  return String(val).slice(0, 20)
}

// time 类型字段：格式 YYYY-MM-DD HH:MM:SS
function safeTime(val) {
  if (!val) {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const h = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const s = String(now.getSeconds()).padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }
  return String(val)
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    // 构建消息数据
    const data = {
      // phrase 必须为 5 个以内纯汉字
      phrase1: { value: safePhrase('已点评') }, 
      thing2: { value: safeThing(event.thing2 || '评价成功') },
      thing5: { value: safeThing(event.thing5 || '用户') }, // 使用前端传递的用户名
      time6: { value: safeTime() }, // 使用当前时间
      thing7: { value: safeThing(event.thing7 || '用户') }
    }
    
    console.log('构建的消息数据:', JSON.stringify(data))

    // 发送订阅消息
    const result = await cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      templateId: 'mPBTma8iiO0plnhED029wfU2t2uxx151nGel5YoP80A',
      page: '/pages/index/index',
      data: data
    })

    console.log('subscribeMessage.send result:', JSON.stringify(result))

    return {
      success: true,
      result: result
    }
  } catch (err) {
    console.error('subscribeMessage.send error:', JSON.stringify(err))
    return {
      success: false,
      error: err.message || JSON.stringify(err)
    }
  }
}