//index.js
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
    articalDate:'20110310',
    en_month:'Jan',
    historyTodayData:[], //历史上的今天
    resultToday:'', 
  },
  //事件处理函数
  openArtical: function () {
   wx.navigateTo({
     url: '../articals/index',
   })
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
    this.getSentence()
    this.getArtical()
    this.getBing()
    this.getWeather()
    this.getHistoryToday()
  },
  getWeather: function(){
    var that = this;
    var myAmapFun = new amapFile.AMapWX({key:'7fc877b9234e8ec91b38db35f3816e09'});
    myAmapFun.getWeather({
      success: function(data){ //成功回调      
        that.setData({
          liveData: data.liveData
        })  
      },
      fail: function(info){ //失败回调     
        console.log(info)       
        wx.showToast({ title: '天气信息获取失败！' })
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
  getDataList:function(){ //获取ONE
    let that = this;
    wx.showLoading({
      "title": "加载中"
    });                  
    WXAPI.getOneList().then(function (res) {
      if (res.code == 200) {
        that.setData({
          dataList: res.data,
        })
      }
      wx.hideLoading()
    }).catch(function (e) {
      console.log(e)
    }) 
  },
  getSentence:function(){ // 获取每日诗词
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.getHitokoto('i').then(function (res) {
      console.log(res)
      that.setData({
        sentence: res,
      })
      wx.hideLoading()
    }).catch(function (e) {
      console.log(e)
    })
  },
  getBing:function(){ // 获取bing壁纸
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.getBingPic().then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          bingUrl: res.data,
        })
      }
      wx.hideLoading()
    }).catch(function (e) {
      console.log(e)
    })
  },
  getArtical:function(){ // 获取每日一文
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    const data=that.data.articalDate
    WXAPI.getTodayArtical(data).then(function (res) {
      console.log(res)
        that.setData({
          artical: res.data,
        })
      wx.hideLoading()
    }).catch(function (e) {
      console.log(e)
    })
  },

  getHistoryToday:function(){ // 获取历史上的今天
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.getHistoryToday('json').then(function (res) {
      console.log(res)
      if(res.result){
        that.setData({
          resultToday: res.today,
          historyTodayData: res.result,
        })
      }else{ // 请求失败回调
        that.getHistoryToday()
      }      
      wx.hideLoading()
    }).catch(function (e) {
      console.log(e)
      that.getHistoryToday()
    })
  },
})
