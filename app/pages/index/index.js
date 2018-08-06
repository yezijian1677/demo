//天气对应表
const weatherMap = {
  'sunny' : '晴天',
  'cloudy' : '多云',
  'overcast' : '阴',
  'lightrain' : '小雨',
  'snow' : '雪'
}

//导航栏颜色对应表
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#c5ccd0',
  'snow': '#aae1fc'
}
Page({
  data: {
    nowTempture: '14℃',
    nowWeather: '阴天',
    nowWeatherBackground: '',
    
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.getNow()
  },

  //页面信息
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址


      data: {
        city: '深圳市',
      },


      header: {
        'content-type': 'application/json' // 默认值
      },


      success: res => {
        console.log(res.data)
        let result = res.data.result;
        let temp = result.now.temp;
        let weather = result.now.weather;
        console.log(temp, weather)
        this.setData({
          nowTempture: temp+'℃',
          nowWeather: weatherMap[weather],
          nowWeatherBackground : '../../img/'+weather+'-bg.png'
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },

      //结束刷新
      complete: ()=>{
          callback && callback()
      }
      


    })
  }
 
})