const jinrishici = require('../../utils/jinrishici.js')
const APIKEY = "07031f32f8b44d27a64702dbbbafb509";// 填入你申请的KEY
import * as echarts from '../../ec-canvas/echarts';

function setOption(chart,dataMax,dataMin){
  const option = {
    color: ["#FB7821", "#1B9DFF"],
    grid: {
      containLabel: true,
      x: -10,
      top: 40,
      bottom: 40,
      width: 540,
      height:100
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      show: false,
  },
  yAxis: {
    show: false
  },
  series: [{
    itemStyle: {
      normal: {
        label: {
          show: true,
          position: [-4, -12],
          textStyle: {
            color: '#333333'
          },
          formatter: function (params) {
            return params.value + '°'
          }
        }
      }
    },
    type: 'line',
    symbol: "circle",
    symbolSize: 5,
    // smooth: true,
    data:dataMax,
  }, {
    itemStyle: {
      normal: {
        label: {
          show: true,
          position: [-4, 10],
          textStyle: {
            color: '#333333'
          },
          formatter: function (params) {
            return params.value + '°'
          }
        }
      }
    },
    type: 'line',
    symbol: "circle",
    symbolSize: 5,
    // smooth: true,
    data: dataMin,
  }
  ]
  };
  chart.setOption(option)
}

