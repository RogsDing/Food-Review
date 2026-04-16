Page({
  data: {
    reviews: [],
    sortText: '评分排序',
    areaText: '地区筛选',
    showSort: false,
    showArea: false,
    sortBy: 'rating',
    sortOrder: 'desc',
    area: '',
    searchKeyword: ''
  },
  
  onLoad: function (options) {
    this.getReviews();
  },
  
  onShow: function () {
    this.getReviews();
  },
  
  getReviews: function () {
    wx.showLoading({ title: '加载中...' });
    wx.cloud.callFunction({
      name: 'getReviews',
      data: {
        sortBy: this.data.sortBy,
        sortOrder: this.data.sortOrder,
        area: this.data.area,
        keyword: this.data.searchKeyword
      }
    })
    .then(res => {
      wx.hideLoading();
      if (res.result) {
        // 为每个点评添加一些默认数据，使其更符合大众点评的展示格式
        const reviews = res.result.map(item => ({
          ...item,
          averagePrice: item.averagePrice || Math.floor(Math.random() * 100) + 50, // 随机生成人均价格
          monthlySales: item.monthlySales || Math.floor(Math.random() * 1000) + 100, // 随机生成月售数量
          category: item.category || ['美食', '咖啡', '甜点', '酒吧', '面食', '日料', '西餐', '火锅'][Math.floor(Math.random() * 8)], // 随机生成分类
          distance: item.distance || (Math.random() * 3 + 0.5).toFixed(1) + 'km', // 随机生成距离
          address: item.address || item.area + '街道'
        }));
        this.setData({
          reviews: reviews
        });
      }
    })
    .catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      console.error(err);
    });
  },
  
  showSortOptions: function () {
    this.setData({
      showSort: true,
      showArea: false
    });
  },
  
  hideSortOptions: function () {
    this.setData({
      showSort: false
    });
  },
  
  showAreaOptions: function () {
    this.setData({
      showArea: true,
      showSort: false
    });
  },
  
  hideAreaOptions: function () {
    this.setData({
      showArea: false
    });
  },
  
  sortByRatingDesc: function () {
    this.setData({
      sortBy: 'rating',
      sortOrder: 'desc',
      sortText: '评分从高到低',
      showSort: false
    });
    this.getReviews();
  },
  
  sortByRatingAsc: function () {
    this.setData({
      sortBy: 'rating',
      sortOrder: 'asc',
      sortText: '评分从低到高',
      showSort: false
    });
    this.getReviews();
  },
  
  sortByTimeDesc: function () {
    this.setData({
      sortBy: 'createTime',
      sortOrder: 'desc',
      sortText: '时间从新到旧',
      showSort: false
    });
    this.getReviews();
  },
  
  sortByTimeAsc: function () {
    this.setData({
      sortBy: 'createTime',
      sortOrder: 'asc',
      sortText: '时间从旧到新',
      showSort: false
    });
    this.getReviews();
  },
  
  filterByArea: function (e) {
    const area = e.currentTarget.dataset.area;
    this.setData({
      area: area,
      areaText: area || '地区筛选',
      showArea: false
    });
    this.getReviews();
  },
  
  onSearchInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },
  
  search: function () {
    this.getReviews();
  },

  clearSearch: function () {
    this.setData({
      searchKeyword: ''
    });
    this.getReviews();
  },
  
  goToDetail: function (e) {
    const reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + reviewId
    });
  },
  
  goToPublish: function () {
    wx.switchTab({
      url: '/pages/publish/publish'
    });
  },

  goToSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  showSearch: function () {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  selectCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    wx.showToast({
      title: `选择了${category}分类`,
      icon: 'none'
    });
    // 这里可以添加分类筛选逻辑
  },

  showFilterOptions: function () {
    wx.showToast({
      title: '筛选功能开发中',
      icon: 'none'
    });
  },

  catchTap: function (e) {
    e.stopPropagation();
  }
});