Vue.component("apexchart", VueApexCharts);

// written by https://github.com/DaviesXue/UCLCSSA_COVID19

function renderConfirmedChart(showLabel) {
  app.confirmedAndDeathChart = {
    series: [
      {
        name: "总确诊",
        data: app.dataHistory.map((a) => {
          return a.confirmed;
        }),
      },
      {
        name: "总死亡",
        data: app.dataHistory.map((a) => {
          return a.death;
        }),
      },
    ],
    options: {
      chart: {
        id: "confirmedAndDeathChart",
        height: 350,
        type: "line",
        zoom: {
          enabled: true,
        },
      },
      colors: ["#3d0707", "#ff0000"],
      dataLabels: {
        enabled: showLabel,
      },
      stroke: {
        curve: "smooth",
      },

      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        type: "datetime",
        categories: app.dataHistory.map((a) => {
          return a.date;
        }),
        labels: {
          format: "dd/MM",
          rotate: -10,
        },
      },
    },
  };
}
