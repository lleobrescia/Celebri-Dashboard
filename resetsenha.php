<?php

$key = $_GET['chaveConfirmacao'];

if (!$key) {
	header("Location: http://celebri.com.br/dashboard/#/login");
}

if (isset($_POST['enviar'])) {

  $senha = $_POST['senha'];
  $segundaSenha = $_POST['segundaSenha'];

  if($senha != $segundaSenha){
    $result = "Senha não confere.";
  }
  else{
    $url = 'http://23.238.16.114/celebri/web/service_request.aspx';
    $uri = 'http://23.238.16.114/celebri/ServiceCasamento.svc/AlteracaoSenhaCasal';
    $xml = '<DadosCasalAlteracaoSenha xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Chave>'.$key.'</Chave>  <NovaSenha>'.$senha.'</NovaSenha></DadosCasalAlteracaoSenha>';

    $data = array('uri' => $uri , 'xml' => $xml );

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
  }
}
?>

<!DOCTYPE html>
<html lang="pt-br" class="no-js">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofallow">

  <meta http-equiv="cache-control" content="no-cache">
  <meta http-equiv="content-language" content="pt-br">

  <base href="/dashboard/">
  <title>Dashboard</title>

  <!--JQUERY-->
  <script src="https://cdn.jsdelivr.net/jquery/2.2.1/jquery.min.js"></script>
  <!--MODERNIZR-->
  <script src="https://cdn.jsdelivr.net/modernizr/2.8.3/modernizr.min.js"></script>

  <link rel="shortcut icon" type="image/png" href="image/favicon.png" />

  <!--NORMALIZE-->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/normalize/3.0.3/normalize.min.css">
  <!--FONT-->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/fontawesome/4.5.0/css/font-awesome.min.css">
  <!--BOOTSTRAP-->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/bootstrap/3.3.6/css/bootstrap.min.css">
  <!--CSS SITE-->
  <link rel="stylesheet" href="css/styles.css">

  <!--[if lt IE 9]>
  <script src="https://cdn.jsdelivr.net/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://cdn.jsdelivr.net/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
</head>

<body>
  <div class="wrapper" ng-class="login" style="padding-left:0">

    <section class="content">
      <div class="login__bg" ng-init="checkTemplate()">
        <div class="container">

          <div class="row">
            <div class="col-xs-12">
              <a href="http://celebri.com.br/">
                <img src="image/celebri.png" alt="Celebri">
              </a>
            </div>
            <!--col-xs-12-->
          </div>
          <!--row-->
          <div class="row">
            <div class="col-xs-12" style="margin-bottom: 70px;color: white;">
              <!--login__content-->
              <div class="login__box">
                <p class="text-center">Digite sua nova senha.</p><br>

                <form class="login__form" method="POST" enctype="multipart/form-data">

                  <p>Senha:</p>
                  <input type="password" name="senha" required style="color: black;"> <br>
                  <p>Repetir senha:</p>
                  <input type="password" name="segundaSenha" required style="color: black;"><br>
                  <input type="submit" value="OK" name="enviar">

                  <div class="clearfix"></div>

                  <p><br><br><br><?php echo $result; ?></p>

                </form>
              </div>
              <!--login__box-->
            </div>
            <!--col-xs-12-->
          </div>
          <!--row-->
        </div>
        <!--container-->

        <div class="container-fluid login__footer">
          <div class="container ">
            <div class="row">
              <div class="col-xs-12 login_logo_footer">
                <a href="http://celebri.com.br/">
                  <img src="image/celebri.png" alt="Celebri">
                </a>
              </div>
              <!--col-xs-12-->
            </div>
            <!--row-->
            <div class="row">
              <div class="col-xs-12">
                <nav class="menu__footer">
                  <ul>
                    <li>
                      <a href="http://www.celebri.com.br">Home</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/comofunciona">Como funciona</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/porqueusar">Porque usar?</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/tarifas">Tarifas</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/cotas">Cotas Lua de mel</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/perguntas">Perguntas</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/cadastro">Cadastre-se</a>
                    </li>
                    <li>
                      <a href="http://celebri.com.br/dashboard">Login</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/quemsomos">Quem Somos</a>
                    </li>
                    <li>
                      <a href="http://www.celebri.com.br/contato">Contato</a>
                    </li>
                  </ul>
                </nav>
                <p class="text-center">©2016 - www.celebri.com.br - Um produto da Pixla - Todos os direitos reservados.</p>
              </div>
              <col-xs-12></col-xs-12>
            </div>
            <!--row-->
          </div>
          <!--container-->
        </div>
        <!--login__footer-->
      </div>
      <!-- login__bg -->
    </section>

  </div>
  <!-- wrapper -->
</body>

</html>