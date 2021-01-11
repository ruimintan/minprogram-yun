//index.js
Page({
  data: {
    hiddenLoading:true,
    leftSign:"《",
    rightSign:"》",
    dataList:[],//ONE近七日数据
    sentence:[],//每日一句
    artical:[],//每日一文
    articalDate:'20110310'
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
    var that = this
    that.getArticalDate()
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
