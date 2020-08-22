<template>
    <div id="app">
        <div class="mContent" v-if="renderAll" :class="{mContentDesktop: desktopLayout}">
            <div :class="{'d-flex': desktopLayout}">
            <div :class="{'mSectionDesktop': desktopLayout}">
<!-- header section -->
                <div class="covid_header">
                    <div>
                        <vSelect class="select" :clearable="false" :value="currentCountry" :options="countryList"
                                 @input="switchCountry"></vSelect>
                    </div>
                    <div class="header_title">
                        <h2>COVID-19</h2>
                        <h3 v-html="$t('title')"></h3>
                    </div>
                </div>

<!-- number display-->
                <TodayNumberSection :display="display" v-if="display"></TodayNumberSection>

<!-- UK number display and postcode -->
                <UkRegionSection v-if="isCurrentUk && dataUkNow" :dataUk="dataUkNow" :class="{disabled:currentDate != endDate}"></UkRegionSection>

<!-- time machine -->
                <div v-if="!dataCurrent.isUk">
                    <div class="title">{{ $t('subtitles.timeMachine') }}</div>
                    <div class="mBlock">
                        <SlideController :start-date="startDate" :end-date="endDate" :hidePlayButton="true"
                                         :disableClick="true"
                                         :current-date="currentDate" @changeIndex="changeDateIdx" @change="changeDate"
                                         @dragEnded="onTMDragEnd"
                                         :enableEvenIfPaused="true" :playing="false"></SlideController>
                        <div class="displayInfo" style="text-align: center; opacity:0.5;padding-top:6px">{{ $t('tmHint')
                            }}
                        </div>
                    </div>
                    <div class="fix_bottom" style="background: orange;"
                         :class="{'hide-popup': (currentDate === endDate || (section && !desktopLayout))}">
                        {{ $t('tmSticky') }} ({{currentDate}})
                        <span style="margin-left: 5px;text-decoration: underline;cursor: pointer;" @click="revertTM">{{ $t('tmRevert') }}</span>
                    </div>
                </div>

<!-- near by cases -->
                <div v-if="countryName==='UK' || countryName==='US'">
                    <div class="title">{{ $t('subtitles.nearby') }}</div>
                    <div class="mBlock">
                        <NearbyCasesFinder :regionData="sortedRegionData" :currentCountry="countryName"></NearbyCasesFinder>
                    </div>
                </div>

<!-- charts (show on desktop layout) -->
                <div class="mSection" v-if="desktopLayout" style="padding-top: 0">
                    <ChartSection :chart-data="chartData ? chartData : dataCurrent.history" :is-uk="dataCurrent.isUk"></ChartSection>
                </div>

            </div>

