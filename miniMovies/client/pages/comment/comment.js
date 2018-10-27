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
    isComment:0,
    my_comment_id: 0,
  },

  /**
   * 查询用户是否评论过
   */
  user_is_comment(id){
    qcloud.request({
      url: config.service.user_is_comment + id,
      login: true,
      success: res => {
        console.log("is_comment_query success", res);
        // console.log(res.data.data[0]['count(*)']);
        let comment_num = res.data.data[0]['count(*)'];
        if (comment_num == 0) {
          this.setData({
            isComment: 0
          })
        } else {
          this.setData({
            isComment: 1
          })
        }
      },

      fail: res => {
        console.log("is_comment_query fail", res);
      },

    });
  },
  /**
   * 查询我的评论id
   */
  my_comment_id(id) {
    let movieId = this.data.movie_id;
    qcloud.request({
      url: config.service.query_my_comment_id + id,
      login: true,
      success: res => {
        console.log("my_comment_query success", res.data.data[0].id);
        this.setData({
          my_comment_id: res.data.data[0].id
        })
      },

      fail: res => {
        console.log("my_comment_query fail", res);
      },

    });
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
          this.remove_mark();
        }
        
        break;

      case 'add_comment':
        if(this.data.isComment == 0){
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
        } else {
          this.to_comment_detail();
        }
        
        break;
    }
  },

  /**转至我的影评详情 */
  to_comment_detail(e) {
    // console.log(e);
    let id = this.data.my_comment_id;
    console.log(id);
    let imgSrc = this.data.imgSrc;
    let title = this.data.title;

    let pages = "/pages/comment/comment?imgSrc=" + imgSrc + "&title=" + title + "&id=" + id;
    wx.navigateTo({
      url: pages,
    })
  },

  /**
   * 收藏影评
   */
  mark_comment(){
    wx.showLoading({
      title: '收藏中',
    });
    let id = this.data.comment_detail[0].id;
    // console.log(id);
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
   * 移除收藏
   */
  remove_mark(){
    wx.showLoading({
      title: '取消收藏',
    });
    let id = this.data.comment_detail[0].id;
    // console.log(id);
    qcloud.request({
      url: config.service.remove_mark,
      login: true,
      method: 'POST',
      data: {
        id: id
      },
      success: res => {

        wx.hideLoading();
        wx.showToast({
          title: '移除成功',
        })

        console.log("remove_mark successfully", res)
        // console.log(res.data);
        this.setData({
          isMark: 0
        })
      },

      fail: res => {
        wx.hideLoading();

        console.log("remove_mark fail", res)
        setTimeout(() => {
          wx.showToast({
            title: '移除失败',
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
    // console.log(id)
    qcloud.request({
      url: config.service.user_is_mark + id,
      login: true,
      success: res => {
        console.log("query success", res);
        // console.log(res.data.data[0]['count(*)']);
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
      comment_id: options.id,
    });
    this.get_comment_detail(options.id);
    this.isMark(options.id);
    this.user_is_comment(options.id);
  },

  /**
   * 获取评论详情
   * 
   */
  get_comment_detail(id){
    // console.log("this is comment",id)
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
        // console.log('thissss',data.data[0].movie_id);
        let movie_id = data.data[0].movie_id
        this.my_comment_id(movie_id);
        if (!data.code) {
          this.setData({
            comment_detail: data.data,
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