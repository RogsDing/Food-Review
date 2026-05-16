const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

async function verifyAdmin(token) {
  if (!token) return false
  const res = await db.collection('admins').where({ token }).get()
  return res.data.length > 0
}

exports.main = async (event) => {
  const { adminToken, id } = event
  if (!(await verifyAdmin(adminToken))) {
    return { success: false, message: '未授权' }
  }

  if (!id) return { success: false, message: '缺少菜谱ID' }

  const { name, category, cuisine, difficulty, cookTime, servings, ingredients, steps, tags, tips, imageFileIDs, coverImage } = event

  try {
    const updateData = { updateTime: db.serverDate() }

    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (cuisine !== undefined) updateData.cuisine = cuisine
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (cookTime !== undefined) updateData.cookTime = cookTime
    if (servings !== undefined) updateData.servings = servings
    if (ingredients !== undefined) updateData.ingredients = ingredients
    if (steps !== undefined) updateData.steps = steps
    if (tags !== undefined) updateData.tags = tags
    if (tips !== undefined) updateData.tips = tips
    if (imageFileIDs !== undefined) updateData.imageFileIDs = imageFileIDs
    if (coverImage !== undefined) updateData.coverImage = coverImage

    await db.collection('recipes').doc(id).update({ data: updateData })

    return { success: true, message: '更新成功' }
  } catch (err) {
    return { success: false, message: '更新失败：' + err.message }
  }
}
