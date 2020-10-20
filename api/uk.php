<?php
header("Access-Control-Allow-Origin: *");
global $prefix;
$prefix = "UK";
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

require "curl.php";
require "cache.php";

function checkLength($res){
    return $res && strlen($res) > 500;
}


if ($ttl && $cache) {
    echo $cache;

} else {
    echo_and_continue($cache);

    $res;

    $queries = '{
        "date":"date",
        "areaName":"areaName",
        "areaCode":"areaCode",
        "cumAdmissions":"cumAdmissions",
        "hospitalCases":"hospitalCases",
        "covidOccupiedMVBeds":"covidOccupiedMVBeds",
        "cumCasesBySpecimenDateRate":"cumCasesBySpecimenDateRate",
        "newCasesByPublishDate":"newCasesByPublishDate",
        "cumCasesByPublishDate":"cumCasesByPublishDate",
        "newDeathsByDeathDate":"newDeaths28DaysByPublishDate",
        "cumDeathsByDeathDate":"cumDeaths28DaysByPublishDate"
    }';

    $queries = preg_replace("/\r|\n/", "", $queries);
    $structure = '&structure=' . urlencode($queries);

    $nation = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation' . $structure;
    $overview = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=overview' . $structure;
    $utla = "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType%3Dutla&latestBy=date" . $structure;

    $res->overview = json_decode(portal_curl_return($overview));
    $res->nation = json_decode(portal_curl_return($nation));
    $res->utla = json_decode(portal_curl_return($utla));

    $res->isUpToDate = checkLength($nation) && checkLength($utla) && checkLength($overview);

    validate_and_output($res);
}