<!-- nav bar -->
            <div id="navPlaceholder" ref="navPlaceholder" v-if="!desktopLayout"></div>
            <div class="mNav" ref="nav" id="mNavbar" v-if="!desktopLayout">
                <ul class="nav nav-pills nav-fill" v-scroll-spy-active="{selector: 'li a', class: 'active'}">
                    <li class="nav-item">
                        <a class="nav-link" href="#charts">{{ $t('nav.current') }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#animation">{{ $t('nav.animation') }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#regionData">{{ $t('nav.map') }}</a>
                    </li>
                </ul>
            </div>

            <div :class="{'d-flex': desktopLayout}" v-scroll-spy="{data: 'section', offset: 100, allowNoActive: false}">
<!-- charts (show on mobile layout) -->
                <div class="mSection" v-if="!desktopLayout" id="charts" style="padding-top: 0">
                    <ChartSection :chart-data="chartData ? chartData : dataCurrent.history" :is-uk="dataCurrent.isUk"></ChartSection>
                </div>

<!-- animations -->
                <div class="mSection" :class="{'mSectionDesktop': desktopLayout}" id="animation">
                    <div class="title">{{ $t('subtitles.historyAnimation') }}</div>
                    <BarRaceSection v-if="tableData.hasData" :table-data="tableData" :is-uk="dataCurrent.isUk"></BarRaceSection>
                    <div class="title">{{ $t('subtitles.ratio') }}</div>
                    <PieSection :allHistoryData="dataCurrent.history" :mainDate="mainDate"></PieSection>
                    <div class="title">{{ $t('subtitles.countryCompare') }}</div>
                    <CountryCompareSection :global-data="dataGlobal"
                                           :country-list="countryList"></CountryCompareSection>
                </div>

<!-- map and table -->
                <div class="mSection" :class="{'mSectionDesktop': desktopLayout}" id="regionData">
                    <div class="title">{{ $t('subtitles.map') }}</div>
                    <MapSection :tableData="tableData" :countryName="countryName" :mainDate="mainDate"></MapSection>
                    <br>
                    <div class="title">{{ $t('subtitles.regionList') }}</div>
                    <RegionTable :regionData="tableData" v-if="tableData.hasData" :mainDate="mainDate" :is-uk="dataCurrent.isUk" @expanded="hideFab=$event"
                                 @switchCountry="switchCountry" :current-country="currentCountry" :desktop-layout="desktopLayout"></RegionTable>
                </div>

            </div>
            </div>

            <div class="mSection" id="share" :class="{mContent:desktopLayout}">
<!-- share -->
                <div v-if="!isLocaleCN && !isMiniApp">
                    <div class="title">Share to Friends</div>
                    <ShareIcons></ShareIcons>
                </div>


<!-- WeChat notification, for CN only -->
                <div v-if="isLocaleCN">
                    <div class="title">实时更新订阅</div>
                    <div class="mBlock" style="text-align: center;padding:30px">
                        <div>微信扫描或长按下方二维码，或搜索"<span style="text-wrap: none">UCLCSSA学联社区</span>"</div>
                        <img src="./assets/qr.png" style="max-width: 260px;"/>
                        <div>订阅每日实时数据更新及重要预警通知</div>
                        <div v-if="isLocaleCN && isWeChat()"
                             style="margin-top: 20px;text-align:center;user-select: none;">
                            <hr>
                            <div style="font-size: 20px;">本应用地址</div>
                            <div style="font-size: 25px;font-weight:bold;padding: 10px 0;user-select: text;">
                                covid19.uclcssa.cn
                            </div>
                            长按复制即可分享给其他人
                        </div>
                    </div>

<!-- Mini app fallback (as not external link should exists) -->
                    <div v-if="isMiniApp">
                        <br>
                        <div class="title">{{ $t('subtitles.about') }}</div>
                        <ul>
                            <li>请使用浏览器访问 covid19.uclcssa.cn 以获取本页面数据来源及更新时间</li>
                            <li>本页面开源于Github，欢迎提供任何建议及贡献！</li>
                            <li>作者：©2020 Henry (@henryz00), Davies (@DaviesXue) | UCLCSSA 伦敦大学学院中国学联</li>
                        </ul>
                    </div>

                </div>

<!-- source and credits -->
                <div v-if="!isLocaleCN || !isMiniApp">
                    <br>
                    <div class="title">{{ $t('subtitles.source') }}</div>
                    <ul>
                        <li><a href="https://github.com/isjeffcom/coronvirusFigureUK">Coronavirus UK Data API -
                            isjeffcom</a></li>
                        <li><a href="https://github.com/CSSEGISandData/COVID-19">COVID-19 Data Repository - Johns
                            Hopkins CSSE</a></li>
                        <li><a href="https://apify.com/covid-19">COVID-19 Data APIs for statistics - APIFY</a></li>
                        <li><a href="https://github.com/ExpDev07/coronavirus-tracker-api">Coronavirus Tracker API -
                            ExpDev07</a></li>
                        <li><a href="https://github.com/nytimes/covid-19-data">Coronavirus Data in the United States - The New York Times</a></li>
                        <li><a href="https://bl.ocks.org/jrzief/70f1f8a5d066a286da3a1e699823470f">D3 Bar Chart Races (Based on) - jrzief</a></li>
                        <li><a href="https://www.iconfinder.com/p/coronavirus-awareness-icons">Coronavirus Awareness
                            Icons - iconfinder</a></li>
                        <li>{{lastUpdated}}</li>
                    </ul>


                    <div class="title">{{ $t('subtitles.about') }}</div>
                    <ul>
                        <li>This project is open sourced at <a
                                href="https://github.com/henryz00/COVID-19-Data-Visualizer-UK">Github Repository</a>,
                            pull requests and issues welcomed!
                        </li>
                        <li>© 2020 <a href="https://github.com/henryz00">@henryz00</a> and <a
                                href="https://github.com/DaviesXue">@DaviesXue</a>
                            <span>{{isLocaleCN ? " | UCLCSSA 伦敦大学学院中国学联" : " at University College London."}}</span>
                        </li>
                    </ul>
                        <div style="font-size:14px; opacity:0.5;">You are free to distribute, embed or edit whole or part of the site without prior notice to us, as long as
                            you mention the source (covid19track.site or covid19.uclcssa.cn) or keep this section intact. Please see the github repo for more
                            information if you would like to modify the source code :)
                        </div>
                </div>

