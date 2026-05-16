const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    var requiredFields = ['name', 'category', 'ingredients', 'steps']
    for (var i = 0; i < requiredFields.length; i++) {
      if (!event[requiredFields[i]] || (typeof event[requiredFields[i]] === 'string' && event[requiredFields[i]].trim() === '')) {
        return { success: false, error: '缺少必填字段: ' + requiredFields[i] }
      }
    }

    if (event.difficulty && (event.difficulty < 1 || event.difficulty > 5)) {
      return { success: false, error: '难度必须在1-5之间' }
    }

    var recipeData = {
      name: event.name.trim(),
      category: event.category.trim(),
      cuisine: event.cuisine || '',
      imageFileIDs: event.imageFileIDs || [],
      coverImage: event.coverImage || (event.imageFileIDs && event.imageFileIDs.length > 0 ? event.imageFileIDs[0] : ''),
      difficulty: event.difficulty || 3,
      cookTime: event.cookTime || 30,
      servings: event.servings || 2,
      ingredients: event.ingredients || [],
      steps: event.steps || [],
      tags: event.tags || [],
      tips: event.tips || '',
      viewCount: 0,
      likeCount: 0,
      rating: event.rating || 4.5,
      ratingCount: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      isPublic: true,
      authorId: wxContext.OPENID
    }

    var result = await db.collection('recipes').add({ data: recipeData })

    return { success: true, recipeId: result._id }
  } catch (err) {
    console.error('[addRecipe] 错误:', err)
    return { success: false, error: err.message }
  }
}
