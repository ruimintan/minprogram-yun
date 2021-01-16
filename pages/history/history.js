//logs.js
const WXAPI = require('../../wxapi/main')
const util = require('../../utils/util.js')

Page({
  data: {
    historyTodayData:[], //历史上的今天
    resultToday:'', 
  },
 
  onLoad: function (data) {
 
    wx.setNavigationBarTitle({
      title: data.today
    })
    this.getHistoryToday()
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
