// app.js
App({
  globalData: {
    userInfo: null,
    openId: null,
    env: "cloud1-0g31aw4l8030872d"
  },
  
  onLaunch: function () {
    // 初始化云开发
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }
    
    // 尝试从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      if (userInfo.openId) {
        this.globalData.openId = userInfo.openId;
      }
    } else {
      this.login();
    }
  },
  
  login: function () {
    console.log('[app.login] 开始自动登录');
    
    // 调用wx.login获取code
    wx.login({
      success: (loginRes) => {
        console.log('[app.login] wx.login成功');
        if (loginRes.code) {
          // 调用云函数登录
          console.log('[app.login] 准备调用云函数login');
          wx.cloud.callFunction({
            name: 'login',
            data: {}
          })
          .then(res => {
            console.log('[app.login] 云函数返回:', JSON.stringify(res));
            if (res.result && res.result.success) {
              const userInfo = res.result.userInfo;
              if (userInfo) {
                this.globalData.openId = userInfo.openId;
                console.log('[app.login] 登录成功, openId=', userInfo.openId, ', nickName=', userInfo.nickName);
                if (userInfo.nickName) {
                  this.globalData.userInfo = userInfo;
                  wx.setStorageSync('userInfo', userInfo);
                }
              }
            } else {
              const errorMsg = res.result?.error || '未知错误';
              console.error('[app.login] 登录云函数返回失败:', errorMsg);
            }
          })
          .catch(err => {
            console.error('[app.login] 登录云函数调用失败:', err);
            wx.showModal({
              title: '登录失败',
              content: '错误信息：' + (err.errMsg || err.message || JSON.stringify(err)),
              showCancel: false
            });
          });
        } else {
          console.error('[app.login] 获取code失败:', loginRes);
        }
      },
      fail: (err) => {
        console.error('[app.login] wx.login失败:', err);
      }
    });
  }
});
