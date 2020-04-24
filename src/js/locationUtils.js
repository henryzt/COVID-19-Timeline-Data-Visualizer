// filter for d3 data,
// written by @henryz00 on Apr 2020

const moment = require('moment');

export function parseLocationData(areaData) {
    if(!areaData) return null;
    let locationJSON = JSON.parse(areaData.replace(/\\/g,""));

    let filterNumber = place => {
        if (place.number != null)
        {
            if (place.number.toString().includes(','))
                place.number = place.number.replace(/,/g, '');
            place.location = place.location.trim();
            place.number = parseInt(place.number.toString().trim());
        }
    };
    locationJSON.forEach(filterNumber);
    return locationJSON;
}

export function getD3Data(dailyLocationJson, dataTypeKey) {
    // dailyLocationJson: { arr: [{location: String, number：Int},...], date: String(DD/MM)}

    let locationData = [];
    let lastDailyData = null;
    for(let dailyData of dailyLocationJson){
        for(let location of dailyData.arr){
            let obj = {};
            obj.name = location.location;
            obj.value = location[dataTypeKey];
            obj.day = dailyData.date;
            obj.lastValue = 0;
            if(lastDailyData){
                let lastLocationData = lastDailyData.arr.find(obj => {return obj.location === location.location});
                obj.lastValue = lastLocationData && lastLocationData[dataTypeKey] ? lastLocationData[dataTypeKey] : 0;
            }
            locationData.push(obj)
        }
        lastDailyData = dailyData;
    }
    // console.log(locationData)
    return locationData;
}

export function getRegionHistoryTableData(allHistory, todayArr) {
    let dailyLocationJson = [];
    for(let history of allHistory){
        if(history.area){
            let data = {};
            data.arr = parseLocationData(history.area);
            data.date = moment(history.date).format("DD/MM");
            dailyLocationJson.push(data);
        }
    }

    // add current data
    let todayDate = moment().format("DD/MM");
    if(dailyLocationJson[dailyLocationJson.length-1].date != todayDate){
        let today = {arr: todayArr, date: todayDate};
        dailyLocationJson.push(today);
    }

    console.log("uk daily location json", dailyLocationJson);
    return dailyLocationJson;
}

function combineAllCountryData(globalData, combineProvince) {
    let filteredLocations = [];
    let addedCountryCodes = {};
    for(let region of globalData.confirmed.locations){
        let confirmedArr = Object.entries(region.history);
        let query = (ele) => {return ele.country_code===region.country_code && ele.province===region.province};
        let deathArr = globalData.deaths.locations.find(query)?.history;
        let curedArr = globalData.recovered.locations.find(query)?.history;
        if(combineProvince && addedCountryCodes[region.country_code]){
            let main = filteredLocations[filteredLocations.length-1];
            for(let [key, value] of confirmedArr){
                main.confirmed[key] = main.confirmed[key] + value;
                main.death[key] = main.death[key] + deathArr[key];
                main.cured[key] = main.cured[key] + (curedArr?curedArr[key]:0);
            }
        }else{
            addedCountryCodes[region.country_code] = true;
            let main = {country: region.country, country_code: region.country_code, confirmed: {}, death: {}, cured: {}};
            if(!combineProvince)
                main.province = region.province;
            for(let [key, value] of confirmedArr){
                main.confirmed[key] = value;
                main.death[key] = deathArr[key];
                main.cured[key] = (curedArr?curedArr[key]:0);
            }
            filteredLocations.push(main)
        }
    }
    console.log("combined results", filteredLocations);
    return filteredLocations;
}

export function getGlobalHistoryTableData(globalData, hideCountryName, combineProvince) {
    let locations = combineAllCountryData(globalData, combineProvince);
    let dateMap = {};
    for(let dayData of locations){
        let confirmedArr = Object.entries(dayData.confirmed);
        for(let [key, value] of confirmedArr){
            let date =  moment(key).format("DD/MM");
            let name = hideCountryName && dayData["province"]? dayData["province"] : (dayData["country"] +(dayData["province"]?(" - "+ dayData["province"]):""));
            let location = combineProvince ?  {location: name, country_code: dayData["country_code"], country: dayData["country"]} : {location: name};
            location.confirmed = value;
            location.death = dayData.death[key];
            location.cured = dayData.cured[key];
            dateMap[date] = dateMap[date]? dateMap[date]: [];
            dateMap[date].push(location)
        }
    }
    // console.log(dateMap);
    let dailyLocationJson = [];
    let checkAllZero = true;
    let allZeroChecker = (total, num) => {return total + num.confirmed};
    for(let entry of Object.entries(dateMap)){
        if(checkAllZero) {
            if (entry[1].reduce(allZeroChecker, 0) === 0) {
                continue;
            } else {
                checkAllZero = false;
            }
        }
        dailyLocationJson.push({arr:entry[1], date:entry[0]})
    }
    console.log("global daily location json", dailyLocationJson);
    return dailyLocationJson;
}

