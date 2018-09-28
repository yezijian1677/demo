//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');

var userInfo;

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl);
  },

  /**
   * 会话检查
   */

  checkSession({ success, fail}) {
    //如果存在登陆信息，直接返回
    console.log('check Userinfo have', userInfo);
    if(userInfo) {
      console.log('success');
      success && success(userInfo);
      return;
    }

    //首次检查
    wx.checkSession({
      //检查会话成功后，获取用户信息
      success: () => {
        wx.getUserInfo({
          success: res => {
            userInfo = res.userInfo;
            console.log('会话获取信息成功');
            success && success(userInfo);
          },
          fail: err => {
            console.log(err);
            console.log("获取信息失败");
            fail && fail(err);
          }
        })
      },

      fail: err => {
        // 会话失效，重新执行登录
        wx.login({
          
        });
        fail && fail(err);
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
