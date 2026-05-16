const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    var category = event.category || ''
    var keyword = event.keyword || ''
    var sortBy = event.sortBy || 'rating'
    var page = event.page || 0
    var pageSize = event.pageSize || 20

    var query = db.collection('recipes').where({ isPublic: true })

    if (category && category !== '全部') {
      query = query.where({ category: category })
    }

    if (keyword) {
      query = query.where(_.or([
        { name: db.RegExp({ regexp: keyword, options: 'i' }) },
        { tags: db.RegExp({ regexp: keyword, options: 'i' }) }
      ]))
    }

    if (sortBy === 'hot') {
      query = query.orderBy('likeCount', 'desc')
    } else if (sortBy === 'newest') {
      query = query.orderBy('createTime', 'desc')
    } else {
      query = query.orderBy('rating', 'desc')
    }

    var countResult = await query.count()
    var result = await query.skip(page * pageSize).limit(pageSize).get()

    return {
      success: true,
      recipes: result.data,
      total: countResult.total,
      hasMore: (page + 1) * pageSize < countResult.total
    }
  } catch (err) {
    console.error('[getRecipes] 错误:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
