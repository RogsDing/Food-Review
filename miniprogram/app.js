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
    // 调用wx.login获取code
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 调用后端登录接口
          wx.request({
            url: 'https://your-api-server.com/api/login', // 后端登录接口URL占位符
            method: 'POST',
            data: {
              code: loginRes.code
            },
            success: (res) => {
              console.log('后端登录接口返回:', res);
              
              if (res.data && res.data.success) {
                const data = res.data.data;
                
                // 存储Token
                if (data.token) {
                  wx.setStorageSync('token', data.token);
                }
                
                // 资料完整，存储用户信息
                if (!data.needCompleteProfile && data.userInfo) {
                  this.globalData.userInfo = data.userInfo;
                  wx.setStorageSync('userInfo', data.userInfo);
                }
              }
            },
            fail: (err) => {
              console.error('登录接口调用失败:', err);
            }
          });
        } else {
          console.error('获取code失败:', loginRes);
        }
      },
      fail: (err) => {
        console.error('wx.login失败:', err);
      }
    });
  }
});
