//类型转换
const mesType = {
  'p': 1,
  'strong': 2,
  'image': 3,
};

Page({

  data: {
   id: 1523074607642,
   title: '',
   date: '',
   source: '',
   firstImage: '',
   readCount: 0,

  content: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getPage();
  },


  //获取内容
  getPage(){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',

      data: {
        id: this.data.id,
      },

      header: {
        'content-type': 'application/json' // 默认值
      },

      success: res=>{
        let result = res.data.result;
        this.getHeader(result);
        this.getContent(result);
        
      },

    })
  },


//显示content页面的标题以及来源等等，作为一个单独的单元显示
  getHeader(result){

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    
    let id = result.id;
    let title = result.title;
    let date = result.date.substring(11,16);
    let source = result.source.substring(0,4);
    let firstImage = result.firstImage;
    let readCount = result.readCount;
    this.setData({
      id: id,
      title: title,
      date: date,
      source: source,
      firstImage: firstImage,
      readCount: readCount,
    });
  },


//显示content页面的内容，并用上方的map匹配好每个content的类型，便于判别
  getContent(result){
    let content = [];
    let SourceContent = result.content;
    console.log(mesType[SourceContent[1].type]);
    for(let i=0; i<SourceContent.length; i++){

      if(mesType[SourceContent[i].type]===3){
        content.push({
          type1: mesType[SourceContent[i].type],
          src: SourceContent[i].src,
          id: SourceContent[i].id,
        });
      }
      else{
        content.push({
          type1: mesType[SourceContent[i].type],
          text: SourceContent[i].text,
          id: SourceContent[i].id,
        });
      }
      this.setData({
        content: content
      })
    }
  },

  
})