import express from 'express'
import cors from 'cors'
import https from 'https'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const APPID = 'wx871ca1365be28aa7'
const APPSECRET = process.env.APP_SECRET || ''
const ENV_ID = 'cloud1-0g31aw4l8030872d'

let accessToken = ''
let tokenExpireTime = 0

function httpsGet(urlStr) {
  return new Promise((resolve, reject) => {
    https.get(urlStr, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(body)) }
        catch { resolve(body) }
      })
    }).on('error', reject)
  })
}

function httpsPost(urlStr, postData) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr)
    const data = JSON.stringify(postData)

    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000
    }, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(body)) }
        catch { resolve(body) }
      })
    })

    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
    req.write(data)
    req.end()
  })
}

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpireTime) {
    return accessToken
  }

  if (!APPSECRET) {
    throw new Error('未配置 APP_SECRET，请创建 .env.server 文件并设置 APP_SECRET=你的小程序密钥')
  }

  console.log('[获取AccessToken] ...')
  const result = await httpsGet(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
  )

  if (result.access_token) {
    accessToken = result.access_token
    tokenExpireTime = Date.now() + (result.expires_in - 300) * 1000
    console.log('[获取AccessToken] 成功')
    return accessToken
  }

  throw new Error(`获取AccessToken失败: ${JSON.stringify(result)}`)
}

app.post('/api/callFunction', async (req, res) => {
  const { name, data } = req.body
  if (!name) return res.json({ success: false, message: '缺少函数名' })

  try {
    const token = await getAccessToken()

    console.log(`[调用云函数] ${name}`)
    const result = await httpsPost(
      `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${token}&env=${ENV_ID}&name=${name}`,
      data || {}
    )

    console.log(`[${name}] 返回:`, JSON.stringify(result).substring(0, 300))

    if (result.errcode === 0 && result.resp_data) {
      const funcResult = JSON.parse(result.resp_data)
      return res.json(funcResult)
    }

    if (result.errcode === 40001 || result.errcode === 42001) {
      accessToken = ''
      tokenExpireTime = 0
    }

    res.json(result)
  } catch (error) {
    console.error(`[错误] ${name}:`, error.message)
    res.status(500).json({ success: false, message: error.message })
  }
})

app.listen(PORT, async () => {
  console.log('')
  console.log('=====================================')
  console.log(`🚀 Admin API Proxy: http://localhost:${PORT}`)
  console.log('=====================================')

  if (!APPSECRET) {
    console.log('')
    console.log('⚠️  需要配置小程序密钥 (AppSecret):')
    console.log('')
    console.log('   获取方式:')
    console.log('   1. 登录 https://mp.weixin.qq.com')
    console.log('   2. 开发管理 → 开发设置 → AppSecret(小程序密钥)')
    console.log('   3. 点击「重置」或「查看」获取密钥')
    console.log('')
    console.log('   配置方式:')
    console.log('   在 admin 目录下创建 .env.server 文件:')
    console.log('')
    console.log('      APP_SECRET=你的AppSecret')
    console.log('')
    console.log('   然后重启: npm run server')
    console.log('')
  } else {
    try {
      await getAccessToken()
      console.log('✅ AccessToken 获取成功，服务就绪！')
    } catch (e) {
      console.log('❌ AccessToken 获取失败:', e.message)
    }
  }
})
