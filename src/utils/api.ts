const apiUrl = "https://disease.sh/v3/covid-19/";

async function request(endpoint: string){
  const response = await fetch(apiUrl + endpoint);
  return response.json();
}

export function getTodayOverview() {
  return request(`all`);
}

export function getAllCountryData() {
  return request(`countries`);
}

export function getCounrtyData(counrty: string) {
  return request(`countries/${counrty}`);
}

export function getTimeSeries(counrty: string) {
  return request(`historical/${counrty}`);
}
