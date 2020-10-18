<?php

$ttl_key = "ttl_" . $prefix;
$cache_key = "cache_" . $prefix;


if ($_GET["purge"]) {
    // clear cache
    apc_delete($ttl_key);

    if ($_GET["purge"] == "hard") {
        // clear cache
        apc_delete($cache_key);
        echo "OK";
    }
}

$ttl = apc_fetch($ttl_key);
$cache = apc_fetch($cache_key);

if ($_GET["restore"]) {
    apc_delete($cache_key);
    apc_delete($ttl_key);
    $cache = file_get_contents("cache/" . $prefix . "-" . date("Y-m-d") . ".json", true);
}

function store_cache($json, $isUpToDate){
  global $ttl_key;
  global $cache_key;
  global $prefix;

  apc_store($cache_key, $json);
  apc_store($ttl_key, date("Y-m-d"), 300);

  //save local copy
  if ($isUpToDate && strlen($json) > 3000) {

    $cacheFile = "cache/" . $prefix . "-" . date("Y-m-d") . ".json";

    if (!file_exists($cacheFile)) {
        $fp = fopen($cacheFile, 'w');
        fwrite($fp, $json);
        fclose($fp);
    }
  }
}

function echo_and_continue($cache){
  if ($cache) {
    echo $cache;
    fastcgi_finish_request();
    sleep(2);
    ignore_user_abort(true);
    //ref https://blog.csdn.net/zqy0zqy/java/article/details/79314692
  }
}

function validate_and_output($res){
    $json = json_encode($res);

    if ($res->isUpToDate) {
        store_cache($json, true);
    } else {
        // not up to date
        $json = is_string($cache) ? json_decode($cache) : $cache;
        $json->needUpdate = true;
        $json->isUpToDate = false;
        store_cache(json_encode($json), false);
    }

    echo $json;
}