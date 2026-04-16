Page({
  data: {
    searchKeyword: '',
    searchHistory: [],
    searchSuggestions: [],
    searchResults: [],
    showResults: false
  },

  onLoad: function (options) {
    // 加载搜索历史
    this.loadSearchHistory();
  },

  onSearchInput: function (e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    
    // 显示搜索建议
    if (keyword) {
      this.showSearchSuggestions(keyword);
    } else {
      this.setData({
        searchSuggestions: [],
        showResults: false
      });
    }
  },

  search: function () {
    const keyword = this.data.searchKeyword;
    if (!keyword) return;
    
    // 保存搜索历史
    this.saveSearchHistory(keyword);
    
    // 执行搜索
    this.performSearch(keyword);
  },

  performSearch: function (keyword) {
    wx.showLoading({ title: '搜索中...' });
    wx.cloud.callFunction({
      name: 'getReviews',
      data: {
        keyword: keyword
      }
    })
    .then(res => {
      wx.hideLoading();
      if (res.result) {
        // 为每个点评添加一些默认数据
        const defaultImages = [
          'https://img.icons8.com/color/480/food.png',
          'https://img.icons8.com/color/480/restaurant.png',
          'https://img.icons8.com/color/480/cafe.png',
          'https://img.icons8.com/color/480/sushi.png',
          'https://img.icons8.com/color/480/hamburger.png'
        ];
        const searchResults = res.result.map(item => ({
          ...item,
          averagePrice: item.averagePrice || Math.floor(Math.random() * 100) + 50,
          monthlySales: item.monthlySales || Math.floor(Math.random() * 1000) + 100,
          category: item.category || ['美食', '咖啡', '甜点', '酒吧', '面食', '日料', '西餐', '火锅'][Math.floor(Math.random() * 8)],
          distance: item.distance || (Math.random() * 3 + 0.5).toFixed(1) + 'km',
          address: item.address || item.area + '街道',
          imageFileIDs: item.imageFileIDs && item.imageFileIDs.length > 0 ? item.imageFileIDs : [defaultImages[Math.floor(Math.random() * defaultImages.length)]]
        }));
        this.setData({
          searchResults: searchResults,
          showResults: true
        });
      }
    })
    .catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      });
      console.error(err);
    });
  },

  showSearchSuggestions: function (keyword) {
    // 模拟搜索建议
    const allSuggestions = ['川菜', '粤菜', '西餐', '日料', '火锅', '烧烤', '咖啡', '甜点', '酒吧', '面食'];
    const suggestions = allSuggestions.filter(item => item.includes(keyword));
    this.setData({
      searchSuggestions: suggestions,
      showResults: false
    });
  },

  saveSearchHistory: function (keyword) {
    let history = wx.getStorageSync('searchHistory') || [];
    // 去重并限制历史记录数量
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    wx.setStorageSync('searchHistory', history);
    this.setData({
      searchHistory: history
    });
  },

  loadSearchHistory: function () {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({
      searchHistory: history
    });
  },

  clearSearch: function () {
    this.setData({
      searchKeyword: '',
      searchSuggestions: [],
      showResults: false
    });
  },

  clearHistory: function () {
    wx.setStorageSync('searchHistory', []);
    this.setData({
      searchHistory: []
    });
  },

  searchWithHistory: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchKeyword: keyword
    });
    this.search();
  },

  searchWithSuggestion: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchKeyword: keyword
    });
    this.search();
  },

  cancelSearch: function () {
    wx.navigateBack();
  },

  goToDetail: function (e) {
    const reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + reviewId
    });
  }
});