Page({
  data: {
    y7data1:[], 
    y7data2:[1, -2, 2, 5, 3, 2, 0], 
    forecast7Days:[1, -2, 2, 5, 3, 2, 0], 
    jinrishici:[],//今日诗词
    updateTimeStr:'',
    lifeStyles:[
      {
        type: "8",
        name:"舒适度",
        icon:"icon-shushidu",
      },
      {
        type: "9",
        name:"感冒",
        icon:"icon-ganmaozhishu",
      },
      {
        type: "3",
        name:"穿衣",
        icon:"icon-chuanyi",
      },
      {
        type: "1",
        name:"运动",
        icon:"icon-yundong",
      },
      {
        type: "2",
        name:"洗车",
        icon:"icon-xiche",
      },
      {
        type: "4",
        name:"钓鱼",
        icon:"icon-diaoyu",
      },
      {
        type: "5",
        name:"紫外线",
        icon:"icon-ziwaixian",
      },
      {
        type: "6",
        name:"旅游",
        icon:"icon-lvyou1",
      },
      {
        type: "13",
        name:"化妆",
        icon:"icon-huazhuangpin",
      },
    ],
    airDetails:[
      {
        name:'pm10',
        label:'PM10',
        value:''
      },
      {
        name:'pm2p5',
        label:'PM2.5',
        value:''
      },
      {
        name:'no2',
        label:'NO2',
        value:''
      },
      {
        name:'so2',
        label:'SO2',
        value:''
      },
      {
        name:'co',
        label:'CO',
        value:''
      },
      {
        name:'o3',
        label:'O3',
        value:''
      },
    ],
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true,
      isLoaded: false,
      isDisposed: false
    },
    status:false,
    showLife:false,
  },

openAirDetail(){ // 打开空气质量弹窗
  this.setData({
    status: true
  })
},
openLifeStyle(event){ // 打开生活指数弹窗
  console.log(event)
  const currentList = event.currentTarget.dataset.list
  this.setData({
    showLife: true,
    currentList: currentList,
  })
},
// 解决遮罩层的滚动穿透问题
catchTouch(){},
// 点击遮罩层关闭弹框
airDetail(e) {
    // console.log(111111, e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id;
    if (id == 1) {
      this.setData({
        status: false
      })
    }
    if (id == 3) {
      this.setData({
        showLife: false
      })
    }
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    jinrishici.load(result => {
      // 下面是处理逻辑示例
      this.setData({"jinrishici": result.data.content})
    })
    this.getLocation()
  },
  //选择定位
  selectLocation() {
    var that = this
    wx.chooseLocation({
      success(res) {
        let location=res.longitude + "," + res.latitude
        that.setData({
          location: location
        })
        that.getWeather()
        that.getCityByLoaction()
      }
      , fail() {
        wx.getLocation({
          type: 'gcj02',
          fail() {
            wx.showModal({
              title: '获取地图位置失败',
              content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
              success(mRes) {
                if (mRes.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data.authSetting["scope.userLocation"] === true) {
                        that.selectLocation()
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }, fail(err) {
                      console.log(err)
                      wx.showToast({
                        title: '唤起设置页失败，请手动打开',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  })
                }
              }
            })
          }
        })

      }
    })
  },
  /**
   * 获取定位
   */
  getLocation() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          location: res.longitude + "," + res.latitude
        })
        that.getWeather()
        that.getCityByLoaction()
      }, fail(err) {
        wx.showModal({
          title: '获取定位信息失败',
          content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
          success(mRes) {
            if (mRes.confirm) {
              wx.openSetting({
                success: function (data) {
                  if (data.authSetting["scope.userLocation"] === true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    that.getLocation()
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                    that.setData({
                      location: "116.41,39.92"
                    })
                    that.getWeather()
                    that.getCityByLoaction()
                  }
                }, fail(err) {
                  console.log(err)
                  wx.showToast({
                    title: '唤起设置页失败，请手动打开',
                    icon: 'none',
                    duration: 1000
                  })
                  that.setData({
                    location: "116.41,39.92"
                  })
                  that.getWeather()
                  that.getCityByLoaction()
                }
              })
            } else if (mRes.cancel) {
              that.setData({
                location: "116.41,39.92"
              })
              that.getWeather()
              that.getCityByLoaction()
            }
          }
        })
      }
    })
  },
  /**
   * 根据坐标获取城市信息
   */
  getCityByLoaction() {
    var that = this
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup?key=' + APIKEY + "&location=" + that.data.location,
      success(result) {
        var res = result.data
        if (res.code == "200") {
          var data = res.location[0]
          that.setData({
            City: data.adm2,
            County: data.name
          })
        } else {
          wx.showToast({
            title: '获取城市信息失败',
            icon: 'none'
          })
        }

      }
    })
  },
  /**
   * 获取天气
   */
  getWeather() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({ // 实况天气
      url: 'https://devapi.qweather.com/v7/weather/now?key=' + APIKEY + "&location=" + that.data.location,
      success(result) {
        var res = result.data
        //console.log(res)
        that.setData({
          now: res.now
        })
        that.setData({
          updateTimeStr: that.formatUpdateTime(res.updateTime)
        })
        setTimeout(()=>{
          that.setData({
            updateTimeStr: ''
          })
        },4000)
      }
    })
    wx.request({ // 空气质量实况
      url: 'https://devapi.qweather.com/v7/air/now?key=' + APIKEY + "&location=" + that.data.location,
      success(result) {
        var res = result.data 
        that.data.airDetails.forEach(item=>{
          item.value=res.now[item.name]
        })
        that.setData({
          nowAir: res.now,
          airDetails:that.data.airDetails
        })
      }
    })
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/24h?key=' + APIKEY + "&location=" + that.data.location,
      success(result) {
        var res = result.data
        //console.log(res)
        res.hourly.forEach(function (item) {
          item.time = that.formatTime(new Date(item.fxTime)).hourly
        })
        that.setData({
          hourly: res.hourly
        })
      }
    })
    wx.request({ // 获取7天预报
      url: 'https://devapi.qweather.com/v7/weather/7d?key=' + APIKEY + "&location=" + that.data.location,
      success(result) {
        var res = result.data
        //console.log(res)
        res.daily.forEach(function (item) {
          item.date = that.formatTime(new Date(item.fxDate)).daily
          item.dateToString = that.formatTime(new Date(item.fxDate)).dailyToString
        })
        that.format7Days(res.daily)
        that.setData({
          daily: res.daily,
          today: res.daily[0],
          tomorrow: res.daily[1],
        })
        wx.hideLoading()
      }
    })
    wx.request({ // 获取生活指数
      url: 'https://devapi.qweather.com/v7/indices/1d?key=' + APIKEY + "&location=" + that.data.location + "&type=" + "1,2,3,4,5,6,8,9,13",
      success(result) {
        var res = result.data
        var daily=res.daily
        that.data.lifeStyles.forEach(item=>{
          daily.forEach(item1=>{
            if(item.type===item1.type){
              item.category=item1.category
              item.text=item1.text
            }
          })
        })
        that.setData({
          lifeDaily: daily,
          lifeStyles: that.data.lifeStyles
        })
      }
    })
    wx.request({ // 获取分钟级降水
      url: 'https://devapi.qweather.com/v7/minutely/5m?key=' + APIKEY + "&location=" + that.data.location,
      success(result) {
        var res = result.data
        that.setData({
          minutely: res.minutely,
          summary: res.summary
        })
      }
    })
  },
    // 点击按钮后初始化图表
  init: function () {
    const that=this
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    const dataMax=that.data.y7data1
    const dataMin=that.data.y7data2
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart,dataMax,dataMin);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  format7Days(data){
    var that = this
    let tempMin=[]
    let tempMax=[]
    data.forEach(function (item) {
      tempMin.push(item.tempMin)
      tempMax.push(item.tempMax)
    })
    that.setData({
      y7data1: tempMax,
      y7data2: tempMin,
    },
    ()=>{
      that.init()
    })
    // that.initCharts()

  },
  // 格式时间
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
    return {
      hourly: [hour, minute].map(this.formatNumber).join(":"),
      daily: [month, day].map(this.formatNumber).join("/"),
      dailyToString: isToday ? "今天" : weekArray[date.getDay()]
    }
  },
  formatUpdateTime(data){
    let updateTime=data
    let timeGapMS = new Date().getTime()-new Date(updateTime).getTime()
    let timeGapS = timeGapMS/1000
    let str=''
    if(timeGapS<60){
      str = timeGapS + '秒'        
    }else{
      str = Math.floor(timeGapS/60) + '分钟'
    }
    return str
  },
  // 补零
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
