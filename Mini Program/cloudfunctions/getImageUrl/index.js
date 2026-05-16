// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { fileList } = event
    
    if (!fileList || !Array.isArray(fileList)) {
      return {
        success: false,
        error: '缺少fileList参数'
      }
    }
    
    // 调用云存储的getTempFileURL接口获取临时链接
    const result = await cloud.getTempFileURL({
      fileList: fileList
    })
    
    return {
      success: true,
      data: result.fileList
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err.message
    }
  }
}