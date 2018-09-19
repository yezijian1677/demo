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
    locationAuthType: app.data.locationAuthType,
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

  //切换类型
  onTapSwitchType(e){
    let nowType = !e.currentTarget.dataset.type;
    this.setData({
      headerType: nowType
    })
  },

  // 点击登录函数
  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
      error: () => {
        locationAuthType: app.data.locationAuthType
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        });
        console.log(userInfo);
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