Page({
  data: {
    userInfo: {},
    reviewCount: 0,
    showEditModal: false,
    tempAvatarUrl: '',
    isLoggingIn: false
  },
  
  onLoad: function () {
    this.getUserInfo();
    this.getReviewCount();
  },
  
  onShow: function () {
    this.getUserInfo();
    this.getReviewCount();
  },
  
  getUserInfo: function () {
    const app = getApp();
    if (app.globalData.userInfo && app.globalData.userInfo.nickName) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    } else {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo && userInfo.nickName) {
        this.setData({
          userInfo: userInfo
        });
        app.globalData.userInfo = userInfo;
        app.globalData.openId = userInfo.openId;
      } else {
        this.setData({
          userInfo: {}
        });
      }
    }
  },
  
  onShow: function () {
    const app = getApp();
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.nickName) {
      this.setData({
        userInfo: userInfo
      });
      app.globalData.userInfo = userInfo;
      app.globalData.openId = userInfo.openId;
      // 更新点评数
      this.getReviewCount();
    } else {
      this.setData({
        userInfo: {}
      });
      this.setData({ reviewCount: 0 });
    }
  },
  
  getReviewCount: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.openId) {
      this.setData({
        reviewCount: 0
      });
      return;
    }
    
    const openId = userInfo.openId;
    wx.cloud.callFunction({
      name: 'getReviewCount',
      data: { openId: openId }
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
      this.setData({
        reviewCount: 0
      });
    });
  },
  
  login: function () {
    wx.showLoading({ title: '登录中...' });
    
    // 调用wx.login获取code
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 检查本地存储中是否已有用户信息
          const storedUserInfo = wx.getStorageSync('userInfo');
          const needCompleteProfile = !storedUserInfo || !storedUserInfo.nickName || !storedUserInfo.avatarUrl;
          
          // 模拟后端登录接口返回
          setTimeout(() => {
            wx.hideLoading();
            
            // 模拟返回数据
            const mockData = {
              success: true,
              data: {
                needCompleteProfile: needCompleteProfile,
                userInfo: storedUserInfo || {
                  nickName: '',
                  avatarUrl: ''
                },
                openId: storedUserInfo?.openId || 'mock_openid_' + Date.now()
              }
            };
            
            console.log('模拟后端登录接口返回:', mockData);
            
            if (mockData.success) {
              const data = mockData.data;
              
              // 存储Token
              if (data.token) {
                wx.setStorageSync('token', data.token);
              }
              
              // 判断是否需要完善资料
              if (data.needCompleteProfile) {
                // 需要完善资料，显示模态框
                this.setData({
                  userInfo: {
                    nickName: '',
                    avatarUrl: '',
                    openId: data.openId
                  },
                  showEditModal: true,
                  isLoggingIn: true
                });
              } else {
                // 资料完整，直接登录成功
                const userInfo = {
                  ...(data.userInfo || {}),
                  openId: data.openId
                };
                this.saveUserInfo(userInfo);
                this.setData({ 
                  showEditModal: false, 
                  isLoggingIn: false 
                });
                wx.showToast({ title: '登录成功', icon: 'success' });
                // 登录成功后更新点评数
                this.getReviewCount();
              }
            } else {
              wx.showToast({ title: '登录失败', icon: 'none' });
            }
          }, 1000);
        } else {
          wx.hideLoading();
          console.error('获取code失败:', loginRes);
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('wx.login失败:', err);
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    });
  },
  
  onChooseAvatar: function (e) {
    const avatarUrl = e.detail.avatarUrl;
    this.setData({
      tempAvatarUrl: avatarUrl,
      'userInfo.avatarUrl': avatarUrl
    });
  },
  
  saveUserInfo: function (userInfo) {
    this.setData({ userInfo: userInfo });
    getApp().globalData.userInfo = userInfo;
    getApp().globalData.openId = userInfo.openId;
    wx.setStorageSync('userInfo', userInfo);
  },
  
  onAvatarTap: function () {
    if (this.data.userInfo && this.data.userInfo.nickName) {
      this.editUserInfo();
    } else {
      this.login();
    }
  },
  
  editUserInfo: function () {
    this.setData({ showEditModal: true, isLoggingIn: false });
  },
  
  closeEditModal: function () {
    if (this.data.isLoggingIn) {
      this.setData({
        showEditModal: false,
        isLoggingIn: false,
        userInfo: {}
      });
    } else {
      this.setData({ showEditModal: false });
    }
  },
  
  chooseAvatar: function () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          tempAvatarUrl: tempFilePath,
          'userInfo.avatarUrl': tempFilePath
        });
      }
    });
  },
  
  onNickNameInput: function (e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    });
  },
  
  saveUserProfile: function () {
    const userInfo = this.data.userInfo;
    if (!userInfo.nickName) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    const tempAvatarUrl = this.data.tempAvatarUrl;
    
    if (tempAvatarUrl) {
      this.uploadAvatarToServer(tempAvatarUrl, (avatarUrl) => {
        this.submitUserInfo({ ...userInfo, avatarUrl });
      });
    } else {
      this.submitUserInfo(userInfo);
    }
  },
  
  uploadAvatarToServer: function (tempFilePath, callback) {
    // 上传头像到云存储
    wx.cloud.uploadFile({
      cloudPath: 'user/avatars/' + Date.now() + '.png',
      filePath: tempFilePath,
      success: (res) => {
        const avatarUrl = res.fileID;
        callback(avatarUrl);
      },
      fail: (err) => {
        console.error('上传头像失败:', err);
        wx.showToast({ title: '头像上传失败', icon: 'none' });
        this.submitUserInfo({ ...this.data.userInfo, avatarUrl: '' });
      }
    });
  },
  
  submitUserInfo: function (userInfo) {
    const isLoggingIn = this.data.isLoggingIn;
    
    // 模拟后端更新信息接口返回
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟返回数据
      const mockData = {
        success: true,
        data: {
          userInfo: userInfo,
          openId: userInfo.openId || 'mock_openid_' + Date.now()
        }
      };
      
      console.log('模拟后端更新信息接口返回:', mockData);
      
      if (mockData.success) {
        const updatedUserInfo = {
          ...(mockData.data.userInfo || userInfo),
          openId: mockData.data.openId
        };
        // 将最新的头像和昵称覆盖到本地缓存
        this.saveUserInfo(updatedUserInfo);
        this.setData({ showEditModal: false, isLoggingIn: false });
        wx.showToast({ title: isLoggingIn ? '登录成功' : '保存成功', icon: 'success' });
        // 登录成功后更新点评数
        if (isLoggingIn) {
          this.getReviewCount();
        }
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    }, 1000);
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