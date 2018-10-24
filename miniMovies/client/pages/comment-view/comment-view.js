//腾讯云
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
var app = getApp();
// client/pages/comment-view/comment-view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,

    id: 0,
    img: "",
    title: "",

    comment_value: "",
    comment_type: 0,
    recordAttri: null,
    recordTime: null,
    recordUrl: null,
  },

  /*
  *播放音频 
  */
  play_record(){
    let innerAudioCOntext = wx.createInnerAudioContext();
    innerAudioCOntext.src = this.data.recordAttri.tempFilePath;
    innerAudioCOntext.play();
  },

  
  /**
   * 发布影评
   * 判别是文字还是影评
   */
  submit(e){

    if(this.data.comment_type == 1){
      let path = this.data.recordAttri.tempFilePath;
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: path,
        name: 'file',
        header: {
          "content-type": 'multipart/form-data'
        },
        success: res => {
          console.log("upload record success", res);
          let data = JSON.parse(res.data).data;
          this.setData({
            recordUrl: data.imgUrl
          })
          
          this.send2DB()
        },
        fail: res => {
          console.log("up fail", res);
        }
      })
    }
    
    else if(this.data.comment_type == 0){
      this.send2DB();
    }
  },

  /**
   * 把数据发送到数据库
   */
  send2DB(){
    wx.showLoading({
      title: '发表中',
    })
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: "POST",
      data: {
        id: this.data.id,
        recorUrl: this.data.recordUrl,
        content: this.data.comment_value,
        comment_type: this.data.comment_type
      },
      success: res => {
        wx.hideLoading();
        console.log("send data to db success at send2DB:", res);
        wx.redirectTo({
          // url: '/pages/comment-list/comment-list?id='+this.data.id,
          url: '/pages/home/home'
        });
        wx.showToast({
          title: '发表成功',
        });
      },

      fail: res => {
        wx.hideLoading();
        console.log("send to db fail at send2DB:", res);
      }
    })
  },
  

  /**
   * 重新编辑
   */
  reEdit(){
    wx.navigateBack({
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("hahah:", app.recordPath);
    let recordAttri = app.recordPath;
    let recordTime = null;
    if(this.data.comment_type == 1){
      recordTime = Math.trunc(app.recordPath.duration);
    }
    this.setData({
      id: options.id,
      img: options.img,
      title: options.title,
      comment_value: options.content || null,
      comment_type: options.comment_type,
      recordAttri: recordAttri || null,
      recordTime: recordTime || null,
    });
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