//index.js
const APIKEY = "07031f32f8b44d27a64702dbbbafb509";// 填入你申请的KEY
const WXAPI = require('../../wxapi/main')
const util = require('../../utils/util.js')
const jinrishici = require('../../utils/jinrishici.js')
const amapFile = require('../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js

Page({
  data: {
    liveData:{},//天气数据
    dataList:[],//ONE近七日数据
    sentence:[],//每日一句
    jinrishici:[],//今日诗词
    artical:[],//每日一文
    bingUrl:'',//bing壁纸
    dateObj:{},
    city:'',
    nowWeather:'',
    temperature:'',
    articalDate:'20110310',
    en_month:'Jan',
    historyTodayData:[], //历史上的今天
    resultToday:'', 
  },
  //事件处理函数
  openArtical: function () {
   wx.navigateTo({
     url: '../articals/articals',
   })
  },
  // 打开历史上的今天
  openHistory: function () {
    var that = this;
    let today=that.data.resultToday
    if(that.data.historyTodayData.length>0){
      wx.navigateTo({
        url: '../history/history?today='+ today,
      })
    }else{
      return false
    }
   },
   openQweather: function () {
    wx.navigateTo({
      url: '../weather/weather',
    })
   },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation()
  },
  onLoad: function () {
    jinrishici.load(result => {
      // 下面是处理逻辑示例
      console.log(result)
      this.setData({"jinrishici": result.data.content})
    })
    this.setData({
      dateObj: util.getArticalDate(),
      articalDate: util.getArticalDate().articalDate,
      en_month: util.formatEnMonth(util.getArticalDate().month),
    })
    this.getDataList()
  },
   /**
   * 获取定位
   */
  getLocation() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res,'0000000000000000')
        that.setData({
          location: res.longitude + "," + res.latitude
        })
        that.getQweather()
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
                    that.getQweather()
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
                  that.getQweather()
                  that.getCityByLoaction()
                }
              })
            } else if (mRes.cancel) {
              that.setData({
                location: "116.41,39.92"
              })
              that.getQweather()
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
            // City: data.adm2,
            // County: data.name
            city: data.name
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
 // 获取和风天气
  getQweather() {
    var that = this
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now?key=' + APIKEY + "&location=" + that.data.location,
      success(result) {
        var res = result.data
        // console.log(res,'=====0000000000000000===============')
        that.setData({
          // now: res.now,
          temperature: res.now.temp,
          nowWeather: res.now.text,
        })
      }
    })
  },
/**
   * 长按预览保存图片到本地
   */
  previewImage:function(e){
    var that = this;
    wx.previewImage({
      current: that.data.dataList[0].src,//当前显示图片链接 
      urls: [that.data.dataList[0].src], //要预览的图片
    })
    wx.getImageInfo({
      src: that.data.dataList[0].src,
      success(res){
        console.log(res)
      }
    })
  },
  getDataList:function(){
    let that = this;
    wx.showLoading({
      "title": "加载中"
    });                  
    WXAPI.getOneList().then(function (res) { //获取ONE
      if (res.code == 200) {
        that.setData({
          dataList: res.data,
        })
      }
    })
    WXAPI.getHitokoto('i').then(function (res) { // 获取每日诗词
      console.log(res)
      that.setData({
        sentence: res,
      })
    })
    WXAPI.getBingPic().then(function (res) { // 获取bing壁纸
      console.log(res)
      if (res.code == 200) {
        that.setData({
          bingUrl: res.data,
        })
      }
    })
    // 获取每日一文
    const data=that.data.articalDate
    WXAPI.getTodayArtical(data).then(function (res) {
      console.log(res)
        that.setData({
          artical: res.data,
        })
    })
    // 获取历史上的一天
    WXAPI.getHistoryToday('json').then(function (res) {
      console.log(res)
      if(res.result){
        that.setData({
          resultToday: res.today,
          historyTodayData: res.result,
        })
        wx.hideLoading()
      }else{ // 请求失败回调
        that.getHistoryToday()
      }      
    }).catch(function (e) {
      console.log(e)
      that.getHistoryToday()
    })
  },
  getHistoryToday(){
    let that = this;
    WXAPI.getHistoryToday('json').then(function (res) {
      console.log(res)
      if(res.result){
        that.setData({
          resultToday: res.today,
          historyTodayData: res.result,
        })
        wx.hideLoading()
      }   
    }).catch(function (e) {
      console.log(e)
    })
  }
})
