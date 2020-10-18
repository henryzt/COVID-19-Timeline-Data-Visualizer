<?php

header("Access-Control-Allow-Origin: *");

function portal_curl_return($path)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $path);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_ENCODING, 'identity');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Origin: uclcssa.cn'));

    $res = curl_exec($ch);
    return $res;
}