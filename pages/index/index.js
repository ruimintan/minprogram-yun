//index.js
Page({
  data: {
    hiddenLoading:true,
    leftSign:"《",
    rightSign:"》",
    dataList:[],//ONE近七日数据
    sentence:[],//每日一句
    artical:[],//每日一文
  },
  //事件处理函数
  openArtical: function () {
   wx.navigateTo({
     url: '../articals/index',
   })
  },

  onLoad: function () {
    this.getDataList()
    this.getSentence()
    this.getArtical()
  },
  changeHidden: function(){
    this.setData({
        hiddenLoading: !this.data.hiddenLoading
    });
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
  getArtical:function(){ // 获取每日一文
    var that = this
    wx.request({
      url:"https://interface.meiriyiwen.com/article/today?dev=1",
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
