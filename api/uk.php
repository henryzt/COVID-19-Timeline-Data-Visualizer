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

function findNextAvaliableField($arr, $field){
    foreach ($arr as $entry) {
        if($entry->$field){
            return $entry->$field;
        }
    }
    return null;
}

function getLatest($arr){
    // some data returned null from the api, fill these null with last avaliable data
    if(!$arr || !$arr[0]){
        return null;
    }
    $latest = clone $arr[0];
    foreach ($latest as $key => $value) {
        if(!$value){
            $latest->$key = findNextAvaliableField($arr, $key);
        }
    }
    return $latest;
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
        "admissions":"cumAdmissions",
        "admissionsNew":"newAdmissions",
        "hospitalCases":"hospitalCases",
        "covidOccupiedMVBeds":"covidOccupiedMVBeds",
        "confirmedRate":"cumCasesByPublishDateRate",
        "confirmedNew":"newCasesByPublishDate",
        "confirmedNewBySpecimen":"newCasesBySpecimenDate",
        "confirmed":"cumCasesByPublishDate",
        "confirmedBySpecimen":"cumCasesBySpecimenDate",
        "deathNewBySpecimen":"newDeaths28DaysByDeathDate",
        "deathNew":"newDeaths28DaysByPublishDate",
        "death":"cumDeaths28DaysByPublishDate",
        "deathRate":"cumDeaths28DaysByPublishDateRate",
        "testedNew":"newTestsByPublishDate",
        "tested":"cumTestsByPublishDate"
    }';

    $queries = preg_replace("/\r|\n| /", "", $queries);
    $structure = '&structure=' . urlencode($queries);

    $nation = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation' . $structure;
    $overview = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=overview' . $structure;
    $utla = "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType%3Dutla&latestBy=date" . $structure;

    $res->overview = json_decode(portal_curl_return($overview));
    $res->latest = getLatest($res->overview->data);
    $res->nation = json_decode(portal_curl_return($nation));
    $res->utla = json_decode(portal_curl_return($utla));
    $res->isUpToDate = checkLength($nation) && checkLength($utla) && checkLength($overview);

    validate_and_output($res);
}