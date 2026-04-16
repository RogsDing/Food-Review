Page({
  data: {
    userInfo: {},
    reviewCount: 0
  },
  
  onLoad: function () {
    this.getUserInfo();
    this.getReviewCount();
  },
  
  getUserInfo: function () {
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    } else {
      // 尝试从本地存储获取
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo: userInfo
        });
      } else {
        // 调用登录获取用户信息
        this.login();
      }
    }
  },
  
  getReviewCount: function () {
    wx.cloud.callFunction({
      name: 'getReviewCount'
    })
    .then(res => {
      if (res.result) {
        this.setData({
          reviewCount: res.result.count
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
  },
  
  login: function () {
    wx.showLoading({ title: '登录中...' });
    wx.cloud.callFunction({
      name: 'login'
    })
    .then(res => {
      wx.hideLoading();
      if (res.result.userInfo) {
        this.setData({
          userInfo: res.result.userInfo
        });
        // 存储到全局变量和本地存储
        getApp().globalData.userInfo = res.result.userInfo;
        wx.setStorageSync('userInfo', res.result.userInfo);
      }
    })
    .catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
      console.error(err);
    });
  },
  
  goToMyReviews: function () {
    wx.navigateTo({
      url: '/pages/index/index?type=my'
    });
  },
  
  goToSettings: function () {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },
  
  goToAbout: function () {
    wx.showToast({
      title: '关于我们功能开发中',
      icon: 'none'
    });
  }
});