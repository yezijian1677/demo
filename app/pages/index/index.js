
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
  '雨': 'lightrain',
  '雪': 'snow'
}

//导航栏颜色对应表
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

const UNPROMPTED = 0;
const UNAUTHORIZED = 1;
const AUTHORIZED = 2;

const UNPROMPTED_TIPS = "点击获取当前位置";
const UNAUTHORIZED_TIPS = '点击开启位置权限';
const AUTHORIZED_TIPS = "";

//百度地图
var bmap = require('../../libs/bmap-wx.js')


Page({
  data: {
    nowTempture: '14℃',
    nowWeather: '阴天',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayTemp: ``,
    todayDate: ``,


    //状态码
    locationAuthType: UNPROMPTED,
    locationTipsText: UNPROMPTED_TIPS,

    //百度地图数据
    latitude: 0,
    longitude: 0,
    city: '',
    cityIds: '',

    //百度天气
    weatherData: '',
    futureWeather: []


  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },
  onLoad() {
    this.getLocation();
    this.getCity();
    this.getNow();
    
  },


  //页面信息
  getNow(callback) {
    wx.request({
      url: 'http://aider.meizu.com/app/weather/listWeather?cityIds=101280601',


      data: {
        // city: this.data.city,
      },


      header: {
        'content-type': 'application/json' // 默认值
      },


      success: res => {
        let result = res.data.value[0];
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },


      //结束刷新
      complete: () => {
        callback && callback()
      }



    })
  },

  //设置当前温度以及背景图片之类的
  setNow(result) {
    let temp = result.realtime.temp;
    let weather = result.realtime.weather;
    this.setData({
      nowTempture: temp + '℃',
      nowWeather: weather,
      nowWeatherBackground: '../../img/' + weatherMap[weather] + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },

  //设置未来几小时的天气情况
  setHourlyWeather(result) {
    //设置每小时天气部分

    let hourlyWeather = [] //每小时天气
    let forecast = result.weatherDetailsInfo.weather3HoursDetailsInfos //获取的天气
    let nowHour = new Date().getHours() //当前时间

    //循环整一天间隔三小时的天气
    for (let i = 0; i < 7; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + "时",
        iconPath: '../../img/' + weatherMap[forecast[i].weather] + '-icon.png',
        temp: forecast[i].highestTemperature + '°'

      })
    }

    //数据绑定给huorlyWeather
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  //当前天气详情
  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.weathers[0].temp_night_c}° - ${result.weathers[0].temp_day_c}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },

  //详细天气绑定的函数
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list?city=',
    })
  },



  //点击获取位置绑定的函数
  onTapGetLocation() {
    this.getLocation();
  },

  //获取位置
  getLocation() {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'RQLK8Y2O4WMZsQyzUmxEPZGRG4c0ez9v'
    });

    //微信获取经纬度，百度逆解析
    wx.getLocation({
      type: 'wgs84',
      //成功后的回调函数
      success: res => {

        this.setData({
          locationAuthType: UNAUTHORIZED,
          locationTipsText: UNAUTHORIZED_TIPS
        })

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })

        BMap.regeocoding({
          location: that.data.latitude + ',' + that.data.longitude,
          success: res => {
            that.setData({
              city: res.originalData.result.addressComponent.city
            })
            this.getNow();
          },
          fail: () => {
            locationAuthType: UNAUTHORIZED;
            locationTipsText: UNAUTHORIZED_TIPS;
          }
        })
      },
    })
  },


getCity(){
  
  var citys = this.data.city;
  var cityjson = require("../../json/city.js");
  var cities = cityjson.cityList;
  // console.log(cities[0].city);

  for(var i=0; i<cities.length;i++){
    if(citys===cities[i].city){
      this.setData({
        cityIds: cities[i].cityid
      })
      console.log(cities[i].cityid);
    }

  }
}
})