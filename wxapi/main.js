// 小程序开发api接口统一配置
// 如果你的域名是： https://www.baidu.com/cn 那么这里只要填写 cn
let subDomain = ''  // 子域名,没有就等于''
const API_BASE_URL = 'https://'  // 主域名
 
const request = (url, method, data) => {
  let _url = API_BASE_URL + subDomain  + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}
 
/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}
 
module.exports = {
  request,
  // 首页
  getOneList: data => request('api.youngam.cn/api/one.php','get', data), //ONE一个接口
//   getOneList: data => request('api.tianapi.com/txapi/one/index?key='+ data,'get', data), //ONE一个接口
  getHitokoto: (data) => request('v1.hitokoto.cn/?c='+data,'get', data),   // 一言接口
  getBingPic: (data) => request('api.xygeng.cn/Bing/url/','get', data),   // bing每日图片
  getTodayArtical: (data) => request(
                            'interface.meiriyiwen.com/article/day?dev=1&date='+data,
                            'get', data),     // 每日一文 支持日期20110306-20200521
  getHistoryToday: (data) => request('www.ipip5.com/today/api.php?type='+ data,'get', data),   // 历史上的今天
  getEnglishToday: (data) => request('api.tianapi.com/txapi/everyday/index?key='+ data,'get', data),   // 每日一句英语
}