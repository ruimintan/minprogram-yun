//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    hiddenLoading:true,
    artical:[],//每日一文
  },
 
  onLoad: function () {
    this.getArtical()
  },
  changeHidden: function(){
    this.setData({
        hiddenLoading: !this.data.hiddenLoading
    });
  },
  getArtical:function(){ // 获取每日一文
    this.changeHidden()
    var that = this
    wx.request({
      url:"https://interface.meiriyiwen.com/article/today?dev=1",
      success:function(res){
        var data=res.data.data
        console.log(data)
        that.setData({
          artical: data,
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
