import { graphic } from "echarts/core";

function formatter(value:Number){
    return value >= 100000 ? value.toExponential() : value;
}

function lineSeries(dataType: string, color: string, data: Array<any>){
  return  {
    name: dataType,
    data: data,
    type: "line",
    itemStyle: {
      color: color,
    },
    lineStyle: {
      color: color,
    },
    areaStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: color + "a0", // hex rgba
        },
        {
          offset: 1,
          color: color + "09",
        },
      ]),
    },
  }
}

function minimumLineChart(timeSeries: object, dataType: string, color: string) {
  const labels = Object.keys(timeSeries);
  const data = Object.values(timeSeries);

  return {
    xAxis: {
      show: false,
      type: "category",
      data: labels,
    },
    yAxis: {
      show: false,
      type: "value",
      axisLabel: {
        formatter
      },
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
      height: 150,
    },
    series: [
      lineSeries(dataType, color, data)
    ],
  };

}


function fullLineChart(timeSeries: object, dataType: string, color: string) {
  const labels = Object.keys(timeSeries);
  const data = Object.values(timeSeries);

  return {
    xAxis: {
      type: "category",
      data: labels,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter
      },
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      right: 5,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 50,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: [
      lineSeries(dataType, color, data)
    ],
  };

}

export function getChartOption(type: string, timeSeries: object, dataType: string, color: string){
  if (type == "full") {
    return fullLineChart(timeSeries, dataType, color);
  } else if (type == "minimum") {
    return minimumLineChart(timeSeries, dataType, color);
  }
}