// pages/user/user.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    headerType: 1,
    //测试数据
    comment_test: [
      {
        id: 0,
        image: 'https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg',
        name: '复仇者1',
        comment: 'adadadadaaaASDASDAD ASD ASD ASD ASD AS DSA D',
        avatar: 'https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg',
        userName: '徐妍1'
      },

      {
        id: 1,
        image: 'https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg',
        name: '复仇者2',
        comment: 'adadadada',
        avatar: 'https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg',
        userName: '徐妍2'
      },

      {
        id: 2,
        image: 'https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg',
        name: '复仇者3',
        comment: 'adadadada',
        avatar: 'https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg',
        userName: '徐妍3'
      },

    ],


  },

  /**
   * 获取我的影评收藏列表
   */
  getStarComment(){
    wx.showLoading({
      title: '列表正在加载...',
    });

    qcloud.request({
      url: config.service.markList,

      success: res => {
        console.log(res);
        wx.hideLoading();
      }
    })
  },

  //切换类型
  onTapSwitchType(e){
    let nowType = !e.currentTarget.dataset.type;
    this.setData({
      headerType: nowType
    })
  },

  // 登录函数
  onTapLogin(e) {
   if (!e.detail.userInfo) {
    wx.showToast({
      title: '已拒绝授权',
      icon: 'none',
    });
    console.log("授权失败");
   } else {
     let userInfo = e.detail.userInfo;
     this.setData({
       userInfo: userInfo,
     })
   }
  },
  onLoad(){
    this.getStarComment();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
   app.checkSession({
     success: userInfo => {
       console.log(userInfo);
       this.setData({
         userInfo: userInfo,
         login: true,
       })
     },
     fail: err => {
       wx.showToast({
         title: '请登录',
         icon: 'none',
       })
     }
   })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})