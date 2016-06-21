<?php

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);


$body = '<span>Olá '.$_POST['NomeEnvio'].', <br>
essa é a lista dos convidados confirmados para o casamento de '.$_POST['nomeNoiva'].' e '.$_POST['nomeNoivo'].', no dia '.$_POST['dataCasamento'].'</span><br><br>
<table width="500" cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <td style="padding: 10px;">
        <b>Nome do convidado</b>
      </td>
      <td style="padding: 10px;">
        <b>Acompanhantes</b>
      </td>
      <td style="padding: 10px;">
        <b>Nº de Confirmados <br> (Convidado + Acompanhantes)</b>
      </td>
    </tr>
  </thead>';

foreach ($_POST['Dados'] as $value) {
  $body .=' <tr>
    <td style="padding: 10px;">
      '. $value["Nome"].'
    </td>
    <td style="padding: 10px;">';
    foreach ($value['Acompanhantes'] as $nomes) {
      $body .=$nomes['Nome'].'<br>';
    }

    $body .='</td>
    <td align="center" style="padding: 10px;">
     '. $value["Total"].'
    </td>
  </tr>';
}

$body .= '</table>
<span style="margin-top: 30px;display: block;width: 500px;text-align: right;">
  Total geral de convidados: <b>'.$_POST["TotalGeral"].'</b>
  </span>';



$to      = $_POST['EmailEnvio'];
$subject = 'Lista de Casamento [Celebri]';
$message = $body;
$headers = "From: celebri@celebri.com.br \r\n";
$headers .= "Reply-To:celebri@celebri.com.br \r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";


if (mail($to, $subject, $message, $headers)) {
  echo "ok";
} else {
  echo "nao";
}
?>