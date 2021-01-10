//index.js
Page({
  data: {
    dialogShow: false,
    buttons: [{text: '取消'}, {text: '确认'}],
  },
  //事件处理函数
  openConfirm: function () {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton: function(e) {
    this.setData({
      dialogShow: false
    })
  },
  onLoad: function () {

  },

})
