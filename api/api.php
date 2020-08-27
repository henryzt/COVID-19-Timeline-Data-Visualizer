<?php
header("Access-Control-Allow-Origin: *");

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

function portal_curl_return($path)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $path);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_ENCODING, 'identity');

    $res = curl_exec($ch);
    // echo $res;
    return $res;
}

function output($data){
    echo $data;
    // $output = json_decode($data);
    // unset($output->us);
    // echo json_encode($output);
}

if ($_GET["purge"]) {
    // clear cache
    apc_delete('ttl');

    if ($_GET["purge"] == "hard") {
        // clear cache
        apc_delete('json');
        echo "OK";
    }
}

$ttl = apc_fetch('ttl');
$cache = apc_fetch('json');

if ($_GET["restore"]) {
    apc_delete('json');
    apc_delete('ttl');
    $cache = file_get_contents("cache/" . date("Y-m-d") . ".json", true);
}

if ($ttl && $cache) {
    output($cache);

} else {

    if ($cache) {
        output($cache);
        fastcgi_finish_request();
        sleep(2);
        ignore_user_abort(true);
        //ref https://blog.csdn.net/zqy0zqy/java/article/details/79314692
    }

    $res;
    $globalData;
    $ukData;

    $ukGovApi = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation&structure={"date":"date","areaName":"areaName","areaCode":"areaCode","cumAdmissions":"cumAdmissions","hospitalCases":"hospitalCases","covidOccupiedMVBeds":"covidOccupiedMVBeds","cumCasesBySpecimenDateRate":"cumCasesBySpecimenDateRate","newCasesByPublishDate":"newCasesByPublishDate","cumCasesByPublishDate":"cumCasesByPublishDate","newDeathsByDeathDate":"newDeaths28DaysByPublishDate","cumDeathsByDeathDate":"cumDeaths28DaysByPublishDate"}';

    // $ukData->now = json_decode(portal_curl_return("https://api.covid19uk.live/"))->data;
    // $ukData->history = json_decode(portal_curl_return("https://api.covid19uk.live/history"))->data;
    $ukData->nation = json_decode(portal_curl_return($ukGovApi));

    $globalDataRaw = portal_curl_return("https://coronavirus-tracker-api.herokuapp.com/all");
    $globalDataRaw = strlen($globalDataRaw) > 1000 ? $globalDataRaw : portal_curl_return("https://covid-tracker-us.herokuapp.com/all");
    $globalData = json_decode($globalDataRaw);

    $usData = portal_curl_return("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv");

    $res->isUpToDate = $globalData && strlen($globalDataRaw) > 1000 && $usData;
    $res->uk = $ukData;
    $res->global = $globalData;
    $res->us = $usData;

    $json = json_encode($res);

    if ($res->isUpToDate) {
        apc_store('json', $json);
        apc_store('ttl', date("Y-m-d"), 300);
    } else {
        // not up to date
        $json = is_string($cache) ? json_decode($cache) : $cache;
        $json->needUpdate = true;
        $json->isUpToDate = false;
        // $json->uk = $ukData; //TODO REMOVE
        $json = json_encode($json);
        apc_store('json', $json);
        apc_store('ttl', date("Y-m-d"), 100);
    }

    output($json);

    //save local copy
    if (strlen($json) > 3000 && $res->isUpToDate) {

        $CSSEGIBaseUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";
        $rawCSSEGI;

        $rawCSSEGI->confirmed = portal_curl_return($CSSEGIBaseUrl . "time_series_covid19_confirmed_global.csv");
        $rawCSSEGI->deaths = portal_curl_return($CSSEGIBaseUrl . "time_series_covid19_deaths_global.csv");
        $rawCSSEGI->recovered = portal_curl_return($CSSEGIBaseUrl . "time_series_covid19_recovered_global.csv");

        $cacheFile = "cache/" . date("Y-m-d") . ".json";

        if (!file_exists($cacheFile)) {
            $fp = fopen($cacheFile, 'w');
            fwrite($fp, $json);
            fclose($fp);
            $fp = fopen("cache/CSSEGI-" . date("Y-m-d") . ".json", 'w');
            fwrite($fp, json_encode($rawCSSEGI));
            fclose($fp);
        }

    }

}

die();
