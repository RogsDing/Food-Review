Page({
  data: {
    recipe: {},
    ingredientGroups: [],
    isLiked: false,
    difficultyStars: ''
  },

  onLoad: function (options) {
    if (options.id) {
      this.loadRecipeDetail(options.id)
    }
  },

  loadRecipeDetail: function (id) {
    var self = this
    wx.showLoading({ title: '加载中...' })

    wx.cloud.callFunction({
      name: 'getRecipes',
      data: { pageSize: 100 }
    }).then(function (res) {
      wx.hideLoading()
      if (res.result && res.result.success) {
        var recipes = res.result.recipes
        var recipe = recipes.find(function (r) { return r._id === id })

        if (recipe) {
          var groups = self.groupIngredients(recipe.ingredients || [])
          var stars = ''
          var diff = recipe.difficulty || 1
          for (var i = 0; i < diff; i++) { stars += '★' }
          self.setData({ recipe: recipe, ingredientGroups: groups, difficultyStars: stars })
          wx.setNavigationBarTitle({ title: recipe.name })
        } else {
          wx.showToast({ title: '菜谱不存在', icon: 'none' })
        }
      } else {
        wx.showToast({ title: '加载失败', icon: 'none' })
      }
    }).catch(function (err) {
      wx.hideLoading()
      console.error('加载菜谱详情失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  groupIngredients: function (ingredients) {
    var map = {}
    ingredients.forEach(function (item) {
      var type = item.type || '其他'
      if (!map[type]) {
        map[type] = []
      }
      map[type].push(item)
    })

    var order = ['主料', '辅料', '调料', '其他']
    var result = []

    order.forEach(function (type) {
      if (map[type] && map[type].length > 0) {
        result.push({ type: type, items: map[type] })
        delete map[type]
      }
    })

    Object.keys(map).forEach(function (type) {
      result.push({ type: type, items: map[type] })
    })

    return result
  },

  previewImage: function (e) {
    var url = e.currentTarget.dataset.url
    var images = []

    if (this.data.recipe.imageFileIDs && this.data.recipe.imageFileIDs.length > 0) {
      images = this.data.recipe.imageFileIDs
    } else {
      images = [url]
    }

    wx.previewImage({
      current: url,
      urls: images
    })
  },

  toggleLike: function () {
    var liked = !this.data.isLiked
    var recipe = this.data.recipe

    this.setData({
      isLiked: liked,
      'recipe.likeCount': liked ? (recipe.likeCount || 0) + 1 : Math.max(0, (recipe.likeCount || 1) - 1)
    })

    wx.showToast({
      title: liked ? '已收藏' : '已取消',
      icon: 'none'
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.recipe.name + ' - 美味菜谱',
      path: '/pages/recipeDetail/recipeDetail?id=' + this.data.recipe._id,
      imageUrl: this.data.recipe.coverImage || ''
    }
  }
})
