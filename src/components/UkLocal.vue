<template>
  <div>
    <UkRegionSection :NationData="nation"></UkRegionSection>
    <NearbyCasesFinder
      :regionData="utla"
      currentCountry="UK"
    ></NearbyCasesFinder>
  </div>
</template>

<script>
import UkRegionSection from "./UkRegionSection.vue";
import NearbyCasesFinder from "./NearbyCasesFinder.vue";

export default {
  name: "UkLocal",
  data() {
    return {
      nation: null,
      utla: null,
      display: null,
      chartData: null,
      overview: null,
    };
  },
  async mounted() {
    const queries = `{
        "date":"date",
        "areaName":"areaName",
        "areaCode":"areaCode",
        "admissions":"cumAdmissions",
        "admissionsNew":"newAdmissions",
        "hospitalCases":"hospitalCases",
        "covidOccupiedMVBeds":"covidOccupiedMVBeds",
        "confirmedRate":"cumCasesByPublishDateRate",
        "confirmedNew":"newCasesByPublishDate",
        "confirmedNewBySpecimen":"newCasesBySpecimenDate",
        "confirmed":"cumCasesByPublishDate",
        "confirmedBySpecimen":"cumCasesBySpecimenDate",
        "deathNewBySpecimen":"newDeaths28DaysByDeathDate",
        "deathNew":"newDeaths28DaysByPublishDate",
        "death":"cumDeaths28DaysByPublishDate",
        "deathRate":"cumDeaths28DaysByPublishDateRate",
        "testedNew":"newTestsByPublishDate",
        "tested":"cumTestsByPublishDate"
    }`
      .replaceAll(" ", "")
      .replaceAll("\n", "");

    const structure = "&structure=" + encodeURIComponent(queries);
    const baseUrl =
      "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=";

    const nationRes = await fetch(`${baseUrl}nation${structure}`);
    const nation = await nationRes.json();
    this.nation = nation.data;

    const overviewRes = await fetch(`${baseUrl}overview${structure}`);
    const overview = await overviewRes.json();
    this.overview = overview.data;

    this.loadUkRealtimeDisplay();

    const utlaRes = await fetch(
      `${baseUrl}utla&latestBy=newCasesByPublishDate${structure}`
    );
    const utla = await utlaRes.json();
    this.utla = utla.data;

    this.reportLocalData()
  },
  methods: {
    loadUkRealtimeDisplay() {
      let latest = this.overview[0];
      this.display = {
        confirmed: latest.confirmed,
        confirmedChange: latest.confirmedNew,
        deaths: latest.death,
        deathsChange: latest.deathNew,
        admission: latest.hospitalCases,
        admissionChange: latest.admissionsNew,
      };
      this.chartData = this.overview.reverse();
    },
    reportLocalData(){
      const tableData = this.utla.map(e => ({
        locationName: e.areaName,
        cases: e.confirmed,
        deaths: e.death,
        active: e.hospitalCases,
        critical: e.covidOccupiedMVBeds,
        tested: e.tested,
        admission: e.hospitalCases,
        todayCases: e.confirmedNew,
        todayDeaths: e.deathNew,
        todayTested: e.testedNew,
        todayAdmission: e.admissionsNew,
        casesPerOneMillion: e.confirmedRate,
        deathPerOneMillion: e.deathRate
      }))

      const localData = {
        tableData
      }
      
      this.$emit("localDataReady", localData)
    }
  },
  components: {
    UkRegionSection,
    NearbyCasesFinder,
  },
};
</script>

<style scoped>
</style>