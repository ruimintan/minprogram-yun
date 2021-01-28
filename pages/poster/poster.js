
// const util = require('../../utils/util.js')

Page({
  data: {
    shareImgPath:'',
    posterUrl:'',
    qrcode:'../../assets/images/qrcode.jpg',
  },

  onLoad: function (data) {  
    this.setData({
      shareImgPath:data.shareImage
    },
    ()=>{
      var query = wx.createSelectorQuery()
      query.select('#canvasPoster').boundingClientRect((res) => {
        // 返回值包括画布的实际宽高
        this.drawImage(res)
      }).exec()
    })
  },
  drawImage (canvasAttrs){
    var context = wx.createCanvasContext('canvasPoster',this)
    let canvasW = canvasAttrs.width // 画布的真实宽度
    let canvasH = canvasAttrs.height //画布的真实高度

    context.fillStyle="#FFFFFF";
    context.fillRect(0,0,canvasW,canvasH);
    context.drawImage(this.data.shareImgPath, 10, 10, 290, 380)
    context.save()
    // 绘制二维码
    context.drawImage(this.data.qrcode, 190, 400, 80, 80)
    context.save()

    context.setFillStyle('#333333')
    context.setFontSize(14) // 文字字号：22px 20
    context.fillText('初云小程序', 92, 428);
    context.setFillStyle('#666666')
    context.setFontSize(10)
    context.fillText('by: ruimin.tan', 96, 442);
    context.setFillStyle('#666666')
    context.setFontSize(12)
    context.fillText('长按识别二维码', 76, 468);
    context.draw()

    setTimeout(() => {
      const that=this
      wx.canvasToTempFilePath({
        canvasId: 'canvasPoster',
        success: (res) => {
          const canvasToTempFilePath = res.tempFilePath // 返回的图片地址保存到一个全局变量里
          that.setData({
            posterUrl: canvasToTempFilePath
          })
        }
      })
    }, 200)
  },
  savePoster () {
    if (this.data.posterUrl) {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.posterUrl,
        success: (result) => {
          wx.showToast({
            title: '海报已保存，快去分享给好友吧。',
            icon: 'none'
          })
        }
      })
    }
  }
})

