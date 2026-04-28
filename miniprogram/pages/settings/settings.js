Page({
  data: {
    notificationEnabled: true
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
    wx.showModal({
      title: '关于我们',
      content: '美食点评小程序 v1.0.0\n\n一个帮助您记录和管理美食体验的工具\n\n© 2026 美食点评',
      showCancel: false
    });
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