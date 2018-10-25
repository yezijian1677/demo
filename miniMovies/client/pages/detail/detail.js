//腾讯云
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

// client/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否显示底部选择器
    show_choice: 0,

    movies_detail: {},

    movies_decription_short: "",

  },
  /**
   * 获取影片信息
   */
  getMoviesDetail(id){
    wx.showLoading({
      title: '影片快速加载中',
    });

    qcloud.request({
      url: config.service.movieDetail + id,

      success: res => {
        wx.hideLoading();

        let data = res.data;
        // console.log(data.data);
        // console.log(data.data.description.substring(0, 150));

        if (!data.code) {
          this.setData({
            movies_detail: data.data,
            movies_decription_short: data.data.description.substring(0,160)
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
   * 按钮功能选择 文字0 音频1
   */
  viewOrAdd(e) {
    let type = e.currentTarget.dataset.type;
    // console.log(type);
    let movieId = this.data.movies_detail.id;
    let imgSrc = this.data.movies_detail.image;
    let title = this.data.movies_detail.title;
    // console.log(movieId);
    let pages = '/pages/';

    switch(type){
      case 'view_comment':
        pages += "comment-list/comment-list?imgSrc="+imgSrc+"&title="+title+"&id="+movieId;
        wx.navigateTo({
          url: pages,
        });
        break;

      case 'add_comment':
        pages += "edit_comment/edit_comment?id=" + movieId;
        wx.showActionSheet({
          itemList: ["文字", "录音"],
          success: res => {
            // console.log(res.tapIndex);
            pages += "&comment_type=" + res.tapIndex;
            console.log(pages);
            wx.navigateTo({
              url: pages,
            });
          }
        });
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoviesDetail(options.id)
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