<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

global $prefix;
$prefix = "Global";

require "curl.php";
require "cache.php";

function output($data)
{
    echo $data;
}


if ($ttl && $cache) {
    echo $cache;

} else {

    echo_and_continue($cache);

    $res;
    $globalData;

    $globalDataRaw = portal_curl_return("https://coronavirus-tracker-api.herokuapp.com/all");
    $globalDataRaw = strlen($globalDataRaw) > 1000 ? $globalDataRaw : portal_curl_return("https://covid-tracker-us.herokuapp.com/all");
    $globalData = json_decode($globalDataRaw);

    $usData = portal_curl_return("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv");

    $res->isUpToDate = $globalData && strlen($globalDataRaw) > 1000 && $usData;
    $res->global = $globalData;
    $res->us = $usData;

    validate_and_output($res);

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
