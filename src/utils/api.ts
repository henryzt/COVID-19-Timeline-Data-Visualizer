const apiUrl = "https://disease.sh/v3/covid-19/";

async function request(endpoint: string) {
  const response = await fetch(apiUrl + endpoint);
  return response.json();
}

export function getAllCountryData() {
  return request(`countries`);
}

export async function getOverviewData(counrty: string) {
  let result, outdated;
  if (counrty === "all") {
    result = request(`all?yesterday=true`);
    outdated = true;
  } else {
    result = await request(`countries/${counrty}`);
    if (result.todayCases == 0) {
      result = request(`countries/${counrty}?yesterday=true`);
      outdated = true;
    }else{
      outdated = false;
    }
  }
  return Object.assign(result, { outdated });
}

export function getTimeSeries(counrty: string) {
  return request(`historical/${counrty}`);
}

export function getCountryList(allCountryData: Array<any>) {
  let array = [
    {
      label: "Popular",
      value: "divider0",
      disabled: true,
    },
    {
      label: "🌍 Worldwide",
      value: "all",
    },
    {
      label: "🇬🇧 United Kingdom",
      value: "UK",
    },
    {
      label: "🇺🇸 United States",
      value: "USA",
    },
    {
      label: "All Countries and regions",
      value: "divider1",
      disabled: true,
    },
  ];

  if (allCountryData?.length > 0) {
    const popularCountries = array.map((i) => i.value);

    const countryList = allCountryData
      .filter((i) => !popularCountries.includes(i.country))
      .map((i) => {
        return { label: i.country, value: i.country };
      });

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
