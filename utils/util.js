const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getArticalDate = ()=>{
  var now = new Date()
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  month = month + 1
  if (month < 10) month = "0" + month
  if (date < 10) date = "0" + date
  year=year-9 // 每日一文年限-9获取
  var articalDate = year + month + date
 return articalDate
}

module.exports = {
  formatTime: formatTime,
  getArticalDate: getArticalDate,
}
