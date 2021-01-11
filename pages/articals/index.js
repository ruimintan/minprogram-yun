//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    hiddenLoading:true,
    artical:[],//每日一文
    content:'',
    articalDate:'20110310'
  },
 
  onLoad: function () {
    this.getArtical()
  },
  changeHidden: function(){
    this.setData({
        hiddenLoading: !this.data.hiddenLoading
    });
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
