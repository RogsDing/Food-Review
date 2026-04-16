// app.js
App({
  globalData: {
    userInfo: null,
    // env 参数说明：
    // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会请求到哪个云环境的资源
    // 此处请填入环境 ID, 环境 ID 可在微信开发者工具右上顶部工具栏点击云开发按钮打开获取
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
    } else {
      // 调用登录获取用户信息
      this.login();
    }
  },
  
  login: function () {
    wx.cloud.callFunction({
      name: 'login'
    })
    .then(res => {
      if (res.result && res.result.userInfo) {
        this.globalData.userInfo = res.result.userInfo;
        wx.setStorageSync('userInfo', res.result.userInfo);
      }
    })
    .catch(err => {
      console.error('登录失败:', err);
    });
  }
});
