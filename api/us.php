<?php
header("Access-Control-Allow-Origin: *");
global $prefix;
$prefix = "US";
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

require "curl.php";
require "cache.php";

function getDateData($baseUrl)
{
    $data = null;
    $date = new DateTime('NOW');
    $date->modify('+1 day');
    $count = 1000;
    while (!$data && $count > 0) {
        $count--;
        $date->modify('-1 day');
        $data = portal_curl_return($baseUrl . $date->format('m-d-Y') . ".csv");
        if ($data == "404: Not Found") {
            $data = null;
        }
    }
    return $data;
}


if ($ttl && $cache) {
    echo $cache;

} else {
    echo_and_continue($cache);

    $CSSEGIBaseUSUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/";
    $CSSEGIBaseUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";
    $res;

    $res->global = getDateData($CSSEGIBaseUrl);
    $res->us = getDateData($CSSEGIBaseUSUrl);
    $res->isUpToDate = $res->global && $res->us;

    validate_and_output($res);

}
