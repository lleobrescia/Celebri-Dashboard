<?php

$url = 'http://23.238.16.114/celebri/web/uploadFotoCasal.aspx';
$data = array('image' => $_POST['image'], 'name' => $_POST['name']);

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo $result;
?>