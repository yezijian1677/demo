//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');

var userInfo;

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl);
  },

  /**
   * 检查是否有登录信息
   */
  checkSession({ success, fail }) {
    if (userInfo) {
      console.log('checkSession success', userInfo);
      success && success(userInfo);
      return;
    }


    // 首次检查会话信息
    wx.checkSession({
      // 检查会话信息成功后，获取用户信息
      success: () => {
        wx.getUserInfo({
          success: res => {
            userInfo = res.userInfo;
            console.log("获取用户信息成功");
            success && success(userInfo);
          },
          fail: err => {
            console.log(err);
            console.log('获取用户信息失败');
            fail && fail(err);
          }
        })
      },
      fail: err => {
        // session_key 已经失效，需要重新执行登录流程
        wx.login();
        fail && fail(err);
      }
    })
  },
})