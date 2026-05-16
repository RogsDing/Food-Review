Page({
  data: {
    notificationEnabled: true,
    showAboutModal: false
  },
  
  onLoad: function () {
    // 从本地存储获取通知设置
    const notificationEnabled = wx.getStorageSync('notificationEnabled');
    if (notificationEnabled !== undefined) {
      this.setData({
        notificationEnabled: notificationEnabled
      });
    }
  },
  
  toggleNotification: function (e) {
    const enabled = e.detail.value;
    this.setData({
      notificationEnabled: enabled
    });
    // 保存设置到本地存储
    wx.setStorageSync('notificationEnabled', enabled);
    
    if (enabled) {
      // 重新请求订阅消息权限
      const templateId = 'mPBTma8iiO0plnhED029wfU2t2uxx151nGel5YoP80A';
      wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success: (res) => {
          if (res[templateId] === 'accept') {
            wx.showToast({
              title: '通知已开启',
              icon: 'success'
            });
          } else {
            // 用户拒绝订阅，回滚开关状态
            this.setData({ notificationEnabled: false });
            wx.setStorageSync('notificationEnabled', false);
            wx.showToast({
              title: '需要开启通知权限',
              icon: 'none'
            });
          }
        },
        fail: () => {
          // 请求失败，回滚开关状态
          this.setData({ notificationEnabled: false });
          wx.setStorageSync('notificationEnabled', false);
          wx.showToast({
            title: '开启通知失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '通知已关闭',
        icon: 'success'
      });
    }
  },
  
  clearCache: function () {
    wx.clearStorageSync();
    wx.showToast({
      title: '缓存已清除',
      icon: 'success'
    });
  },
  
  goToAbout: function () {
    this.setData({
      showAboutModal: true
    });
  },
  
  closeAboutModal: function () {
    this.setData({
      showAboutModal: false
    });
  },
  
  catchTap: function () {
    // 阻止事件冒泡
  },
  
  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('openId');
          getApp().globalData.userInfo = null;
          getApp().globalData.openId = null;
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          
          wx.navigateBack({
            delta: 1,
            success: function() {
              const pages = getCurrentPages();
              const profilePage = pages[pages.length - 1];
              if (profilePage) {
                profilePage.getUserInfo();
              }
            }
          });
        }
      }
    });
  }
});