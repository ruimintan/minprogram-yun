//logs.js
const WXAPI = require('../../wxapi/main')
const util = require('../../utils/util.js')

Page({
  data: {
    artical:[],//每日一文
    content:'',
    articalDate:'20110408',
    bingUrl:'',//bing壁纸
  },
 
  onLoad: function (option) {
    if(option.isTodayArtical==true){
      this.setData({
        articalDate: util.getArticalDate().articalDate
      })
    }
    this.getArtical()
    this.getBing()
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

  getBing:function(){ // 获取bing壁纸
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.getBingPic().then(function (res) {
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
      var data=res.data
      console.log(data)
      var content=data.content
      content = content.replace(/\s+/gi, '')
      content = content
              .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
              .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
              .replace(/<p>/ig, '<p class="p_class">')
  
      that.setData({
        artical: data,
        content: content,
      }) 
      wx.hideLoading()
    }).catch(function (e) {
      console.log(e)
    })
  },
})
