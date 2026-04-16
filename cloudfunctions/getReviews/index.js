// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 构建查询条件
    let query = db.collection('reviews')
    
    // 按地区筛选
    if (event.area) {
      query = query.where({ area: event.area })
    }
    
    // 按分类筛选
    if (event.category) {
      query = query.where({ category: event.category })
    }
    
    // 按关键词搜索
    if (event.keyword) {
      query = query.where(_.or([
        {
          shopName: db.RegExp({
            regexp: event.keyword,
            options: 'i'
          })
        },
        {
          content: db.RegExp({
            regexp: event.keyword,
            options: 'i'
          })
        }
      ]))
    }
    
    // 排序
    if (event.sortBy) {
      const sortOrder = event.sortOrder === 'desc' ? 'desc' : 'asc'
      query = query.orderBy(event.sortBy, sortOrder)
    } else {
      // 默认按创建时间倒序
      query = query.orderBy('createTime', 'desc')
    }
    
    // 执行查询
    const result = await query.get()
    
    return result.data
  } catch (err) {
    console.error(err)
    return []
  }
}