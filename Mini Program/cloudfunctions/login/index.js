const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

async function ensureCollectionExists(collectionName) {
  try {
    await db.collection(collectionName).count()
    console.log('[login] 集合 ' + collectionName + ' 已存在')
    return true
  } catch (e) {
    if (e.errCode === -502005 || e.message && e.message.includes('not exists')) {
      console.log('[login] 集合 ' + collectionName + ' 不存在，尝试创建...')
      try {
        const adminDb = cloud.database({
          env: cloud.DYNAMIC_CURRENT_ENV
        })
        
        await adminDb.createCollection(collectionName)
        console.log('[login] 集合 ' + collectionName + ' 创建成功')
        
        const collection = db.collection(collectionName)
        await collection.add({
          data: {
            _init: true,
            createTime: new Date().toISOString()
          }
        })
        
        await collection.where({ _init: true }).remove()
        console.log('[login] 集合 ' + collectionName + ' 初始化完成')
        return true
      } catch (createErr) {
        console.error('[login] 创建集合失败:', createErr)
        throw createErr
      }
    }
    throw e
  }
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const userInfo = event.userInfo || {}

    userInfo.openId = wxContext.OPENID

    const nickName = userInfo.nickName || ''
    const avatarUrl = userInfo.avatarUrl || ''
    
    console.log('[login] OPENID=' + wxContext.OPENID + ', nickName=' + nickName + ', avatarUrl=' + (avatarUrl ? avatarUrl.substring(0, 30) + '...' : '(空)'))

    await ensureCollectionExists('users')

    let existUser = { data: [] }
    try {
      existUser = await db.collection('users')
        .where({ openId: wxContext.OPENID })
        .get()
      console.log('[login] 查询现有用户结果数: ' + (existUser.data ? existUser.data.length : 0))
    } catch (e) {
      console.log('[login] 查询用户失败，将创建新用户:', e.message)
    }

    if (existUser.data && existUser.data.length > 0) {
      const updateData = {
        updateTime: new Date().toISOString()
      }
      if (nickName) updateData.nickName = nickName
      if (avatarUrl) updateData.avatarUrl = avatarUrl
      
      console.log('[login] 更新现有用户, updateData=', JSON.stringify(updateData))

      await db.collection('users')
        .where({ openId: wxContext.OPENID })
        .update({ data: updateData })

      const existing = existUser.data[0]
      const result = {
        success: true,
        userInfo: {
          openId: wxContext.OPENID,
          nickName: nickName || existing.nickName || '微信用户',
          avatarUrl: avatarUrl || existing.avatarUrl || '',
          signature: userInfo.signature || existing.signature || ''
        }
      }
      console.log('[login] 返回 userInfo=', JSON.stringify(result.userInfo))
      return result
    } else {
      const finalNickName = nickName || '微信用户_' + wxContext.OPENID.slice(-6)
      console.log('[login] 创建新用户, nickName=' + finalNickName + ', avatarUrl=' + avatarUrl)
      
      let retryCount = 0
      const maxRetries = 3
      
      while (retryCount < maxRetries) {
        try {
          await db.collection('users')
            .add({
              data: {
                openId: wxContext.OPENID,
                nickName: finalNickName,
                avatarUrl: avatarUrl,
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString()
              }
            })
          
          console.log('[login] 新用户创建成功')
          break
        } catch (addError) {
          retryCount++
          console.error('[login] 添加用户失败 (第' + retryCount + '次):', addError.message)
          
          if (retryCount >= maxRetries) {
            throw addError
          }
          
          if (addError.errCode === -502005 || addError.message && addError.message.includes('not exists')) {
            console.log('[login] 重试前再次确保集合存在...')
            await ensureCollectionExists('users')
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        }
      }

      const result = {
        success: true,
        userInfo: {
          openId: wxContext.OPENID,
          nickName: finalNickName,
          avatarUrl: avatarUrl
        }
      }
      console.log('[login] 返回 userInfo=', JSON.stringify(result.userInfo))
      return result
    }
  } catch (err) {
    console.error('login error:', err)
    return {
      success: false,
      error: err.message
    }
  }
}