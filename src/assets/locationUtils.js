// filter for d3 data,
// written by @henryz00 on Apr 2020

const moment = require('moment');

export function parseLocationData(areaData) {
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

export function getNHSRegionD3Data(allHistory) {
    let dailyLocationJson = [];
    for(let history of allHistory){
        if(history.area){
            let data = {};
            data.arr = parseLocationData(history.area);
            data.date = moment(history.date).format("DD/MM");
            dailyLocationJson.push(data);
        }
    }

    // console.log(dailyLocationJson);
    return getD3Data(dailyLocationJson);
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
    // console.log(dailyLocationJson);
    return getD3Data(dailyLocationJson);
}

export function filterRegionData(today, yesterday){
        let regionJSON = parseLocationData(today);
        let regionOldJSON = parseLocationData(yesterday);

        let id = 0;
        for (let region of regionJSON)
        {
            region.id = id++;
            let change = regionOldJSON[id]? region.number - regionOldJSON[id].number : 0;
            region.change = (change>0?"+":"") + change
        }
        return regionJSON;

}