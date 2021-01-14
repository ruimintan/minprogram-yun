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
  let now = new Date()
  let year = now.getFullYear(); //得到年份
  let month = now.getMonth();//得到月份
  let date = now.getDate();//得到日期
  month = month + 1
  if (month < 10) month = "0" + month
  if (date < 10) date = "0" + date
  let articalYear=year-9 // 每日一文年限-9获取
  let articalDate = articalYear + month + date
  let dateObj={
    articalDate:articalDate,
    year:year,
    month:month,
    date:date,
  }
 return dateObj
}

const formatEnMonth = (month) => {
  month = month.toString()
  let en_month="Jan"
  let month_arr = ['01','02','03','04','05','06','07','08','09','10','11','12']  
  let en_mon_arr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec"];  //英文月份
  for(var i = 0;i < month_arr.length;i ++){      //循环匹配
    if(month == month_arr[i]){
        en_month= en_mon_arr[i]
    }
  }
  return en_month
}

module.exports = {
  formatTime: formatTime,
  getArticalDate: getArticalDate,
  formatEnMonth: formatEnMonth,
}
