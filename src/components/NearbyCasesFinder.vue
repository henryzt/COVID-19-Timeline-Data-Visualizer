<template>
  <div class="title">{{ $t("subtitles.nearby") }}</div>
  <n-spin :show="loading">
    <div class="block nearby-block">
      <div style="display: flex; align-items: center; margin-bottom: 20px">
        <n-button circle size="large" type="primary" @click="locateUserGPS">
          <n-icon size="20" style="width:50px">
            <Navigate />
          </n-icon>
        </n-button>

        <div style="margin: 0 20px; width: 100%">
          <!-- <vSelect
          v-if="currentCountry==='UK' && regionData"
          class="select"
          :clearable="false"
          :options="regionData"
          label="areaName"
          :value="inputValue"
          @input="inputValue=$event.areaName;findUKPostcode();"
          :placeholder="$t('nearBy.ukPlaceholder')"
          :clearSearchOnBlur="()=>false"
          push-tags
          taggable
        ></vSelect> -->
          <n-select
            v-if="currentCountry === 'UK' && regionData"
            filterable
            tag
            :placeholder="$t('nearBy.ukPlaceholder')"
            :options="selectOptions"
            :value="inputValue"
            @update:value="
              inputValue = $event;
              findUKPostcode();
            "
          />
          <!-- <vSelect
          v-else-if="mainLocation"
          class="select"
          :clearable="false"
          :value="usDropdownValue"
          :options="mainLocation"
          label="Combined_Key"
          @input="findUSCounty"
          placeholder="Search..."
        ></vSelect> -->
          <div v-else style="text-align: center">Loading...</div>
        </div>

        <n-button type="primary" style="width: 100px" @click="findUKPostcode">
          {{ $t("nearBy.search") }}
        </n-button>
      </div>
      <!-- <div
        v-if="displayInfo === $t('nearBy.locating')"
        style="margin: 5px; text-align: center"
      >
        <div
          class="spinner-border text-primary"
          style="width: 2rem; height: 2rem"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </div> -->
      <div
        class="displayInfo"
        style="text-align: center"
        v-html="displayInfo"
      ></div>

      <div
        v-if="isResult"
        style="text-align: center; margin-top: 20px; color: silver"
      >
        <n-a
          href="javascript: void(0)"
          v-if="currentCountry === 'US'"
          @click="switchStateCounty"
        >
          {{ $t("nearBy.switchCountyState") }}
          <br />
        </n-a>
        <!-- <n-a href="#regionData">{{ $t("nearBy.goToRegional") }}</n-a> -->
        <!-- <div v-if="$i18n.locale !== 'zh'">
        <hr />
        share
        <ShareIcons style="margin-top: 20px;" :title="displayInfo"></ShareIcons>
      </div> -->
      </div>
    </div>
  </n-spin>
</template>

<script>
import { NSelect, NButton, NA, NSpin, NIcon } from "naive-ui";
import { Navigate } from "@vicons/ionicons5";

