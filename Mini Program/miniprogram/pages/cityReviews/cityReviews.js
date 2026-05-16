Page({
  data: {
    city: '',
    reviews: [],
    totalShops: 0,
    totalRating: 0,
    avgRating: '0.0'
  },

  onLoad: function (options) {
    if (options.city) {
      this.setData({ city: decodeURIComponent(options.city) });
      this.loadCityReviews(decodeURIComponent(options.city));
    }
  },

  loadCityReviews: function (city) {
    var self = this;
    wx.showLoading({ title: '加载中...' });

    wx.cloud.callFunction({
      name: 'getReviews',
      data: { type: 'my' }
    }).then(res => {
      wx.hideLoading();
      var reviews = [];
      if (Array.isArray(res.result)) {
        reviews = res.result;
      } else if (res.result && res.result.success) {
        reviews = res.result.reviews || [];
      }

      var cityReviews = reviews.filter(function (r) {
        return r.city === city;
      });

      cityReviews.sort(function (a, b) {
        return new Date(b.createTime) - new Date(a.createTime);
      });

      var shopSet = new Set();
      var totalRating = 0;

      cityReviews.forEach(function (r) {
        shopSet.add(r.shopName);
        totalRating += r.rating || 0;
        r.formattedTime = r.createTime ? r.createTime.substring(0, 10) : '';
      });

      self.setData({
        reviews: cityReviews,
        totalShops: shopSet.size,
        totalRating: totalRating,
        avgRating: cityReviews.length > 0 ? (totalRating / cityReviews.length).toFixed(1) : '0.0'
      });

      if (cityReviews.length === 0) {
        wx.showToast({
          title: '该城市暂无点评',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('加载城市点评失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    });
  },

  goToDetail: function (e) {
    var reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + reviewId
    });
  },

  onPullDownRefresh: function () {
    this.loadCityReviews(this.data.city);
    wx.stopPullDownRefresh();
  }
});