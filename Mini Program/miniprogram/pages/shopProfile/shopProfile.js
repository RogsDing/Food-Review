Page({
  data: {
    shopName: '',
    reviews: [],
    reviewCount: 0,
    avgRating: 0,
    firstVisitTime: '',
    lastVisitTime: '',
    totalExpense: 0,
    badgeInfo: {},
    ratingTrend: 'same'
  },

  onLoad: function (options) {
    if (options.shopName) {
      this.setData({ shopName: decodeURIComponent(options.shopName) });
      this.loadShopProfile(decodeURIComponent(options.shopName));
    }
  },

  loadShopProfile: function (shopName) {
    wx.showLoading({ title: '加载中...' });

    wx.cloud.callFunction({
      name: 'checkShopHistory',
      data: { shopName: shopName }
    }).then(res => {
      wx.hideLoading();
      if (res.result && res.result.success && res.result.exists) {
        var reviews = res.result.reviews || [];
        var count = reviews.length;
        var avgRating = count > 0 ? (reviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / count).toFixed(1) : 0;

        var firstVisit = '';
        var lastVisit = '';
        var totalExpense = 0;
        if (count > 0) {
          firstVisit = this.formatDate(reviews[count - 1].createTime);
          lastVisit = this.formatDate(reviews[0].createTime);
          totalExpense = reviews.reduce(function (sum, r) { return sum + (r.expense || 0); }, 0);
        }

        var ratingTrend = 'same';
        if (count >= 2) {
          var firstHalf = reviews.slice(0, Math.ceil(count / 2));
          var secondHalf = reviews.slice(Math.ceil(count / 2));
          var firstAvg = firstHalf.reduce(function (s, r) { return s + r.rating; }, 0) / firstHalf.length;
          var secondAvg = secondHalf.reduce(function (s, r) { return s + r.rating; }, 0) / secondHalf.length;
          if (secondAvg - firstAvg > 0.3) ratingTrend = 'up';
          else if (firstAvg - secondAvg > 0.3) ratingTrend = 'down';
        }

        this.setData({
          reviews: reviews.map(function (r) {
            r.createTime = r.createTime ? r.createTime.substring(0, 10) : '';
            return r;
          }),
          reviewCount: count,
          avgRating: avgRating,
          firstVisitTime: firstVisit,
          lastVisitTime: lastVisit,
          totalExpense: totalExpense.toFixed(0),
          badgeInfo: this.getBadgeInfo(count),
          ratingTrend: ratingTrend
        });

        wx.setNavigationBarTitle({ title: shopName + ' - 档案卡' });
      } else {
        wx.showToast({ title: '未找到探店记录', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('加载店铺档案失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  getBadgeInfo: function (count) {
    var badges = [
      { min: 1, max: 1, name: 'Lv.1 初识', icon: '🌱', title: '新客初探', desc: '第一次光顾这家店', color1: '#a8e6cf', color2: '#88d8b0' },
      { min: 2, max: 2, name: 'Lv.2 常客', icon: '🔥', title: '回头客', desc: '已经来过2次了，是常客了！', color1: '#ffd93d', color2: '#ff9f43' },
      { min: 3, max: 5, name: 'Lv.3 老饕', icon: '⭐', title: '铁杆粉丝', desc: '真正的美食爱好者', color1: '#ff9f43', color2: '#ee5253' },
      { min: 6, max: 10, name: 'Lv.4 行家', icon: '👑', title: '品鉴达人', desc: '对这家店如数家珍', color1: '#c56cf0', color2: '#8e44ad' },
      { min: 11, max: 999, name: 'Lv.5 骨灰', icon: '💎', title: '店铺代言人', desc: '你就是这家店的活招牌！', color1: '#00d2d3', color2: '#01a3a4' }
    ];
    for (var i = badges.length - 1; i >= 0; i--) {
      if (count >= badges[i].min && count <= badges[i].max) {
        return badges[i];
      }
    }
    return badges[0];
  },

  formatDate: function (isoString) {
    if (!isoString) return '--';
    try {
      var d = new Date(isoString);
      return d.getFullYear() + '-' +
        ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
        ('0' + d.getDate()).slice(-2);
    } catch (e) {
      return isoString.substring(0, 10);
    }
  },

  previewImage: function (e) {
    var images = e.currentTarget.dataset.images;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: images[index],
      urls: images
    });
  }
});
