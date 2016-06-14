angular.module("dashboard").controller('dados_casal', ['$scope', 'Upload', 'DadosCasal', 'user', '$cookies', '$filter', '$route', 'ServiceCasamento', function ($scope, Upload, DadosCasal, user, $cookies, $filter, $route, ServiceCasamento) {

  // evita conflito dentro das funcoes
  var self = this;

  //salva as informações do form dentro de user
  self.setLocalDados = function () {
    var casamento = ($scope.data_casamento.getMonth() + 1) + "/" + $scope.data_casamento.getDate() + "/" + $scope.data_casamento.getFullYear();

    user.dadosCasal.nome_noivo = $scope.nome_noivo;
    user.dadosCasal.nome_noiva = $scope.nome_noiva;
    user.dadosCasal.data_casamento = casamento;

    //Salva no cookie o Objeto user (que contem as informacoes globais)
    $cookies.putObject('user', user);
  };

  /**
   * Dados iniciais para o ngImageEditor
   * Nao eh aceito valor null
   */
  $scope.foto__editor = './image/user_login.png';
  $scope.selected = { width: 50, height: 50, top: 0, left: 0 };

  //Esconde o popup da edicao da imagem
  $scope.editar = false;

  //Esconde gif de loding
  $scope.carregando = false;

  //carrega a foto do casal para edicao
  $scope.openFile = function (elem) {
    var reader = new FileReader();

    reader.onload = function () {
      var dataURL = reader.result;
      $scope.foto__editor = dataURL;
      $scope.editar = true;

      // configura os valores para a area de corte inicial
      $scope.selected.width = 200;
      $scope.selected.height = 200;
      $scope.selected.left = 0;
      $scope.selected.top = 0;
    };
    reader.readAsDataURL(elem.files[0]);
  };

  //Funca para pegar o recorte da imagem e enviar ao servidor
  $scope.uploadFoto = function () {

    //seconde foto atual e mostra gif de loding
    $scope.carregando = true;

    /**
     * Pega a foto recordada
     * Transforma em jpg
     * Passa para a base64
     */
    var imagemCortada = $scope.imageEditor.toDataURL({ useOriginalImg: true, imageType: "image/jpg" });

    //Envia para o servidor
    var upload = Upload.upload({
      url: 'http://celebri.com.br/dashboard/teste.php',
      data: { image: imagemCortada, name: user.id }
    });

    //Retorno do servidor
    upload.then(function (resp) {
      /**
       * O nome da imagem nunca muda,portanto
       * ela fica no cache. Para evitar o cache
       * eh preciso colocar ?+a hora atual
       */

      //Retira a hora antiga
      var novaImg = user.foto.split("?");

      //Pega a data e hora atual
      var time = new Date();

      /**
       * Armazena o nome da imagem com a hora atual
       * O filtro [$filter('date')] mostra so a hora
       */
      user.foto = novaImg[0] + "?" + $filter('date')(time, 'H:mm', '-0300');
      $scope.foto = user.foto;

      //seconde o gif de loding e mostra a nova imagem
      $scope.carregando = false;

      // Armazena no cookie o novo nome da imagem
      $cookies.putObject('user', user);

      //refresh a pagina para atualizar a imagem no site
      $route.reload();
    });
  };

  //pega as informações de user e coloca no $scope
  self.getLocalDados = function () {
    $scope.nome_noivo = user.dadosCasal.nome_noivo;
    $scope.nome_noiva = user.dadosCasal.nome_noiva;
    $scope.data_casamento = new Date(user.dadosCasal.data_casamento);

    $scope.foto = user.foto;
  };

  //pega os dados do servidor
  $scope.casalGetDados = function () {
    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/RetornarDadosCadastroNoivos";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + user.id + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.nome_noivo = $(respXml).find('NomeNoivo').text();
      $scope.nome_noiva = $(respXml).find('NomeNoiva').text();
      $scope.foto = user.foto;

      var data = $(respXml).find('DataCasamento').text().split('/');
      $scope.data_casamento = new Date("/" + data[1] + "/" + data[0] + "/" + data[2]);

      self.setLocalDados();
    });
  };

  //salva no servidor os dados
  $scope.setDadosCasal = function () {
    var casamento = ($scope.data_casamento.getMonth() + 1) + "/" + $scope.data_casamento.getDate() + "/" + $scope.data_casamento.getFullYear();
    var xml = '<DadosCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + user.id + '</Id_casal><AtualizarSenha>false</AtualizarSenha><DataCasamento>' + casamento + '</DataCasamento><NomeNoiva>' + $scope.nome_noiva + '</NomeNoiva><NomeNoivo>' + $scope.nome_noivo + '</NomeNoivo><Senha></Senha></DadosCasal>';

    self.setLocalDados();
    DadosCasal.setData(xml);
  };

  // Setup/construtor
  if (user.id == null) {
    user = $cookies.getObject('user');
    if (user.dadosCasal.nome_noiva == null || user.dadosCasal.nome_noiva == "") {
      $scope.casalGetDados();
    } else {
      self.getLocalDados();
    }
  } else if (user.dadosCasal.nome_noiva == null) {
    $scope.casalGetDados();
  } else {
    self.getLocalDados();
  }
}]);