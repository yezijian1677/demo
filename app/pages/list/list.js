const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

//天气对应表
const weatherMap = {
  '晴': 'sunny',
  '多云': 'cloudy',
  '阴': 'overcast',
  '少云': 'overcast',
  '小雨': 'lightrain',
  '雷阵雨': 'lightrain',
  '阵雨': 'lightrain',
  '大雨': 'heavyrain',
  '暴雨': 'heavyrain',
  '中雨': 'heavyrain',
  '雪': 'snow'
}

//导航条
const weatherColorMap = {
  '晴': '#c4efff',
  '多云': '#deeef6',
  '阴': '#c6ced2',
  '少云': '#c6ced2',
  '雷阵雨': '#CBEAFD',
  '阵雨': '#CBEAFD',
  '大雨': '#c5ccd0',
  '暴雨': '#c5ccd0',
  '中雨': '#c5ccd0',
  '小雨': '#CBEAFD',
  '雨': '#CBEAFD',
  '雪': '#aae1fc'
}

Page({
  date: {
    weekWeather: [],
    cityIds: '101010100',
  },
  onLoad(options) {
    this.setData({
      cityIds: options.cityIds
    })
    this.getWeekWeather()
    
  },
  onPullDownRefresh() {
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh()
    })
  },
  getWeekWeather(callback) {
    wx.request({
      url: 'http://aider.meizu.com/app/weather/listWeather',
      data: {
        // time: new Date().getTime(),
        cityIds: this.data.cityIds
      },
      success: res => {
        let result = res.data.value[0];
        this.setWeekWeather(result);
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setWeekWeather(result) {
    let weekWeather = []
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      weekWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${result.weathers[i].temp_night_c}° - ${result.weathers[i].temp_day_c}°`,
        iconPath: '../../img/' + weatherMap[result.weathers[i].weather] + '-icon.png'
      })
      
      //设置导航条
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: weatherColorMap[result.realtime.weather],
      })


    }
    weekWeather[0].day = '今天'
    this.setData({
      weekWeather: weekWeather
    })


 
  }
}) 