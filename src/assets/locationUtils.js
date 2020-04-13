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

export function getD3Data(allHistory) {
    let dailyLocationJson = [];
    for(let history of allHistory){
        if(history.area){
            let data = parseLocationData(history.area);
            data.date = history.date;
            dailyLocationJson.push(data);
        }
    }
    console.log(dailyLocationJson);

    let locationData = [];
    let lastDailyData = null;
    for(let dailyData of dailyLocationJson){
        for(let location of dailyData){
            let obj = {};
            obj.name = location.location;
            obj.value = location.number;
            obj.year = dailyData.date;
            obj.lastValue = 0;
            if(lastDailyData){
                let lastLocationData = lastDailyData.find(obj => {return obj.location === location.location});
                obj.lastValue = lastLocationData && lastLocationData.number ? lastLocationData.number : 0;
            }
            locationData.push(obj)
        }
        lastDailyData = dailyData;
    }
    return locationData;
}