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

export function getD3Data(dailyLocationJson) {
    // dailyLocationJson: { arr: [{location: String, number：Int},...], date: String(DD/MM)}

    let locationData = [];
    let lastDailyData = null;
    for(let dailyData of dailyLocationJson){
        for(let location of dailyData.arr){
            let obj = {};
            obj.name = location.location;
            obj.value = location.number;
            obj.day = dailyData.date;
            obj.lastValue = 0;
            if(lastDailyData){
                let lastLocationData = lastDailyData.arr.find(obj => {return obj.location === location.location});
                obj.lastValue = lastLocationData && lastLocationData.number ? lastLocationData.number : 0;
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

    console.log(dailyLocationJson);
    return dailyLocationJson;
}

export function getNHSRegionD3Data(historyTableData) {
    return getD3Data(historyTableData);
}

export function getD3GlobalData(raw) {
    let dateMap = {};
    for(let dayData of raw.locations){
        let objArr = Object.entries(dayData.history);
        for(let i = 0; i<objArr.length;i++){
            let date =  moment(objArr[i][0]).format("DD/MM");
            let value = objArr[i][1];
            let location = {location: dayData["country"] +(dayData["province"]?(" - "+ dayData["province"]):""), number: value};
            dateMap[date] = dateMap[date]? dateMap[date]: [];
            dateMap[date].push(location)
        }
    }
    // console.log(dateMap);
    let dailyLocationJson = [];
    for(let entry of Object.entries(dateMap)){
        dailyLocationJson.push({arr:entry[1], date:entry[0]})
    }
    console.log(dailyLocationJson);
    return getD3Data(dailyLocationJson);
}

export function getAllCountries(locations) {
    let arr = locations.map(e=>e.country);
    return ["United Kingdom", "Worldwide", ...new Set(arr)];
    //ref https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
}

/* --------------------------------------------------------------------------------------- */
import { ukmapData } from "./ukmap";

export function combineHighCharts(currentUkAreaData){
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