interface CountryListItem {
  label: any;
  value: string;
  disabled?: boolean;
}

interface DataItem {
  country?: string;
  locationName?: string;
  updated: number;
  cases: number;
  deaths: number;
  active: number;
  critical: number;
  recovered: number;
  tests: number;
  todayCases: number;
  todayDeaths: number;
  todayRecovered: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  testsPerOneMillion: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  population: number;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  affectedCountries: number;
  outdated?: boolean;
}

interface TimeseriesItem {
  [index: string]: number
}

interface Timeseries {
  active: TimeseriesItem;
  activeDaily: TimeseriesItem;
  cases: TimeseriesItem;
  casesDaily: TimeseriesItem;
  deaths: TimeseriesItem;
  deathsDaily: TimeseriesItem;
  recovered: TimeseriesItem;
  recoveredDaily: TimeseriesItem;
  [index: string]: TimeseriesItem;
}

interface LocalData {
  tableData: DataItem[];
}

interface Branding {
  mainTitle: string;
  title: string;
  additionalLink: {
    title: string;
    linkTitle: string;
    url: string;
  };
  img: string;
  line1: string;
  line2: string;
  urlLine1: string;
  url: string;
  urlLine2: string;
}