export function getAllCountries(locations) {
    let arr = locations.map(e=>e.country);
    return new Set(arr);
    //ref https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
}

export function getCountryData(globalData, countryName) {
    // console.log(globalData);
    let countryData = {confirmed:{}, deaths: {}, recovered: {}, latest: {}};
    let countryFilter = countryName == "world"? ()=>{return true} : e=>(e.country == countryName);
    countryData.confirmed.locations = globalData.confirmed.locations.filter(countryFilter);
    countryData.deaths.locations = globalData.deaths.locations.filter(countryFilter);
    countryData.recovered.locations = globalData.recovered.locations.filter(countryFilter);
    console.log("country data",countryData);
    return countryData;
}

export function getCountryHistoryData(countryData) {

    let historyKeys = Object.keys(countryData.confirmed.locations[0].history);
    let historyData = [];
    //create empty history data
    for(let dateKey of historyKeys){
        let entry = {
            confirmed: 0,
            cured: 0,
            death: 0,
            date: dateKey
        };
        historyData.push(entry);
    }

    for(let idx in countryData.confirmed.locations){
        for(let dateKey of historyKeys){
            let confirmed = countryData.confirmed.locations[idx].history[dateKey];
            let deaths = countryData.deaths.locations[idx].history[dateKey];
            let recovered = countryData.recovered.locations[idx]? countryData.recovered.locations[idx].history[dateKey] : 0;
            let dateEntry = historyData.find(e=>e.date===dateKey);
            dateEntry.confirmed += confirmed;
            dateEntry.death += deaths;
            dateEntry.cured += recovered?recovered:0;
        }
    }

    while(historyData[0] && historyData[0].confirmed===0){
        historyData.shift();
    }

    console.log("country history data", historyData);
    return historyData;
}

export function getCountryCompareData(globalData, countryName, minCases) {
    let historyData = getCountryHistoryData(getCountryData(globalData, countryName));
    while(historyData[0] && historyData[0].confirmed<=minCases){
        historyData.shift();
    }
    return historyData;

}

/* --------------------------------------------------------------------------------------- */
import { ukmapData } from "./ukmap";

export function combineUKHighCharts(currentUkAreaData){
    let  commonLocationsData = [];
    let names = [];
    let keys = [];
    for (let region of ukmapData.features)
    {
        names.push(region.properties.name);
        keys.push(region.properties["hc-key"]);
    }
    // console.log(keys);

    for (let jeffArea of currentUkAreaData){
        if(names.includes(jeffArea.location)) {
            const index = names.indexOf(jeffArea.location);
            if (index > -1)
                //names.splice(i1, 1);
                commonLocationsData.push([keys[index], jeffArea.number]);
        }
    }
    // console.log(this.commonLocationsData);

    return commonLocationsData;
}

import { worldmapData } from "./worldmap";
export function combineWorldHighCharts(currentWorldAreaData, dataTypeKey){
    let codeMap = new Map();
    let nameMap = new Map();
    let allMap = new Map();
    for (let region of worldmapData.features)
    {
        nameMap.set(region.properties.name, region.properties["hc-key"]);
        codeMap.set(region.properties["hc-a2"], region.properties["hc-key"]);
    }
    console.log("MAP",codeMap, nameMap)
    let locationsData = [];
    let country_key = "";
    let individual_sum = 0;
    for (let area of currentWorldAreaData) {
        if (nameMap.has(area.country) || codeMap.has(area.country_code)){
            // Country
                if(individual_sum > 0){
                    if (allMap.has(country_key))
                        allMap.set(country_key, allMap.get(country_key) + individual_sum);
                    else
                        allMap.set(country_key, individual_sum);
                    individual_sum = 0;
                }
                let current_key = codeMap.get(area.country_code);
                if (allMap.has(current_key))
                    allMap.set(current_key, area[dataTypeKey] + allMap.get(current_key));
                else
                    allMap.set(current_key, area[dataTypeKey]);
        }
    }

    // console.log(allMap);
    for(let entry of allMap)
        locationsData.push(entry);
    return locationsData;
}


export async function getUSRegionData(usStates) {
    const csv=require('csvtojson');
    let statesJson = await csv().fromString(usStates);

    let dateJson = {};
    for(let entry of statesJson){
        let dateKey = moment(entry.date).format("DD/MM");
        if(!dateJson[dateKey]) dateJson[dateKey] = [];
        let location = {location: entry.state, number: entry.cases, fips: entry.fips};
        dateJson[dateKey].push(location)
    }

    let dailyLocationJson = [];
    for(let [key, value] of Object.entries(dateJson)){
        let dayData = {arr: value, date: key};
        dailyLocationJson.push(dayData)
    }
    console.log("us daily location json", dailyLocationJson);
    return dailyLocationJson;
}