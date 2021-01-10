//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    hiddenLoading:true,
    artical:[],//每日一文
    content:''
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
