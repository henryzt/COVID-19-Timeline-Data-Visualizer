var app = new Vue({
  el: "#app",
  data: {
    message: "Test",
    dataNow: null,
    dataHistory: null,
    confirmedAndDeathChart: null,
  },
});

fetch("https://api.covid19uk.live/").then(async (res) => {
  let data = await res.json();
  app.dataNow = data.data;
});

fetch("https://api.covid19uk.live/historyfigures").then(async (res) => {
  let data = await res.json();
  app.dataHistory = data.data;
  renderConfirmedChart();
});
