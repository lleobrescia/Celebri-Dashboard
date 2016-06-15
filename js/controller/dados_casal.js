angular.module("dashboard").controller('dados_casal', ['Upload', '$filter', '$route', 'ServiceCasamento', 'ipService', 'UserService', '$scope', function (Upload, $filter, $route, ServiceCasamento, ipService, UserService, $scope) {

  var self = this;
  var ID = UserService.dados.ID;
  var nomeNoiva = UserService.dados.nomeNoiva;
  var nomeNoivo = UserService.dados.nomeNoivo;
  var fotoNoivos = UserService.dados.fotoUrl;
  var dataNoivos = UserService.dados.dataCasamento;

  /**
   * O nome dos noivos e a imagem ja foi pega no login.
   * Aqui eh feito o bind para o html
   */
  self.nome_noiva = nomeNoiva;
  self.nome_noivo = nomeNoivo;
  self.foto = fotoNoivos;

  /**
   * Dados iniciais para o ngImageEditor
   * Nao eh aceito valor null
   */
  self.foto__editor = './image/user_login.png';
  self.selected = { width: 50, height: 50, top: 0, left: 0 };

  //Esconde o popup da edicao da imagem
  self.editar = false;

  //Esconde gif de loding
  self.carregando = false;

  //carrega a foto do casal para edicao
  $scope.openFile = function (elem) {
    var reader = new FileReader();

    reader.onload = function () {
      var dataURL = reader.result;
      self.foto__editor = dataURL;
      self.editar = true;

      // configura os valores para a area de corte inicial
      self.selected.width = 200;
      self.selected.height = 200;
      self.selected.left = 0;
      self.selected.top = 0;
    };
    reader.readAsDataURL(elem.files[0]);
  };

  //Funca para pegar o recorte da imagem e enviar ao servidor
  self.uploadFoto = function () {

    //seconde foto atual e mostra gif de loding
    self.carregando = true;

    /**
     * Pega a foto recordada
     * Transforma em jpg
     * Passa para a base64
     */
    var imagemCortada = self.imageEditor.toDataURL({ useOriginalImg: true, imageType: "image/jpg" });

    //Envia para o servidor
    var upload = Upload.upload({
      url: 'http://celebri.com.br/dashboard/php/enviarFoto.php',
      data: { image: imagemCortada, name: ID }
    });

    //Retorno do servidor
    upload.then(function (resp) {
      /**
       * O nome da imagem nunca muda,portanto
       * ela fica no cache. Para evitar o cache
       * eh preciso colocar ?+a hora atual
       */

      //Retira a hora antiga
      var novaImg = fotoNoivos.split("?");

      //Pega a data e hora atual
      var time = new Date();

      /**
       * Armazena o nome da imagem com a hora atual
       * O filtro [$filter('date')] mostra so a hora
       */
      fotoNoivos = novaImg[0] + "?" + $filter('date')(time, 'H:mm', '-0300');
      self.foto = fotoNoivos;
      UserService.dados.fotoUrl = fotoNoivos;

      //seconde o gif de loding e mostra a nova imagem
      self.carregando = false;

      //refresh a pagina para atualizar a imagem no site
      $route.reload();
    });
  };

  //pega os dados do servidor
  self.casalGetDados = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarDadosCadastroNoivos";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      self.nome_noivo = $(respXml).find('NomeNoivo').text();
      self.nome_noiva = $(respXml).find('NomeNoiva').text();

      var data = $(respXml).find('DataCasamento').text().split('/');
      self.data_casamento = new Date("/" + data[1] + "/" + data[0] + "/" + data[2]);

      UserService.dados.dataCasamento = self.data_casamento;
      UserService.SaveState();
    });
  };

  //salva no servidor os dados
  self.setDadosCasal = function () {
    var casamento = (self.data_casamento.getMonth() + 1) + "/" + self.data_casamento.getDate() + "/" + self.data_casamento.getFullYear();

    var xmlVar = '<DadosCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><AtualizarSenha>false</AtualizarSenha><DataCasamento>' + casamento + '</DataCasamento><NomeNoiva>' + self.nome_noiva + '</NomeNoiva><NomeNoivo>' + self.nome_noivo + '</NomeNoivo><Senha></Senha></DadosCasal>';
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/AtualizarDadosCadastroNoivos";

    //Enviar para o serviço na nuvem
    ServiceCasamento.SendData(urlVar, xmlVar);

    //Salva no serviço local os novos valores.
    UserService.dados.dataCasamento = self.data_casamento;
    UserService.dados.nomeNoiva = self.nome_noiva;
    UserService.dados.nomeNoivo = self.nome_noivo;
  };

  /**
   * Se a data do casamento estiver null, significa que eh a primeira vez que entra
   * pois os nomes dos noivos sao armazenados no login.
   * Nesse caso eh feita uma requisiçao ao servidor.
   * Caso contrario, apenas insere a data no html
   */
  if (dataNoivos == null) {
    self.casalGetDados();
  } else {
    self.data_casamento = new Date(dataNoivos);
  }
}]);