<!-- logo and language switch -->
                <div style="text-align: center;margin: 50px 0;opacity: 0.5;color: silver;">
                    <img src="./assets/logo_grey.png" style="max-width: 200px;" v-if="isLocaleCN"/>
                    <br><br>
                    <a href="#" @click="changeLang('en')">English</a> | <a href="#" @click="changeLang('zh')">中文</a>
                </div>
            </div>

            <div v-if="isMiniApp && isLocaleCN && !showWechatPopup">
                <MiniAppPostOverlay></MiniAppPostOverlay>
            </div>

            <FAB v-if="isDesktop && !hideFab" :isDesktop="desktopLayout" @switchLayout="desktopLayout=$event"></FAB>

        </div>

<!-- loading indicator and numbers -->
        <div v-else>
            <div class="mContent">
                <div class="covid_header">
                    <div></div>
                    <div class="header_title">
                        <h2>COVID-19</h2>
                        <h3 v-html="$t('title')"></h3>
                    </div>
                </div>

                <TodayNumberSection :display="display" v-if="display" :instant="true"></TodayNumberSection>
            </div>
            <div class="vertical-center">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"  v-if="!networkError">
                    <span class="sr-only">Loading...</span>
                </div>
                <div v-else>
                    Network Error<br>
                    <a href="/">Retry</a>
                </div>
            </div>
        </div>

