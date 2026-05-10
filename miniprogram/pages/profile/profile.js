Page({
  data: {
    userInfo: {},
    reviewCount: 0,
    showEditModal: false,
    tempAvatarUrl: '',
    isLoggingIn: false,
    showAboutModal: false
  },
  
  onLoad: function () {
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
    
    console.log('[login] 开始登录流程');
    
    // 调用wx.login获取code
    wx.login({
      success: (loginRes) => {
        console.log('[login] wx.login成功, code=', loginRes.code ? '有值' : '无值');
        if (loginRes.code) {
          // 检查本地存储中是否已有用户信息
          const storedUserInfo = wx.getStorageSync('userInfo');
          console.log('[login] 本地存储的userInfo:', JSON.stringify(storedUserInfo));
          const needCompleteProfile = !storedUserInfo || !storedUserInfo.nickName || !storedUserInfo.avatarUrl;
          console.log('[login] needCompleteProfile=', needCompleteProfile);
          
          // 调用登录云函数，同步用户信息到云数据库
          console.log('[login] 准备调用云函数login, data=', JSON.stringify({ userInfo: storedUserInfo || {} }));
          wx.cloud.callFunction({
            name: 'login',
            data: {
              userInfo: storedUserInfo || {}
            }
          }).then(res => {
            console.log('[login] 云函数返回:', JSON.stringify(res));
            wx.hideLoading();
            
            if (res.result && res.result.success) {
              const cloudUserInfo = res.result.userInfo;
              console.log('[login] 登录成功, cloudUserInfo=', JSON.stringify(cloudUserInfo));
              
              // 判断是否需要完善资料
              if (needCompleteProfile) {
                // 需要完善资料，显示模态框
                this.setData({
                  userInfo: {
                    nickName: '',
                    avatarUrl: '',
                    openId: cloudUserInfo.openId
                  },
                  showEditModal: true,
                  isLoggingIn: true
                });
              } else {
                // 资料完整，直接登录成功
                this.saveUserInfo(cloudUserInfo);
                this.setData({ 
                  showEditModal: false, 
                  isLoggingIn: false 
                });
                wx.showToast({ title: '登录成功', icon: 'success' });
                this.getReviewCount();
              }
            } else {
              console.error('[login] 云函数返回失败, res.result=', JSON.stringify(res.result));
              wx.showToast({ title: '登录失败', icon: 'none' });
            }
          }).catch(err => {
            console.error('[login] 登录云函数调用失败:', err);
            wx.hideLoading();
            console.error('登录云函数调用失败:', err);
            wx.showToast({ title: '登录失败', icon: 'none' });
          });
        } else {
          console.error('[login] 获取code失败:', loginRes);
          wx.hideLoading();
          console.error('获取code失败:', loginRes);
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('[login] wx.login失败:', err);
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
    const userInfo = { ...this.data.userInfo };
    if (!userInfo.nickName) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    const avatarUrl = userInfo.avatarUrl;
    
    if (avatarUrl) {
      // 如果已经是云存储地址，无需重新上传
      if (avatarUrl.startsWith('cloud://')) {
        this.submitUserInfo(userInfo);
        return;
      }
      this.uploadAvatarToServer(avatarUrl, userInfo, (finalUserInfo) => {
        this.submitUserInfo(finalUserInfo);
      });
    } else {
      this.submitUserInfo(userInfo);
    }
  },
  
  uploadAvatarToServer: function (tempFilePath, userInfo, callback) {
    const that = this;
    // 如果是远程HTTP URL（如微信头像），先下载再上传到云存储
    if (tempFilePath && (tempFilePath.startsWith('http://') || tempFilePath.startsWith('https://'))) {
      wx.downloadFile({
        url: tempFilePath,
        success: (downloadRes) => {
          if (downloadRes.statusCode === 200) {
            wx.cloud.uploadFile({
              cloudPath: 'user/avatars/' + Date.now() + '.png',
              filePath: downloadRes.tempFilePath,
              success: (uploadRes) => {
                callback({ ...userInfo, avatarUrl: uploadRes.fileID });
              },
              fail: (err) => {
                console.error('上传头像失败:', err);
                wx.showToast({ title: '头像上传失败', icon: 'none' });
                callback({ ...userInfo, avatarUrl: '' });
              }
            });
          } else {
            console.error('下载头像失败, statusCode:', downloadRes.statusCode);
            wx.showToast({ title: '头像下载失败', icon: 'none' });
            callback({ ...userInfo, avatarUrl: '' });
          }
        },
        fail: (err) => {
          console.error('下载头像失败:', err);
          wx.showToast({ title: '头像下载失败', icon: 'none' });
          callback({ ...userInfo, avatarUrl: '' });
        }
      });
      return;
    }
    
    // 本地文件直接上传到云存储
    wx.cloud.uploadFile({
      cloudPath: 'user/avatars/' + Date.now() + '.png',
      filePath: tempFilePath,
      success: (res) => {
        callback({ ...userInfo, avatarUrl: res.fileID });
      },
      fail: (err) => {
        console.error('上传头像失败:', err);
        wx.showToast({ title: '头像上传失败', icon: 'none' });
        callback({ ...userInfo, avatarUrl: '' });
      }
    });
  },
  
  submitUserInfo: function (userInfo) {
    const isLoggingIn = this.data.isLoggingIn;
    
    // 调用登录云函数，将用户信息同步到云数据库
    wx.cloud.callFunction({
      name: 'login',
      data: {
        userInfo: userInfo
      }
    }).then(res => {
      wx.hideLoading();
      
      if (res.result && res.result.success) {
        const updatedUserInfo = res.result.userInfo;
        this.saveUserInfo(updatedUserInfo);
        this.setData({ showEditModal: false, isLoggingIn: false });
        wx.showToast({ title: isLoggingIn ? '登录成功' : '保存成功', icon: 'success' });
        if (isLoggingIn) {
          this.getReviewCount();
        }
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('保存用户信息失败:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    });
  },
  

  

  
  goToMyReviews: function () {
    const app = getApp();
    app.globalData.reviewType = 'my';
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  
  goToSettings: function () {
    wx.navigateTo({
      url: '/pages/settings/settings'
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
});