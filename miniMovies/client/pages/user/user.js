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

    headerType: 0,
    //测试数据
    comment_list: [],


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

  /**转至影评详情 */
  to_comment_detail(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.comment_id;
    // console.log(id)
    let imgSrc = e.currentTarget.dataset.imgsrc;
    // console.log(imgSrc)
    let title = e.currentTarget.dataset.title;
    // console.log(title)

    let pages = "/pages/comment/comment?imgSrc=" + imgSrc + "&title=" + title + "&id=" + id;
    wx.navigateTo({
      url: pages,
    })
  },

  /**
   * 获取我的影评收藏列表
   */
  getStarComment(){
    wx.showLoading({
      title: '列表正在加载...',
    });

    qcloud.request({
      url: config.service.getStarMark,
      login: true,
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '收藏页success',
        });
        let data = res.data;
        // console.log('star',data.data)
        if (!data.code) {
          this.setData({
            comment_list: data.data
          });
        } else {
          wx.showToast({
            title: '列表加载失败',
          });
        }
      },

      fail: res => {
        wx.hideLoading();
        console.log(res)
        setTimeout(() => {
          wx.showToast({
            title: '列表加载失败',
            icon: 'none'
          });
        })
      },

    }); 
  },

  /**
   * 获取我发布的影评
   */
  getMyComment() {
    wx.showLoading({
      title: '列表正在加载...',
    });

    qcloud.request({
      url: config.service.getMyComment,
      login: true,
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '我的页success',
        });
        let data = res.data;
        // console.log('my',data.data)
        if (!data.code) {
          this.setData({
            comment_list: data.data
          });
        } else {
          wx.showToast({
            title: '列表加载失败',
          });
        }
      },

      fail: res => {
        wx.hideLoading();
        console.log(res)
        setTimeout(() => {
          wx.showToast({
            title: '列表加载失败',
            icon: 'none'
          });
        })
      },

    });
  },


  //切换类型
  onTapSwitchType(e){
    let nowType = !e.currentTarget.dataset.type;
    console.log(nowType);
    this.setData({
      headerType: nowType
    })
    if(nowType == true) {
      this.getMyComment();
    } else {
      this.getStarComment();
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

  /**页面加载函数 */
  onLoad: function() {
   this.getStarComment();
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
    if(this.data.headerType == true)
    {
      this.getMyComment(() => {
        wx.stopPullDownRefresh()
      })
    } else {
      this.getStarComment(() => {
        wx.stopPullDownRefresh()
      })
    }
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