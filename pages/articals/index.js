//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    hiddenLoading:true,
    artical:[],//每日一文
    content:'',
    articalDate:'20110310',
    bingUrl:'',//bing壁纸
  },
 
  onLoad: function () {
    this.getArtical()
    this.getBing()
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
      current: that.data.bingUrl,//当前显示图片链接 
      urls: [that.data.bingUrl], //要预览的图片
    })
    wx.getImageInfo({
      src: that.data.bingUrl,
      success(res){
        console.log(res)
      }
    })
  },
  getArticalDate: function(){
    var now = new Date()
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    month = month + 1
    if (month < 10) month = "0" + month
    if (date < 10) date = "0" + date
    year=year-9 // 每日一文年限-9获取
    var articalDate = year + month + date
    this.setData({
      articalDate: articalDate
    });
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
    this.changeHidden()
    var that = this
    that.getArticalDate()
    wx.request({
      // url:"https://interface.meiriyiwen.com/article/today?dev=1",
      // url：https://interface.meiriyiwen.com/article/day?dev=1&date= + 日期
      //  每日一文api支持日期20110306-20200521
      url:"https://interface.meiriyiwen.com/article/day?dev=1&date=" + that.data.articalDate,
      success:function(res){
        var data=res.data.data
        console.log(data)
        var content=data.content
        content = content.replace(/\<p>/gi, '<p class="p_class">')
        that.setData({
          artical: data,
          content: content,
        }) 
       
        that.changeHidden()   
      },
      fail:function(err){
        console.log(err)
        that.changeHidden()
      }
    })
  },
})
