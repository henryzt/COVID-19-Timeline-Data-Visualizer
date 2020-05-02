import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const barRaceColor = {
    confirmed: "#33CCFF",
    active: "#ffaa00",
    death: "#bcbcbc",
    dRate: "#bcbcbc",
    cured: "#00ff79",
    cRate: "#00ff79"
}

const messages = {
    'en': {
        pageTitle: "COVID-19 Realtime Data Visualization and Timeline - Coronavirus Nearby Cases Finder",
        title: "Realtime Tracking<br>& Timeline",
        dateFormat: "DD MMM",
        launchIndicator: ["Stay home, stay safe.", "For easier access, add us to home page or bookmark.",
            "Add us to the home page or bookmark for faster access", "To keep you updated, bookmark or add us to the home page.", "Tips: tap chart legend to hide specific data set"],
        subtitles: {
            today: "Today Overview",
            country: "Country Overview",
            nearby: "Cases Near Me",
            confirmAndDeath: "Cumulative Cases",
            newDeaths: "New Cases",
            rates: "Death Rate and Recover Rate",
            historyAnimation: "Historical Time Series Animation",
            regionList: "Region List",
            source: "Source",
            about: "About",
            map: "Confirmed Cases Map",
            ratio: "Ratio Animation",
            timeMachine: "Time Machine",
            countryCompare: "Country and Region Analysis"
        },
        tmHint: "Drag the slider to view historical data",
        tmSticky: "Viewing historical data",
        tmRevert: "Revert",
        totalConfirmed: "Confirmed",
        totalDeaths: "Deaths",
        totalTests: "Tested",
        totalCured: "Recovered",
        negative: "Negative",
        active: "Active",
        england: "England",
        scotland: "Scotland",
        wales: "Wales",
        nIreland: "N. Ireland",
        nav: {
            current: "Current",
            animation: "Animations",
            map: "Regional"
        },
        newCases: "New Cases",
        newDeaths: "New Deaths",
        deathRate: "Death Rate",
        cureRate: "Cure Rate",
        chartTimes: {
            oneWeek: "7 Days",
            twoWeek: "14 Days",
            oneMonth: "31 Days",
            all: "All Data",
        },
        nearBy: {
            ukDefault: "Search cases in NHS region by postcode, or tap the left-side icon to locate.",
            usDefault: "Search cases and rankings by county, or tap the left-side icon to locate.",
            postcodeErr: "Sorry, the UK postcode your entered is invalid.",
            ukResult: `Currently, there are<span>{1}</span> confirmed cases in<span>{0}</span>, with a change of <span>{2}</span> cases, it is ranked <span>{3}</span> in all NHS regions.`,
            usResult: `Currently, there are<span>{1}</span> active cases in<span>{0}</span>. Cumulatively, there are<span>{2}</span> confirmed cases, <span>{3}</span> deaths<span>({4}%)</span> and <span>{5}</span> recovered<span>({6}%)</span>. It is ranked <span>{7}</span> in all US counties.`,
            usStateResult: `In the State of {0}, there are<span>{1}</span> people tested in total, the average testing rate is<span>{2}%</span>, ranked <span>{11}</span> highest in all states. Of those<span>{3}</span> tested positive, <span>{4}</span> are hospitalized ({5}%),<span>{6}</span> deaths ({7}%), <span>{8}</span> recovered. Currently there are<span>{9}</span> active cases. It is ranked <span>{10}</span> in all states.`,
            notFound: `Sorry, we cannot find any data on <span>{0}</span>`,
            locating: "Locating, please wait...",
            notUk: "Sorry, but we cannot locate you onto an UK region.",
            notUs: "Sorry, but we cannot locate you onto an US county.",
            rejected: "Sorry, but you have denied the GPS permission.",
            unsupported: "Sorry, Geolocation is not supported by this browser.",
            search: "Search",
            switchCountyState: "Switch State/County Data",
            goToRegional: "Go to Regional Data Section"
        },
        barRace: {
            global: "Global",
            local: "Country",
            globalTitle: "Global History",
            localTitle: "Region History",
            unit: "Confirmed Cases"
        },
        table: {
            default: "Sort by",
            byRegion: "Region",
            byCases: "Cases",
            byChanges: "Changes",
            region: "Region",
            cases: "Confirmed",
            changes: "Changes",
            showAll: "Show All",
            showLess: "Show Less"
        },
        selector: {
            uk: "🇬🇧 UK Realtime",
            us: "🇺🇸 US Realtime",
            world: "🌎 Worldwide"
        },
        compareNote: "Data is aligned by the date when confirmed cases reaches 50 in each region",
        compareSelect: "Select any countries below to add for comparision",
        dataSwitch: {
            number: "Confirmed Cases",
            confirmed: "Confirmed Cases",
            active: "Active Cases",
            death: "Death Toll",
            dRate: "Death Rate (%)",
            cured: "Recovered Cases",
            cRate: "Recover Rate (%)"
        },
        total: "Total",
        showAllCharts: "Show All Charts",
        showLess: "Hide",
        noData: "No data available for this view, you can try other data types.",
        barRaceColor: barRaceColor,
        fab: {
            share: "Share",
            dashboard: "Dashboard View",
            scroll: "Scroll View"
        }
    },
    'zh': {
        pageTitle: "COVID-19 实时疫情数据跟踪 - UCLCSSA 中国学联",
        title: "实时数据动态",
        dateFormat: "MM/DD",
        launchIndicator: ["在微信中将此页面设为浮窗，方便第一时间获取更新", "请保护好自己：）", "添加到收藏夹或主屏幕，方便下次访问！", "提示：点击图表标识可以隐藏某一个数据"] ,
        subtitles: {
            today: "今日概览",
            country: "国家概览",
            nearby: "查询周边确诊",
            confirmAndDeath: "确诊及死亡",
            newDeaths: "新增确诊及死亡",
            rates: "死亡率及治愈率",
            historyAnimation: "历史数据变化动画",
            regionList: "地域确诊列表",
            source: "数据来源",
            about: "关于",
            map: "国家地区确诊地图",
            ratio: "人数占比",
            timeMachine: "时光机",
            countryCompare: "国家和地区数据分析"
        },
        tmHint: "滑动进度条以查看历史数据",
        tmSticky: "正在查看历史数据",
        tmRevert: "回到今日",
        totalConfirmed: "累计确诊",
        totalDeaths: "累计死亡",
        totalTests: "累计测试",
        totalCured: "累计治愈",
        negative: "测试阴性",
        active: "现存确诊",
        england: "英格兰",
        scotland: "苏格兰",
        wales: "威尔士",
        nIreland: "北爱尔兰",
        nav: {
            current: "当前数据",
            animation: "历史动画",
            map: "地区概况"
        },
        newCases: "新增确诊",
        newDeaths: "新增死亡",
        deathRate: "死亡率",
        cureRate: "治愈率",
        chartTimes: {
            oneWeek: "一周内",
            twoWeek: "两周内",
            oneMonth: "一个月内",
            all: "全部数据",
        },
        nearBy: {
            usDefault: "搜索州或郡名即可查询最近的区域确诊数量，点击左侧按钮可以自动定位。",
            ukDefault: "输入您的英国邮编即可查询最近的区域确诊数量，点击左侧按钮可以自动定位。",
            postcodeErr: "抱歉，您输入的邮编有误",
            ukResult: `目前，<span>{0}</span>区共有<span>{1}</span>例确诊，相较上次变化<span>{2}</span>例，在NHS地区中排名第<span>{3}</span>。`,
            notFound: `抱歉，我们无法找到<span>{0}</span>的相关信息`,
            locating: "定位中，请稍候...",
            notUk: "很抱歉，我们无法定位您到英国的地区",
            notUs: "很抱歉，我们无法定位您到美国的地区",
            rejected: "很抱歉，我们无法定位，因为您已拒绝位置授权",
            unsupported: "很抱歉，您的浏览器不支持定位",
            search: "查询",
            switchCountyState: "切换州或郡数据",
            goToRegional: "前往地区数据版块"
        },
        barRace: {
            global: "全球",
            local: "本地",
            globalTitle: "全球确诊数据",
            localTitle: "国家确诊数据",
            unit: "确诊人数（例）"
        },
        table: {
            default: "默认排序",
            byRegion: "按地区",
            byCases: "数据",
            byChanges: "按变化",
            region: "地区",
            cases: "确诊人数",
            changes: "较上次",
            showAll: "显示全部",
            showLess: "收起"
        },
        selector: {
            uk: "🇬🇧英国实时数据",
            us: "🇺🇸美国实时数据",
            world: "🌎世界实时数据"
        },
        compareNote: "数据以国家确诊首次超过50例作为起点对齐",
        compareSelect: "从下列输入框可选择其他任何国家进行对比",
        dataSwitch: {
            number: "累计确诊",
            confirmed: "累计确诊",
            active: "现存确诊",
            death: "累计死亡",
            dRate: "死亡率 (%)",
            cured: "累计治愈",
            cRate: "治愈率 (%)"
        },
        total: "累计",
        showAllCharts: "显示全部图表",
        showLess: "收起",
        noData: "暂无数据，您可以查看其他数据类型或国家",
        barRaceColor: barRaceColor,
        fab: {
            share: "分享",
            dashboard: "瀑布布局",
            scroll: "滚动布局"
        }
    }
};

// eslint-disable-next-line no-unused-vars
export const i18n = new VueI18n({
    locale: navigator.language.split('-')[0], // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
});