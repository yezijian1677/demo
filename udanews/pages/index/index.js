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


  },
  

  onLoad(){
    this.getIndex();
  },

  getIndex(){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list?type=gn',


      data: {
       
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
    let title = result[8].title;
    let source = result[8].source;
    let date1 = result[8].date.substring(11,16);
    console.log(date1);
    this.setData({
      ImageUrl:url,
      title: title,
      source: source,
      date1: date1,
    })
  },

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


})