<!-- launch indicator -->
        <div class="fix_bottom" style="font-size: 14px;font-weight: bold;" :class="{'hide-popup': !showWechatPopup}">
            {{launchIndicator}}
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import RegionTable from "./components/RegionTable.vue";
    import UkRegionSection from "./components/UkRegionSection.vue";
    import TodayNumberSection from "./components/TodayNumberSection.vue";
    import BarRaceSection from "./components/BarRaceSection.vue";
    import MapSection from "./components/MapSection.vue";
    import ChartSection from "./components/ChartSection.vue";
    import SlideController from "./components/SlideController.vue";
    import PieSection from "./components/PieSection.vue";
    import CountryCompareSection from "./components/CountryCompareSection.vue";
    import MiniAppPostOverlay from "./components/MiniAppPostOverlay.vue";
    import ShareIcons from "./components/ShareIcons.vue";
    import NearbyCasesFinder from "./components/NearbyCasesFinder.vue";
    import FAB from "./components/FAB.vue";
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    import {
        getRegionHistoryTableData,
        getGlobalHistoryTableData,
        parseLocationData,
        getAllCountries,
        getCountryData,
        getCountryHistoryData,
        getUSRegionData
    } from "./js/locationUtils"

    const moment = require('moment');

    export default {
        name: "App",
        components: {
            RegionTable,
            BarRaceSection,
            ChartSection,
            PieSection,
            TodayNumberSection,
            UkRegionSection,
            vSelect,
            MapSection,
            SlideController,
            CountryCompareSection,
            MiniAppPostOverlay,
            ShareIcons,
            NearbyCasesFinder,
            FAB
        },
        data: () => {
            return {
                shouldRender: true,
                dataCurrent: null,
                dataUk: null,
                dataGlobal: null,
                sortedRegionData: null,
                section: 0,
                currentCountry: null,
                countryList: [],
                display: {
                    confirmed: 298325,
                    confirmedChange: 0,
                    deaths: 235,
                    deathsChange: 0,
                    tested: 453,
                    testedChange: 0,
                    cured: 0,
                    curedChange: 0
                },
                tableData: {
                    hasData: false
                },
                chartData: null,
                isLocaleCN: false,
                showWechatPopup: true,
                currentDate: null,
                mainDate: null,
                lastUpdated: "NEVER",
                launchIndicator: "",
                isDesktop: false,
                desktopLayout: false,
                networkError: false,
                hideFab: false
            };
        },
        async mounted() {
            window.dateFormat = "DD MMM";
            let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (this.isWeChat()) {
                this.$i18n.locale = "zh";
            }
            // miniapp china redirect
            // if (this.isMiniApp && timeZone == "Asia/Shanghai") {
            //     window.location.replace("https://uclcssa.cn/public/covid_redirect.html");
            //     window.ga('send', 'event', "china-redirected", "mini-app-tab", "");
            //     return;
            // }
            this.isLocaleCN = this.$i18n.locale === "zh";
            document.title = this.$t('pageTitle');
            window.dateFormat = this.$t('dateFormat');
            this.launchIndicator = this.$t('launchIndicator')[Math.floor(Math.random() * this.$t('launchIndicator').length)];

            let performanceTimeStart = performance.now();
            fetch("https://uk.henryz.cc/covid/api.php").then(async res => {
                let data = await res.json();
                let resTime = Math.round(performance.now() - performanceTimeStart);
                console.log(data)
                this.dataUkNow = data.uk;
                this.dataUs = data.us;
                this.dataGlobal = data.global;
                // console.log(data);
                this.lastUpdated = `Data updated ${moment(data.global.confirmed.last_updated).fromNow()}, data is ${data.isUpToDate ? "" : "NOT"} up to date.
                          Data might not reflect the real number, and might be delayed.`;
                //global data
                this.tableData.global = getGlobalHistoryTableData(this.dataGlobal, false, true);
                let countryArr = getAllCountries(this.dataGlobal.confirmed.locations);
                this.countryList = [this.$t('selector.world'), this.$t('selector.uk'), this.$t('selector.us'),  ...countryArr];
                const lastCountry = localStorage.getItem('lastCountry');
                if(lastCountry){ 
                    this.switchCountry(lastCountry);
                }else{
                    this.initLocation(timeZone);
                }

                this.getNavScrollAnchor();
                let performanceTime = Math.round(performance.now() - performanceTimeStart);
                console.log("Data loaded", resTime, performanceTime);
                window.ga('send', 'event', "net-request", "initial-fetch-loaded", `country-${this.currentCountry};loaded-${resTime}ms;calculated-${performanceTime}ms;`);
            }).catch((err)=>{
                this.networkError = true;
                console.error(err);
                window.ga('send', 'event', "net-request", "errored", `initial-load-failed`);
            });

            setTimeout(() => {
                this.showWechatPopup = false
            }, 2000)

        },
        methods: {
            initLocation: async function(timezone){
                if(timezone.includes("Europe/London") || this.isMiniApp){
                    this.currentCountry = this.countryList[1];
                    this.loadUkData();
                }else if(timezone.includes("America")){
                    this.currentCountry = this.countryList[3];
                    this.loadUsData();
                }else{
                    this.currentCountry = this.countryList[0];
                    this.loadCountryData("world");
                }
                window.ga('send', 'event', "timezone-acquired", this.currentCountry, timezone);
            },
            switchCountry: async function (e) {
                this.shouldRender = false;
                // console.log(e);
                this.chartData = null;
                this.currentCountry = e;
                localStorage.setItem('lastCountry', e);
                window.ga('send', 'event', "country", "country-changed", e);

                if (e === this.countryList[0]) {
                    this.loadCountryData("world");

                } else if (e === this.countryList[1]) {
                    this.loadUkData();
                } else if (e === this.countryList[2] || e === "US") {
                    await this.loadUsData();
                } else {
                    this.loadCountryData(e)
                }
                this.forceReload()
            },
            loadCountryData: async function (countryName) {
                this.countryName = countryName;
                let countryData = getCountryData(this.dataGlobal, countryName);
                // console.log(countryData.confirmed.locations);
                this.dataCurrent = {};
                this.dataCurrent.isUk = false;
                //history data
                //console.log("data loaded", countryData);
                this.tableData.country = countryName === "world" ? null : getGlobalHistoryTableData(countryData, true);
                this.tableData.hasData = true;
                this.dataCurrent.history = getCountryHistoryData(countryData);
                // console.log("country loaded", this.dataCurrent);
                this.startDate = moment(this.dataCurrent.history[0].date).format(window.dateFormat);
                this.endDate = moment(this.dataCurrent.history[this.dataCurrent.history.length - 1].date).format(window.dateFormat);
                this.currentDate = this.endDate;
                this.calculateDisplay(this.dataCurrent.history.length - 1)
            },
            loadUsData: async function (){
                this.loadCountryData("US");
                this.tableData.country = await getUSRegionData(this.dataUs);
            },
            calculateDisplay: async function (idx) {
                let current = this.dataCurrent.history[idx];
                let last = this.dataCurrent.history[idx - 1] ? this.dataCurrent.history[idx - 1] : current;
                this.display = {
                    confirmed: current.confirmed,
                    confirmedChange: current.confirmed - last.confirmed,
                    deaths: current.death,
                    deathsChange: (current.death - last.death),
                    tested: current.tested,
                    testedChange: current.tested ?? (current.tested - last.tested),
                    cured: current.cured,
                    curedChange: (current.cured - last.cured)
                };

            },
            loadUkData: async function () {
                this.loadCountryData("United Kingdom");
            },
            changeDateIdx: function (idx) {
                this.calculateDisplay(idx)
            },
            changeDate: function (date) {
                this.currentDate = date;
            },
            onTMDragEnd: function (idx) {
                this.chartData = this.dataCurrent.history.slice(0, idx);
                this.mainDate = this.currentDate;
                window.ga('send', 'event', "time-machine", "drag-end", idx);
            },
            revertTM: function () {
                this.currentDate = this.endDate;
                this.chartData = this.dataCurrent.history;
                this.calculateDisplay(this.dataCurrent.history.length - 1);
                window.ga('send', 'event', "time-machine", "reverted", this.endDate);
            },
            changeLang: function (lang) {
                this.$i18n.locale = lang;
                this.isLocaleCN = this.$i18n.locale === "zh";
                document.title = this.$t('pageTitle');
                this.countryList[0] = this.$t('selector.world');
                this.countryList[1] = this.$t('selector.uk');
                this.countryList[2] = this.$t('selector.us');
                // this.currentCountry = this.countryList[0];
                this.forceReload()
            },
            forceReload: function () {
                //force reload
                this.shouldRender = false;
                this.$nextTick(() => {
                    this.shouldRender = true;
                });
            },
            isWeChat: function () {
                let ua = window.navigator.userAgent.toLowerCase();
                return (ua.match(/MicroMessenger/i) == 'micromessenger');
            },
            getNavScrollAnchor: function () {
                document.addEventListener('scroll', () => {
                    if(this.$refs["navPlaceholder"]) {
                        if (window.scrollY > this.$refs["navPlaceholder"].offsetTop) {
                            this.$refs["nav"].classList.add("fixed_nav");
                            this.$refs["navPlaceholder"].classList.add("navPlaceholder");
                        } else {
                            this.$refs["nav"].classList.remove("fixed_nav");
                            this.$refs["navPlaceholder"].classList.remove("navPlaceholder");
                        }
                    }
                });

                let checkLayout = ()=>{
                    this.isDesktop = (window.innerWidth>1200);
                    this.desktopLayout = (window.innerWidth>1400);
                };

                window.onresize = checkLayout;
                checkLayout();
            }
        },
        computed: {
            isMiniApp: function () {
                // WeChat Mini app
                let url = new URL(window.location.href);
                let query = url.searchParams.get("source");
                return query === "apptab";
            },
            isCurrentUk: function() {
                return this.currentCountry === 'United Kingdom' || this.currentCountry === this.$t('selector.uk');
            },
            renderAll: function(){
                return this.dataCurrent && this.shouldRender;
            }
        },
        watch: {
            desktopLayout: function () {
                this.forceReload()
            }
        }

    };
