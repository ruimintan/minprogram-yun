import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 解决小程序视图模糊的问题，必写
  });
  canvas.setChart(chart);

  var option = {
    color: ["#FB7821", "#1B9DFF"],
    grid: {
      containLabel: true,
      // x: -11,
      // x2: 15,
      // top: 14,
      // bottom: 15
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // show: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // axisLabel: {
      //   interval: 49
      // }
    },
    yAxis: {
      min: 'dataMin',
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
