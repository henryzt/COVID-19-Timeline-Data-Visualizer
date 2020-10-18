<?php
header("Access-Control-Allow-Origin: *");
global $prefix;
$prefix = "UK";
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

require "curl.php";
require "cache.php";


if ($ttl && $cache) {
    echo $cache;

} else {
    echo_and_continue($cache);

    $res;

    $ukNation = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22date%22:%22date%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22cumAdmissions%22:%22cumAdmissions%22,%22hospitalCases%22:%22hospitalCases%22,%22covidOccupiedMVBeds%22:%22covidOccupiedMVBeds%22,%22cumCasesBySpecimenDateRate%22:%22cumCasesBySpecimenDateRate%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22,%22newDeathsByDeathDate%22:%22newDeaths28DaysByPublishDate%22,%22cumDeathsByDeathDate%22:%22cumDeaths28DaysByPublishDate%22%7D';
    $utla = "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType%3Dutla&latestBy=date&structure=%7B%22date%22:%22date%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22hospitalCases%22:%22hospitalCases%22,%22covidOccupiedMVBeds%22:%22covidOccupiedMVBeds%22,%22cumCasesBySpecimenDateRate%22:%22cumCasesBySpecimenDateRate%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22,%22newDeathsByDeathDate%22:%22newDeaths28DaysByPublishDate%22,%22cumDeathsByDeathDate%22:%22cumDeaths28DaysByPublishDate%22%7D";

    $res->nation = json_decode(portal_curl_return($ukNation));
    $res->utla = json_decode(portal_curl_return($utla));

    $res->isUpToDate = $ukNation && strlen($ukNation) > 500 && $utla && strlen($utla) > 500;

    validate_and_output($res);

}