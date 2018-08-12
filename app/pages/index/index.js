
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

    //百度天气
    weatherData: '',
    futureWeather: []

    
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.getNow();
  },

  //页面信息
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址


      data: {
        city: this.data.city,
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
    wx.navigateTo({
      url: '/pages/list/list?city='+this.data.city,
    })
  },



  //点击获取位置绑定的函数
  onTapGetLocation(){
    this.getLocation();
    this.getWeather();
  },

//获取位置
 getLocation(){
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


getWeather(){
  var that = this;
  // 新建bmap对象 
  var BMap = new bmap.BMapWX({
    ak: 'RQLK8Y2O4WMZsQyzUmxEPZGRG4c0ez9v'
  });
  var fail = data => {
    console.log(data);
  };
  var success = data => {
    console.log(data);

    var weatherData = data.currentWeather[0];
    var futureWeather = data.originalData.results[0].weather_data;
    console.log(futureWeather);
    // weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
    that.setData({
      weatherData: weatherData,
      futureWeather: futureWeather
    });
  }

  // 发起weather请求 
  BMap.weather({
    fail: fail,
    success: success
  }); 

}

 
})