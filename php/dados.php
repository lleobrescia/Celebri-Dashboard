<?php

$dados = '{"appid":"60e74b56ffa91185c5fc8732e94cbb1e", "token":"ea7021f308d7d4e691093dc16f6a8c8d"}';

header('Content-Type: application/json');
echo json_encode($dados,JSON_FORCE_OBJECT);
?>