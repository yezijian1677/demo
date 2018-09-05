Page({

  data:{
    //首页图片的元素
    typeArray: [
      { typeMsg: '国内' },
      { typeMsg: '国际' },
      { typeMsg: '财经' },
      { typeMsg: '娱乐' },
      { typeMsg: '军事' },
      { typeMsg: '体育' },
      { typeMsg: '其他' },
    ],

    dataPosType:[
      { type: 'gn' },
      { type: 'gj' },
      { type: 'cj' },
      { type: 'yl' },
      { type: 'js' },
      { type: 'ty' },
      { type: 'other' },
    ],

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
        defaultImage: result[i].firstImage,
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
    let typeList = ['gj','gn','cj','yl','js','ty','other'];
    for(let i=0;i<typeList.length;i++){
      if(type===typeList[i]){
        this.setData({
          type: typeList[i]
        })
      }
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