const getGetOrdinal = function (n) {
  //ref https://community.shopify.com/c/Shopify-Design/Ordinal-Number-in-javascript-1st-2nd-3rd-4th/td-p/72156
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default {
  name: "NearbyCasesFinder",
  props: ["regionData", "currentCountry"],
  components: {
    NSelect,
    NButton,
    NA,
    NSpin,
    NIcon,
    Navigate
  },
  data: function () {
    return {
      inputValue: null,
      displayInfo:
        "<div style='opacity: 0.7; font-size: 14px;'>" +
        (this.currentCountry === "UK"
          ? this.$t("nearBy.ukDefault")
          : this.$t("nearBy.usDefault")) +
        "</div>",
      mainLocation: null,
      statesLocation: null,
      usInfo: {
        county: null,
        state: null,
      },
      isResult: false,
      usDropdownValue: null,
    };
  },
  methods: {
    findUKPostcode() {
      this.isResult = false;
      if (!this.inputValue) {
        this.displayInfo = this.$t("nearBy.empty");
        return;
      }
      window.ga("send", "event", "nearby", "postcode", this.inputValue);
      if (this.findByUKRegionName(this.inputValue, null, true)) return;
      this.displayInfo = this.$t("nearBy.locating");
      fetch("https://api.postcodes.io/postcodes/" + this.inputValue).then(
        async (res) => {
          let data = await res.json();
          // console.log(data);

          if (data.status == 200) {
            this.findByUKRegionName(
              data.result.nhs_ha,
              data.result.admin_district
            );
          } else {
            window.ga(
              "send",
              "event",
              "nearby",
              "uk-postcode-notfound",
              this.inputValue
            );
            this.displayInfo = this.$t("nearBy.postcodeErr");
          }
        }
      );
    },
    findByUKRegionName(regionName, district, slient) {
      let res = this.regionData.filter(
        (obj) => obj.areaName == regionName || obj.areaName == district
      );
      if (res && res[0]) {
        let location = res[0];
        let index = this.regionData.findIndex(
          (obj) => obj.areaName === location.areaName
        );
        this.displayInfo = this.$t("nearBy.ukResult", [
          location.areaName,
          location.confirmed,
          location.confirmedNew,
          getGetOrdinal(index + 1),
          location.confirmedRate ?? "-",
          location.death ?? "-",
          location.deathNew ?? "-",
        ]);
        window.ga(
          "send",
          "event",
          "nearby",
          "uk-region-found",
          location.areaName + ", " + regionName + ", " + district
        );
        this.isResult = true;
        return true;
      } else {
        if (slient) return false;
        this.displayInfo = this.$t("nearBy.notFound", [regionName]);
        window.ga(
          "send",
          "event",
          "nearby",
          "uk-region-notfound",
          regionName + ", " + district
        );
      }
    },
    locateUserGPS() {
      this.isResult = false;
      window.ga("send", "event", "nearby", "start-locating", "");
      if (navigator.geolocation) {
        this.displayInfo = this.$t("nearBy.locating");
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            window.ga(
              "send",
              "event",
              "nearby",
              "location-found",
              JSON.stringify(position)
            );
            if (this.currentCountry === "UK") {
              this.getUKPostcodeUsingLocation(position);
            } else {
              await this.getUSLocationData();
              this.calculateDistanceFromLocation(position);
            }
          },
          () => {
            window.ga("send", "event", "nearby", "location-rejected", "");
            this.displayInfo = this.$t("nearBy.rejected");
          }
        );
      } else {
        window.ga("send", "event", "nearby", "location-unsupported", "");
        this.displayInfo = this.$t("nearBy.unsupported");
      }
    },
    getUKPostcodeUsingLocation(position) {
      let requestUrl = `https://api.postcodes.io/postcodes?lon=${position.coords.longitude}&lat=${position.coords.latitude}`;
      fetch(requestUrl).then(async (res) => {
        window.ga("send", "event", "nearby", "location-found", requestUrl);
        let data = await res.json();
        if (data.result && data.result[0]) {
          this.inputValue = data.result[0].postcode;
          window.ga(
            "send",
            "event",
            "nearby",
            "uk-postcode-found",
            this.inputValue
          );
          this.findUKPostcode();
        } else {
          window.ga("send", "event", "nearby", "location-invalid", requestUrl);
          this.displayInfo = this.$t("nearBy.notUk");
        }
      });
    },
    async getUSLocationData() {
      return new Promise((resolve) => {
        if (this.mainLocation) {
          resolve(this.mainLocation);
          return;
        }
        fetch(`https://uk.henryzt.com/covid/us.php`).then(async (res) => {
          let data = await res.json();
          const csv = require("csvtojson");
          let json = await csv().fromString(data.global);
          let usStates = await csv().fromString(data.us);
          // console.log(json, usStates);
          this.mainLocation = json.filter((ele) => ele.Country_Region === "US");
          this.statesLocation = usStates.sort((a, b) => b.Active - a.Active);
          resolve(json);
        });
      });
    },
    calculateDistanceFromLocation(position) {
      const calculateDist = (lat1, lon1, lat2, lon2) => {
        let p = 0.017453292519943295; // Math.PI / 180
        let c = Math.cos;
        let a =
          0.5 -
          c((lat2 - lat1) * p) / 2 +
          (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
      };

      const getClosest = (inputList) => {
        let list = inputList.sort((a, b) => b.Active - a.Active);
        let min = { distance: Infinity };
        for (let region of list) {
          region.distance = calculateDist(
            region["Lat"],
            region["Long_"],
            position.coords.latitude,
            position.coords.longitude
          );
          if (region.distance < min.distance) {
            min = region;
          }
        }
        min.idx = list.findIndex((ele) => ele === min) + 1;
        // console.log(list,min);

        if (min.Testing_Rate) {
          let tRateList = list.sort((a, b) => b.Testing_Rate - a.Testing_Rate);
          min.tRateRank = tRateList.findIndex((ele) => ele.UID === min.UID) + 1;
        }
        return min;
      };

      let usCounties = this.mainLocation;
      let cmin = getClosest(usCounties); // county min
      let smin = getClosest(this.statesLocation); // state min

      if (cmin.distance > 500) {
        this.displayInfo = this.$t("nearBy.notUs");
        window.ga(
          "send",
          "event",
          "nearby",
          "not-us",
          cmin.Combined_Key + " - " + cmin.distance
        );
        return;
      }

      window.ga(
        "send",
        "event",
        "nearby",
        "us-county-found",
        cmin.Combined_Key
      );

      this.usDropdownValue = cmin.Combined_Key;

      this.usInfo.county = this.$t("nearBy.usResult", [
        cmin.Combined_Key,
        cmin.Active,
        cmin.Confirmed,
        cmin.Deaths,
        ((cmin.Deaths / cmin.Confirmed) * 100).toFixed(2),
        cmin.Recovered != 0 ? cmin.Recovered : "-",
        cmin.Recovered != 0
          ? ((cmin.Recovered / cmin.Confirmed) * 100).toFixed(2)
          : "-",
        getGetOrdinal(cmin.idx),
      ]);
      this.usInfo.state = this.$t("nearBy.usStateResult", [
        smin.Province_State,
        smin.People_Tested,
        (Number(smin.Testing_Rate) / 1000).toFixed(2),
        smin.Confirmed,
        smin.People_Hospitalized ? smin.People_Hospitalized : "-",
        Number(smin.Hospitalization_Rate).toFixed(2),
        smin.Deaths,
        Number(smin.Mortality_Rate).toFixed(2),
        smin.Recovered ? smin.Recovered : "-",
        Number(smin.Active).toFixed(0),
        getGetOrdinal(smin.idx),
        getGetOrdinal(smin.tRateRank),
      ]);

      this.displayInfo = this.usInfo.county;
      this.isResult = true;
    },
    findUSCounty(e) {
      window.ga(
        "send",
        "event",
        "nearby",
        "us-county-dropdown",
        e.Combined_Key
      );
      this.usDropdownValue = e;
      let postition = {
        coords: {
          latitude: e["Lat"],
          longitude: e["Long_"],
        },
      };
      this.calculateDistanceFromLocation(postition);
    },
    switchStateCounty() {
      window.ga("send", "event", "nearby", "us-county-state-switched", "");
      if (this.displayInfo == this.usInfo.county) {
        this.displayInfo = this.usInfo.state;
      } else {
        this.displayInfo = this.usInfo.county;
      }
    },
  },
  mounted() {
    if (this.currentCountry === "US") this.getUSLocationData();
  },
  computed: {
    selectOptions() {
      return this.regionData.map((e) => ({
        label: e.areaName,
        value: e.areaName,
      })).sort((a, b) =>
        a.label.localeCompare(b.label)
      );;
    },
    loading(){
      return this.displayInfo === this.$t('nearBy.locating') || !this.regionData;
    }
  },
};
</script>

<style>
.displayInfo > span {
  color: darkred;
  padding: 0 5px;
  font-weight: bolder;
}

.nearby-block {
  padding: 30px;
}
</style>