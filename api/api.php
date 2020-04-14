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

    $res = curl_exec($ch);
    return $res;
}

if ($_GET["purge"]) {
    // clear cache
    apc_delete('json');
}

$cache = apc_fetch('json');

if ($cache) {
    $json = $cache;

} else {

    $res;
    $globalData;
    $ukData;

    $ukData->now = json_decode(portal_curl_return("https://api.covid19uk.live/"))->data;
    $ukData->history = json_decode(portal_curl_return("https://api.covid19uk.live/history"))->data;
    $ukData->regional = json_decode(portal_curl_return("https://api.apify.com/v2/key-value-stores/KWLojgM5r1JmMW4b4/records/LATEST?disableRedirect=true"));

    $CSSEGIBaseUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";

    $globalData->confirmed = portal_curl_return($CSSEGIBaseUrl . "time_series_covid19_confirmed_global.csv");
    $globalData->deaths = portal_curl_return($CSSEGIBaseUrl . "time_series_covid19_deaths_global.csv");
    $globalData->recovered = portal_curl_return($CSSEGIBaseUrl . "time_series_covid19_recovered_global.csv");

    $res->uk = $ukData;
    $res->global = $globalData;

    $json = json_encode($res);

    apc_store('json', $json, 300);

}

echo $json;

if (strlen($json) > 1000) {

    $cacheFile = "cache/" . date("Y-m-d") . ".json";

    if (!file_exists($cacheFile)) {
        $fp = fopen($cacheFile, 'w');
        fwrite($fp, $json);
        fclose($fp);
    }

}

die();