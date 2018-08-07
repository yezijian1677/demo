//天气对应表
const weatherMap = {
  'sunny' : '晴天',
  'cloudy' : '多云',
  'overcast' : '阴',
  'lightrain' : '小雨',
  'heavyrain' : '大雨',
  'snow' : '雪'
}

//导航栏颜色对应表
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'heavyrain': '#c5ccd0',
  'lightrain': '#CBEAFD',
  'snow': '#aae1fc'
}
Page({
  data: {
    nowTempture: '14℃',
    nowWeather: '阴天',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayTemp: ``,
    todayDate: ``,
    
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
        let result = res.data.result;
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },
      

      //结束刷新
      complete: ()=>{
          callback && callback()
      }
      


    })
  },
  
  //设置当前温度以及背景图片之类的
  setNow(result){
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      nowTempture: temp + '℃',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '../../img/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },

  //设置未来几小时的天气情况
  setHourlyWeather(result){
    //设置每小时天气部分

    let hourlyWeather = [] //每小时天气
    let forecast = result.forecast //获取的天气
    let nowHour = new Date().getHours() //当前时间

    //循环整一天间隔三小时的天气
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i*3 + nowHour) % 24 + "时",
        iconPath: '../../img/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'

      })
    }

    //数据绑定给huorlyWeather
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  //当前天气详情
  setToday(result){
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },

  //详细天气绑定的函数
  onTapDayWeather(){
    wx.showToast()
  }
 
})