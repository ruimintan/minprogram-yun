//index.js
const TianKey='c9a62c7ee499f0963ecdf3c03e64e44f' //天行数据APPKEY
const APIKEY = "07031f32f8b44d27a64702dbbbafb509";// 填入你申请的KEY
const WXAPI = require('../../wxapi/main')
const util = require('../../utils/util.js')
const amapFile = require('../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js

Page({
  data: {
    liveData:{},//天气数据
    dataList:null,//ONE一句
    englishList:null,//每日英语
    sentence:[],//每日一句
    artical:[],//每日一文
    bingUrl:'',//bing壁纸
    dateObj:{},
    city:'',
    nowWeather:'',
    temperature:'',
    articalDate:'20110310',
    searchDate:'',
    en_month:'Jan',
    historyTodayData:[], //历史上的今天
    resultToday:'', 
    englishAudio:'', 
    shareImage:'', 
    notPlayAudio:true, 
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
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  onLoad: function () {
    this.setData({
      dateObj: util.getArticalDate(),
      articalDate: util.getArticalDate().articalDate,
      searchDate: util.formatDate(),
      en_month: util.formatEnMonth(util.getArticalDate().month),
    },
    ()=>{
      this.getDataList()
    })
   
  },
  audioPlay: function () {
    if(!this.data.notPlayAudio){
      return false
    }
    console.log(this.audioCtx)
    this.audioCtx.play()
    this.setData({
     notPlayAudio:false
    })
  },
  funended: function () {//播放结束按钮函数
    console.log("播放结束")
    this.setData({
      notPlayAudio:true
    })
  },
  creatPoster(){ // 每日英语生成海报
    const shareImage=this.data.shareImage
    if(shareImage){
      wx.navigateTo({
        url: '../poster/poster?shareImage=' + shareImage,
      })
    }
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
      current: that.data.dataList.imgurl,//当前显示图片链接 
      urls: [that.data.dataList.imgurl], //要预览的图片
    })
    // wx.getImageInfo({
    //   src: that.data.dataList.imgurl,
    //   success(res){
    //     console.log(res)
    //   }
    // })
  },
  getEnImage:function (url) {
    let that = this;
    wx.getImageInfo({
      src: url,
      success: function (res) {
        console.log(res,'8888888888888888')
        that.setData({
          shareImage: res.path,
        })
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: '网络错误请重试',
          icon: 'loading'
        })
      }
    })
  },
  getDataList:function(){
    let that = this;
    wx.showLoading({
      "title": "加载中"
    });
    const params={
      key:TianKey,
      date: that.data.searchDate  
    }              
    WXAPI.getOneList(params).then(function (res) { //获取ONE
      console.log(res)
      if (res.code == 200) {
        that.setData({
          dataList: res.newslist[0],
        })
      }
    })
    WXAPI.getEnglishToday(params).then(function (res) { //获取每日英语
      console.log(res)
      if (res.code == 200) {
        that.setData({
          englishList: res.newslist[0],
          en_imgurl: res.newslist[0].imgurl,
          englishAudio: res.newslist[0].tts
        },
        ()=>{
          that.getEnImage(res.newslist[0].imgurl)
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
      }else{ // 请求失败回调
        that.getHistoryToday()
      }     
    }).catch(function (e) {
      console.log(e)
    })
  }
})
