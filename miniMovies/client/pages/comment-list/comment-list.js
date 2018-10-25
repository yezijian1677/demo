//腾讯云
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

// client/pages/comment-list/comment-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    
    comment_id: null,//评论的id
    username: null,
    avatar: null,
    content: null,
    content_type: null,
    comment_array: null,

    //传过来的电影数据
    imgSrc: null,
    title: null,
  },

  /**转至影评详情 */
  to_comment_detail(e){
    console.log(e);
    let id = e.currentTarget.id;
    let imgSrc = this.data.imgSrc;
    let title = this.data.tilte;
  
    let pages = "/pages/comment/comment?imgSrc=" + imgSrc + "&title=" + title +"&id="+id;
    wx.navigateTo({
      url: pages,
    })
  },
  /**
   * 播放音频
   */
  play_record(e){
    let url = e.currentTarget.dataset.url;
    console.log(url);
    let innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = url;
    innerAudioContext.play();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id,
      imgSrc: options.imgSrc,
      tilte: options.title
    })
    this.getCommentList(this.data.id)
  },

  /**
   * 获取评论等信息
   */
  getCommentList(id){
    wx.showLoading({
      title: '评论加载中',
    })
    qcloud.request({
      url: config.service.commentOfMovie + id,

      success: res => {
        wx.hideLoading();
        console.log(res)
        let data = res.data;
        console.log(data)
        console.log(data.data);
        if (!data.code) {
          this.setData({
            comment_array: data.data
          })
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