const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

async function ensureCollectionExists(collectionName) {
  try {
    await db.collection(collectionName).count()
    return true
  } catch (e) {
    if (e.errCode === -502005 || e.message && e.message.includes('not exists')) {
      try {
        await db.createCollection(collectionName)
        return true
      } catch (createErr) {
        console.error('[getMessages] 创建集合失败:', createErr)
        throw createErr
      }
    }
    throw e
  }
}

function formatTime(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const { page = 1, pageSize = 20, openId = '' } = event
    const skip = (page - 1) * pageSize

    await ensureCollectionExists('messages')

    const countResult = await db.collection('messages').count()
    const total = countResult.total

    const messagesRes = await db.collection('messages')
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    const messages = (messagesRes.data || []).map(item => {
      const canDelete = openId && item.userInfo && item.userInfo.openId === openId
      return {
        ...item,
        timeStr: formatTime(item.createTime),
        canDelete: canDelete
      }
    })

    return {
      success: true,
      messages: messages,
      total: total,
      page: page,
      pageSize: pageSize
    }
  } catch (err) {
    console.error('[getMessages] 云函数错误:', err)
    return {
      success: false,
      error: err.message || '获取留言失败'
    }
  }
}