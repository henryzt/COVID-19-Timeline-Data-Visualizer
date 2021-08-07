import { graphic } from "echarts/core";

function formatter(value: Number): string {
  return value >= 100000 ? value.toExponential() : value.toString();
}

function getSeries(dataType: string, chartType: string, color: string, data: Array<any>) {
  return {
    name: dataType,
    data: data,
    type: chartType,
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
          color: color, // hex rgba
        },
        {
          offset: 1,
          color: "#fff",
        },
      ]),
    },
  };
}

function minimumChart(timeSeries: object, chartType: string, dataType: string, color: string) {
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
        formatter,
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
    series: [getSeries(dataType, chartType, color, data)],
  };
}

function fullChart(timeSeries: object, chartType: string, dataType: string, color: string) {
  const labels = Object.keys(timeSeries);
  const data = Object.values(timeSeries);

  const dataStart = chartType === "line" ? 30 : 50;
  return {
    xAxis: {
      type: "category",
      data: labels,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter,
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
        start: dataStart,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: [getSeries(dataType, chartType, color, data)],
  };
}

export function getChartOption(
  type: string,
  chartType: string,
  timeSeries: object,
  dataType: string,
  color: string
) {
  if (type == "full") {
    return fullChart(timeSeries, chartType, dataType, color);
  } else if (type == "minimum") {
    return minimumChart(timeSeries, chartType, dataType, color);
  }
}
