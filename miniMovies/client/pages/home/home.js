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

    comment_array: null,
  },

  /**
   * 去到影评详情页面
   */
  ToCommentDetail(e){
    let comment_id = e.currentTarget.dataset.comment_id;
    let imgSrc = this.data.movies.image;
    let title = this.data.movies.title;

    let pages = "/pages/comment/comment?imgSrc=" + imgSrc + "&title=" + title + "&id=" + comment_id;
    wx.navigateTo({
      url: pages,
    })
  },

  /**
   * 去到电影详情界面
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
    let movieId = Math.floor(Math.random() * (15 - 1) + 2);
    // console.log(movieId);
    //获取评论
    this.getCommentList(movieId);
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

  /**获取关于电影的评论 */
  getCommentList(id) {
   
    qcloud.request({
      url: config.service.commentOfMovie + id,

      success: res => {
        wx.hideLoading();
        // console.log(res)
        let data = res.data;
        // console.log(data)
        // console.log(data.data);
        if (!data.code) {
          this.setData({
            comment_array: data.data
          })
        } else {
          wx.showToast({
            title: '推荐加载失败',
          });
        }
      },

      fail: () => {
        wx.hideLoading();

        setTimeout(() => {
          wx.showToast({
            title: '推荐加载失败',
            icon: 'none'
          });
        })
      },

    })
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