var app = new Vue({
  el: "#app",
  data: {
    message: "Test",
    dataNow: null,
  },
});

fetch("https://api.covid19uk.live/").then(async (res) => {
  let data = await res.json();
  app.dataNow = data.data;
});
