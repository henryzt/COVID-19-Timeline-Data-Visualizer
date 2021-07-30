const apiUrl = "https://disease.sh/v3/covid-19/";

async function request(endpoint: string): Promise<any> {
  const response = await fetch(apiUrl + endpoint);
  return response.json();
}

export async function getAllCountryData() {
  const countries = await request(`countries`);
  countries.forEach((e) => {
    e.locationName = e.country;
  });
  return countries;
}

export async function getOverviewData(country: string) {
  let result, outdated;
  if (country === "all") {
    result = await request(`all?yesterday=true`);
    outdated = true;
  } else {
    result = await request(`countries/${country}`);
    if (result.todayCases == 0) {
      result = await request(`countries/${country}?yesterday=true`);
      outdated = true;
    } else {
      outdated = false;
    }
  }
  return  { ...result, outdated };
}

export async function getTimeSeries(country: string) {
  let data = await request(`historical/${country}?lastdays=all`);
  data = data.country ? data.timeline : data;
  // get active cases time series
  data.active = { ...data.cases };
  for (let i in data.cases) {
    data.active[i] = data.cases[i] - data.deaths[i] - data.recovered[i];
  }
  // get daily time series
  for (let key of Object.keys(data)) {
    const timeSeries = data[key];
    const dailyTimeSeries = {};
    const tsEntires = Object.entries(timeSeries);
    let lastNumber = 0;
    for (const [key, value] of tsEntires) {
      let diff = value - lastNumber;
      dailyTimeSeries[key] = diff > 0 ? diff : 0;
      lastNumber = value;
    }
    data[key + "Daily"] = dailyTimeSeries;
  }
  return data;
}

export function getCountryList(allCountryData: Array<any>, t:any) {
  let array = [
    {
      label: t("dropdown.popular"),
      value: "divider0",
      disabled: true,
    },
    {
      label: t("dropdown.world"),
      value: "all",
    },
    {
      label: t("dropdown.uk"),
      value: "UK",
    },
    {
      label: t("dropdown.us"),
      value: "USA",
    },
    {
      label: t("dropdown.all"),
      value: "divider1",
      disabled: true,
    },
  ];

  if (allCountryData?.length > 0) {
    const popularCountries = array.map((i) => i.value);

    const countryList = allCountryData
      .filter(i => !popularCountries.includes(i.country))
      .map((i) => ({ label: i.country, value: i.country }));

    array = array.concat(countryList);
  } else {
    const loading = {
      label: "Country List Loading...",
      value: "divider2",
      disabled: true,
    };

    array.push(loading);
  }

  return array;
}
