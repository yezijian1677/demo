const catNameMap = {
  gn: "国内",
  gj: "国际",
  cj: "财经",
  yl: "娱乐",
  js: "军事",
  ty: "体育",
  other: "其他"
};

Page({

  data:{

    catNameMap,
    categories: ["gn", "gj", "cj", "yl", "js", "ty", "other"],

    defaultImage: '',
    ImageUrl: '',
    title: '',
    date1: '',
    source: '',
    id: '',

    //图片下方新闻
    item: [],
    type: 'gn',

  },
  //下拉刷新
  onPullDownRefresh() {
    this.getIndex(() => {
      wx.stopPullDownRefresh()
    })
  },

  onLoad(){
    this.getIndex();
  },

//获取页面
  getIndex(callback){

    wx.showLoading({
      title: '资讯正在加载中',
    });
    wx.request({

      url: 'https://test-miniprogram.com/api/news/list',


      data: {
       type: this.data.type,
      },


      header: {
        'content-type': 'application/json' // 默认值
      },


      success: res => {
        let result = res.data.result;
        this.setPic(result);
        this.setItem(result);
      },

      complete: ()=> {
        wx.hideLoading();
        typeof callback === 'function' && callback();
      }
    })

  },
  
  //设置图片
  setPic(result){
    let url = result[0].firstImage;
    let title = result[0].title;
    let source = result[0].source;
    let date1 = result[0].date.substring(11,16);
    let id = result[0].id;
    let defaultImage = 'https://i.loli.net/2017/11/09/5a046546a2a1f.jpg'

    this.setData({
      ImageUrl:url,
      title: title,
      source: source,
      date1: date1,
      id: id,
      defaultImage: defaultImage

    })
  },

//每一个新闻类型的属性
  setItem(result){

    let item = [];
    for(let i=0;i<result.length;i++){
      item.push({
        id: result[i].id,
        title: result[i].title,
        date: result[i].date.substring(11,16),
        source: result[i].source,
        ImageUrl: result[i].firstImage,
        defaultImage: 'https://i.loli.net/2017/11/09/5a046546a2a1f.jpg',
      })
      this.setData({
        item: item,
      })
    }

  },

//选择新闻类型
  switchItem(e){
    console.log(e.currentTarget)
    let type = e.currentTarget.dataset.pos;
    console.log(type);
    this.setData({
      type: type,
    })
    this.getIndex();
  },

// 进入详细新闻页面
  showDetail(e){
    console.log(e.currentTarget);
    let id = e.currentTarget.dataset.pos;
    this.setData({
      id: id,
    })
    wx.navigateTo({
      url: '/pages/content/content?id='+this.data.id,
    })
  }
})