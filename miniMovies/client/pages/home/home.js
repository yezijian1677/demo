//腾讯云
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');


// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */

  data: {
    movies: {},
    movieId: 1,
  },

  /**
   * 去到详情界面
   */
  ToDetail(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
  },

  //获取电影信息
  getMovieData(){
    let movieId = Math.floor(Math.random() * (15 - 1) + 1);
    // console.log(movieId);

    wx.showLoading({
      title: '影片快速加载中',
    });

    qcloud.request({
      url: config.service.movieDetail + movieId,

      success: res => {
        wx.hideLoading();

        let data = res.data;
        
        if(!data.code){
          this.setData({
            movies: data.data,
            movieId
          });
        } else {
          wx.showToast({
            title: '影片加载失败',
          });
        }
      },

      fail: () => {
        wx.hideLoading();
        
        setTimeout(() => {
          wx.showToast({
            title: '影片加载失败',
            icon: 'none'
          });
        })
      },

    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieData();
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
    this.getMovieData(() => {
      wx.stopPullDownRefresh()
    })
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