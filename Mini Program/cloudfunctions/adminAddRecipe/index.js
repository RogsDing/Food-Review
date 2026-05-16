const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

async function verifyAdmin(token) {
  if (!token) return false
  const res = await db.collection('admins').where({ token }).get()
  return res.data.length > 0
}

exports.main = async (event) => {
  const { adminToken } = event
  if (!(await verifyAdmin(adminToken))) {
    return { success: false, message: '未授权' }
  }

  const { name, category, cuisine, difficulty, cookTime, servings, ingredients, steps, tags, tips, imageFileIDs, coverImage } = event

  if (!name || !category || !ingredients || !steps) {
    return { success: false, message: '名称、分类、食材和步骤为必填项' }
  }

  try {
    const result = await db.collection('recipes').add({
      data: {
        name,
        category,
        cuisine: cuisine || '',
        difficulty: difficulty || 3,
        cookTime: cookTime || '',
        servings: servings || 1,
        ingredients: ingredients || [],
        steps: steps || [],
        tags: tags || [],
        tips: tips || '',
        imageFileIDs: imageFileIDs || [],
        coverImage: coverImage || '',
        viewCount: 0,
        likeCount: 0,
        rating: 0,
        ratingCount: 0,
        isPublic: true,
        authorId: 'admin',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })

    return { success: true, message: '添加成功', id: result._id }
  } catch (err) {
    return { success: false, message: '添加失败：' + err.message }
  }
}
