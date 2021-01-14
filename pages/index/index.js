//index.js
const util = require('../../utils/util.js')
const jinrishici = require('../../utils/jinrishici.js')
const amapFile = require('../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js

Page({
  data: {
    hiddenLoading:true,
    liveData:{},//天气数据
    dataList:[],//ONE近七日数据
    sentence:[],//每日一句
    jinrishici:[],//今日诗词
    artical:[],//每日一文
    bingUrl:'',//bing壁纸
    dateObj:{},
    articalDate:'20110310',
    en_month:'Jan',
    indicatorDots: false, // 指示点
    autoplay: false, // 是否自动切换
    interval: 2000, // 自动切换时间间隔
    duration: 500, // 滑动动画时长
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
  },
  getWeather: function(){
    var that = this;
    var myAmapFun = new amapFile.AMapWX({key:'7fc877b9234e8ec91b38db35f3816e09'});
    myAmapFun.getWeather({
      success: function(data){
        //成功回调
        that.setData({
          liveData: data.liveData
        })  
      },
      fail: function(info){
        //失败回调
        console.log(info)       
        wx.showToast({ title: '天气信息获取失败！' })
      }
    })
  },
  changeHidden: function(){
    this.setData({
        hiddenLoading: !this.data.hiddenLoading
    });
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
    var that = this
    this.changeHidden()
    wx.request({
      url:"https://api.youngam.cn/api/one.php",
      success:function(res){
        var data=res.data.data
        console.log(data)
        that.setData({
          dataList: data
        })  
        that.changeHidden()     
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  getSentence:function(){ // 获取每日诗词
    var that = this
    wx.request({
      url:"https://v1.hitokoto.cn/?c=i",
      success:function(res){      
        var data=res.data
        console.log(data)
        that.setData({
          sentence: data,
        })      
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  getBing:function(){ // 获取bing壁纸
    var that = this
    wx.request({
      url:"https://api.xygeng.cn/Bing/url/",
      success:function(res){    
        var data=res.data.data
        that.setData({
          bingUrl: data,
        })      
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
 
  getArtical:function(){ // 获取每日一文
    var that = this
    wx.request({
      // url:"https://interface.meiriyiwen.com/article/today?dev=1",
      // url：https://interface.meiriyiwen.com/article/day?dev=1&date= + 日期
      //  每日一文api支持日期20110306-20200521
      url:"https://interface.meiriyiwen.com/article/day?dev=1&date="+ that.data.articalDate,
      success:function(res){
        var data=res.data.data
        console.log(data)
        that.setData({
          artical: data,
        })      
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
})
