Page({

  /**
   * 页面的初始数据
   */
  data: {
    moives: "",
    movies_list: [
      {
        id:	13,
        title:	"机器人总动员",
        image:	"https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg",
        category:	"爱情 / 科幻 / 动画 / 冒险",
      },
      {
        id: 14,
        title: "机器人总动员",
        image: "https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg",
        category: "爱情 / 科幻 / 动画 / 冒险",
      },
      {
        id: 15,
        title: "机器人总动员",
        image: "https://movies-1256492185.cos.ap-guangzhou.myqcloud.com/p1461851991.jpg",
        category: "爱情 / 科幻 / 动画 / 冒险",
      }
      ],
  },

  /**
   * 随机取数据
   */


  /**
   * 获取电影列表
   */
  getHotMovieList(){
    //随机获取三个id
    let numSet = new Set();
    for(let i =0; i < 3; i++){
      numSet[i] = Math.floor(Math.random()*15);
    };
    console.log(numSet);

    wx.showLoading({
      title: '影片快速加载中',
    });
    for(let i = 0; i<numSet.size; i++){
      this.getMovies(numSet[i]);
      
    }

   
  },

  getMovies(id){
    qcloud.request({
      url: config.service.movieDetail +id,

      success: res => {

        let data = res.data;       
          this.setData({
            movies: data.data,
        })
      },

      fail: () => {
       
      },

    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getHotMovieList();
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