//腾讯云
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

// client/pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment_detail: null,
    imgSrc: null,
    title: null,
    comment_id: null,
    isMark: 0,
  },


  /**
   * 按钮功能选择 文字0 音频1
   */
  markOrAdd(e) {
    let type = e.currentTarget.dataset.type;
    // console.log(type);
    let movieId = this.data.comment_detail[0].movie_id;
    // let comment_id = this.data.comment_detail[0].id;
    // console.log('在收藏处',comment_id)
    // let imgSrc = this.data.movies_detail.image;
    // let title = this.data.movies_detail.title;
    // console.log(movieId);
    let pages = '/pages/';

    switch (type) {
      case 'mark_comment':
        if(this.data.isMark == 0){
          this.mark_comment();
        } else {
          wx.showToast({
            title: '老子还没写完',
          })
        }
        
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
   * 收藏影评
   */
  mark_comment(){
    wx.showLoading({
      title: '收藏中',
    });
    let id = this.data.comment_detail[0].id;
    console.log(id);
    qcloud.request({
      url: config.service.mark_comment,
      login: true,
      method: 'POST',
      data: {
        id: id
      },
      success: res => {

        wx.hideLoading();
        wx.showToast({
          title: '收藏成功',
        })
      
        console.log("mark successfully", res)
        // console.log(res.data);
        this.setData({
          isMark: 1
        })
      },

      fail: res => {
        wx.hideLoading();

        console.log("mark fail", res)
        setTimeout(() => {
          wx.showToast({
            title: '收藏失败',
            icon: 'none'
          });
        })
      },

    });
  },

  /**
   * 判断是否收藏过
   */
  isMark(id){
    console.log(id)
    qcloud.request({
      url: config.service.user_is_mark + id,
      login: true,
      success: res => {
        console.log("query success", res);
        console.log(res.data.data[0]['count(*)']);
        let comment_num = res.data.data[0]['count(*)'];
        if (comment_num == 0) {
          this.setData({
            isMark: 0
          })
        } else {
          this.setData({
            isMark: 1
          })
        }
      },

      fail: res => {
        console.log("query fail", res);
      },

    });
  },
  
  /**
  * 播放音频
  */
  play_record(e) {
    let url = e.currentTarget.dataset.url;
    // console.log(url);
    let innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = url;
    innerAudioContext.play();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: options.imgSrc,
      title: options.title,
      comment_id: options.id
    });
    this.get_comment_detail(options.id);
    this.isMark(options.id);
  },

  /**
   * 获取评论详情
   * 
   */
  get_comment_detail(id){
    console.log("this is comment",id)
    wx.showLoading({
      title: '评论加载中',
    })
    qcloud.request({
      url: config.service.getCommentByCommentId + id,

      success: res => {
        wx.hideLoading();
        // console.log("in getcomment detail",res)
        let data = res.data;
        // console.log(data)
        // console.log('thissss',data.data);
        if (!data.code) {
          this.setData({
            comment_detail: data.data
          })
        } else {
          wx.showToast({
            title: '评论加载失败',
          });
        }
      },

      fail: () => {
        wx.hideLoading();

        setTimeout(() => {
          wx.showToast({
            title: '评论加载失败',
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