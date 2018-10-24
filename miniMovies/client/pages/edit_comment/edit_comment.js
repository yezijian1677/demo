var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

const app = getApp();
const RecorderManager = wx.getRecorderManager();

// client/pages/edit_comment/edit_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    userInfo: null,
    locationAuthType: app.data.locationAuthType,

    comment_value:"",

    movies_detail: {},

    id: 0,

    comment_type: 0,

    target1: 0,


  },
  /**
   * 录音开始
   */
  record_start(){
    RecorderManager.onStop(res =>{
      console.log("recording tempRealPath is:", res);
      app.recordPath = res;
      let url = this.navTo();
      wx.navigateTo({
        url: url,
      })
    })
    RecorderManager.start();
  },

  /**
   * 结束录音
   */
  record_end(){
    RecorderManager.stop();
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
 * navto导航 
 */
navTo(){
  let id = this.data.id;
  let image = this.data.movies_detail.image;
  let title = this.data.movies_detail.title;
  let content = this.data.comment_value;
  let comment_type = this.data.comment_type;
  let pages = "/pages/comment-view/comment-view?id=" + id + "&img=" + image + "&title=" + title + "&content=" + content + "&comment_type=" + comment_type;
  return pages;
},
/**
 * 检查影评是否为空
 */
  checkComment(){
    if(this.data.comment_type == 0){
      if(this.data.comment_value === ""){
        wx.showToast({
          icon: "none",
          title: '评论不能为空',
        });
        return;
      } else {
        let url = this.navTo();
        wx.navigateTo({
          url: url,
        })
      }
    }
  },
  
  /**
    * 用户登录
    */
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovie(options.id)
    this.setData({
      id: options.id,
      comment_type: options.comment_type
    });
    // console.log(this.data.comment_type)
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
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
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