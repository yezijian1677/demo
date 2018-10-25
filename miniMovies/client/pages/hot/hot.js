//腾讯云
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moives: null,
    movies_list: [],
  },


  /**
   * 获取电影列表
   */
  getMovieList(){
    qcloud.request({
      url: config.service.movieList,

      success: res => {
        wx.hideLoading();

        let data = res.data;
        // console.log(data.data);

        if (!data.code) {
          // 产生数组且去重
          let numArray = [];
          for (let i = 0; i < 10; i++) {
            numArray[i] = Math.floor(Math.random() * 14);
          };
          let numSet = new Set(numArray);
          numArray = Array.from(numSet)

          //封装成需要的格式
          let arr = [];
          arr.push(data.data[numArray[0]], data.data[numArray[1]], data.data[numArray[2]]);
          // console.log(arr);

          this.setData({
            movies_list: arr,
          });
        } else {
          wx.showToast({
            title: '列表加载失败',
          });
        }
      },

      fail: () => {
        wx.hideLoading();

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList();
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
    this.getMovieList(() => {
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