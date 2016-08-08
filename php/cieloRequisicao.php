<?php

$cartao = $_POST['cartao'];
$numeroCartao = $_POST['numeroCartao'];
$validadeMes = $_POST['validadeMes'];
$validadeAno = $_POST['validadeAno'];
$numeroSeg = $_POST['numeroSeg'];

header("charset=ISO-8859-1");
// Turn off all error reporting
// error_reporting(0);
date_default_timezone_set('America/Sao_Paulo');

$horaLocal = date('Y-m-d\TH:i:s\.109-03:00');

$url = 'https://qaseCommerce.cielo.com.br/servicos/ecommwsec.do';
$xml = '<?xml version="1.0" encoding="ISO-8859-1"?>
<requisicao-transacao id="a97ab62a-7956-41ea-b03f-c2e9f612c293" versao="1.2.1">
  <dados-ec>
    <numero>1006993069</numero>
    <chave>25fbb99741c739dd84d7b06ec78c9bac718838630f30b112d033ce2e621b34f3</chave>
  </dados-ec>

  <dados-portador>
    <numero>'.$numeroCartao .'</numero>
    <validade>'.$validadeAno.$validadeMes.'</validade>
    <indicador>1</indicador>
    <codigo-seguranca>'.$numeroSeg.'</codigo-seguranca>
  </dados-portador>

  <dados-pedido>
    <numero>178148599</numero>
    <valor>100</valor>
    <moeda>986</moeda>
    <data-hora>'.$horaLocal.'</data-hora>
    <idioma>PT</idioma>
  </dados-pedido>
  <forma-pagamento>
    <bandeira>'.$cartao.'</bandeira>
    <produto>1</produto>
    <parcelas>1</parcelas>
  </forma-pagamento>
  <autorizar>3</autorizar>
  <capturar>false</capturar>
  <gerar-token>true</gerar-token>
</requisicao-transacao>';
$data = array('mensagem' => $xml);

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


$xml = simplexml_load_string($result);
$json = json_encode($xml,JSON_FORCE_OBJECT);


header('Content-Type: application/json');

echo  $json;
?>
