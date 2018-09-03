Page({

  data:{
    //首页图片的元素
    ImageUrl: '',
    title: '',
    date1: '',
    source: '',
    id: '',

    //图片下方新闻
    item: [],
    type: 'gn',

  },

  onLoad(){
    this.getIndex();
  },

//获取页面
  getIndex(){
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
    })

  },
  
  //设置图片
  setPic(result){
    let url = result[0].firstImage;
    let title = result[0].title;
    let source = result[0].source;
    let date1 = result[0].date.substring(11,16);
    let id = result[0].id;

    this.setData({
      ImageUrl:url,
      title: title,
      source: source,
      date1: date1,
      id: id,
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
    if(type==='gj'){
      this.setData({
        type: type
      })
    }
    if (type === 'gn') {
      this.setData({
        type: type
      })
    }
    if (type === 'cj') {
      this.setData({
        type: type
      })
    }
    if (type === 'yl') {
      this.setData({
        type: type
      })
    }
    if (type === 'js') {
      this.setData({
        type: type
      })
    }
    if (type === 'ty') {
      this.setData({
        type: type
      })
    }
    if (type === 'other') {
      this.setData({
        type: type
      })
    }
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