</script>

<style scoped>
    .vertical-center {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    h6 {
        padding-left: 20px;
    }

    .covid_header {
        padding: 20px 10px;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .header_title {
        opacity: 0.5;
    }

    .fix_bottom {
        position: fixed;
        bottom: 20px;
        width: 100%;
        background: deepskyblue;
        color: white;
        line-height: 40px;
        text-align: center;
        transition: 2s;
        z-index: 100;
        max-width: 500px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 6px;
    }

    .select {
        width: 190px;

    }

    .mContentDesktop{
        max-width: 100%;
    }

    .mSectionDesktop{
        width: 30vw;
        margin: 1.3vw;
        padding-top: 0;
    }

    .disabled{
        opacity: 0.5;
    }


    @media only screen and (max-width: 600px) {
        .covid_header {
            padding: 20px 10px;
            display: flex;
            flex-direction: column-reverse;
            align-items: flex-end;
        }

        .header_title h2 {
            font-size: 30px;
        }

        .header_title h3 {
            font-size: 25px;
        }

        .fix_bottom{
            max-width: 100%;
            margin-bottom: 0px;
            left: 0;
            bottom: 0;
            transform: none;
            border-radius: 0;
        }
    }

        .hide-popup {
        bottom: -40px;
        opacity: 0;
    }
</style>
