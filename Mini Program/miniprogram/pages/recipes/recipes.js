Page({
  data: {
    categories: [
      { name: '全部', icon: '🍽️', count: 0 },
      { name: '川菜', icon: '🌶️', count: 0 },
      { name: '粤菜', icon: '🥘', count: 0 },
      { name: '湘菜', icon: '🌶️', count: 0 },
      { name: '家常菜', icon: '🏠', count: 0 },
      { name: '凉菜', icon: '🥗', count: 0 },
      { name: '热菜', icon: '🍲', count: 0 },
      { name: '汤羹', icon: '🍵', count: 0 },
      { name: '甜品', icon: '🍰', count: 0 },
      { name: '小吃', icon: '🥟', count: 0 },
      { name: '烧烤', icon: '🍖', count: 0 }
    ],
    currentCategory: '全部',
    currentCategoryIndex: 0,
    recipes: [],
    loading: false,
    hasMore: true,
    page: 0,
    scrollTop: 0,
    scrollToCategory: ''
  },

  onLoad: function () {
    this.loadCategoriesCount()
    this.loadRecipes()
  },

  onPullDownRefresh: function () {
    this.setData({ page: 0, hasMore: true })
    this.loadCategoriesCount()
    this.loadRecipes()
    wx.stopPullDownRefresh()
  },

  loadCategoriesCount: function () {
    var self = this
    var categories = self.data.categories

    categories.forEach(function (cat, index) {
      if (cat.name === '全部') return

      wx.cloud.callFunction({
        name: 'getRecipes',
        data: { category: cat.name, pageSize: 1 }
      }).then(function (res) {
        if (res.result && res.result.success) {
          var key = 'categories[' + index + '].count'
          self.setData({
            [key]: res.result.total
          })
        }
      }).catch(function () {})
    })

    wx.cloud.callFunction({
      name: 'getRecipes',
      data: { category: '全部', pageSize: 1 }
    }).then(function (res) {
      if (res.result && res.result.success) {
        self.setData({ 'categories[0].count': res.result.total })
      }
    }).catch(function () {})
  },

  loadRecipes: function () {
    var self = this
    if (self.data.loading || !self.data.hasMore) return

    self.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getRecipes',
      data: {
        category: self.data.currentCategory,
        page: self.data.page,
        pageSize: 20
      }
    }).then(function (res) {
      self.setData({ loading: false })
      if (res.result && res.result.success) {
        var newRecipes = self.data.page === 0
          ? res.result.recipes
          : self.data.recipes.concat(res.result.recipes)

        self.setData({
          recipes: newRecipes,
          hasMore: res.result.hasMore,
          page: self.data.page + 1
        })
      } else {
        self.setData({ hasMore: false })
      }
    }).catch(function (err) {
      console.error('加载菜谱失败:', err)
      self.setData({ loading: false, hasMore: false })
    })
  },

  selectCategory: function (e) {
    var index = e.currentTarget.dataset.index
    var name = e.currentTarget.dataset.name

    if (this.data.currentCategory === name) return

    this.setData({
      currentCategory: name,
      currentCategoryIndex: index,
      recipes: [],
      page: 0,
      hasMore: true,
      scrollToCategory: 'cat-' + index
    })

    this.loadRecipes()
  },

  goToDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id=' + id
    })
  },

  goToSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  loadMore: function () {
    this.loadRecipes()
  }
})
