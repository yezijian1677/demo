//腾讯云
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

// client/pages/edit_comment/edit_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment_value:"",

    movies_detail: {},

    id: 0,

    type: "text",
  },
  /**
   * 获取当前所在的电影
   */
  getMovie(id){
    wx.showLoading({
      title: '页面加载中',
    });

    qcloud.request({
      url: config.service.movieDetail + id,

      success: res => {
        wx.hideLoading();
        let data = res.data;

        if (!data.code) {
          this.setData({
            movies_detail: data.data,
          });
        } else {
          wx.showToast({
            title: '页面加载失败',
          });
        }
      },

      fail: () => {
        wx.hideLoading();

        setTimeout(() => {
          wx.showToast({
            title: '页面加载失败',
            icon: 'none'
          });
        })
      },
    });
  },
  
  /**
   * 获取当前输入
   */
  onInput(e){
    this.setData({
      comment_value: e.detail.value.trim(),
    });
  },
/**
 * 预览影评
 */
  previewComment(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovie(options.id)
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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