angular.module("dashboard").controller('login', ['user', '$location', '$cookies', 'UserService', 'ipService', 'ServiceCasamento', function (user, $location, $cookies, UserService, ipService, ServiceCasamento) {

  var self = this;
  self.recuperarSenha = false;
  self.carregando = false;
  self.confirmacao = false;
  self.nomeUsuario = '';
  self.senhaUsuario = '';

  var usuario = $cookies.getObject('user');

  /**
   * se existir cookie nao ha necessidade de logar
   */
  if (usuario != null) {
    user = usuario;
    $location.path('/dados-do-casal');
  }

  self.autenticar = function () {
    self.carregando = true;
    self.Result = 'true';

    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/AutenticacaoNoivos";
    var xmlVar = '<Autenticacao xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.nomeUsuario + '</Email><Senha>' + self.senhaUsuario + '</Senha></Autenticacao>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      var check = $(respXml).find('Result').text();

      //autenticado
      if (check == 'true') {
        //limpa o box de erro, caso houve erro de login anteriormente
        self.Result = 'true';
        self.ErrorMessage = "";

        //armazena o ID
        UserService.setData("ID", $(respXml).find('Id_usuario_logado').text());
        user.id = $(respXml).find('Id_usuario_logado').text();

        /**
         * Verifica qual email esta logando e armazena o nome de acordo.
         */
        var emailNoivo = $(respXml).find('EmailNoivo').text();

        if (self.nomeUsuario == emailNoivo) {
          UserService.setData("nomeUsuario", $(respXml).find('NomeNoivo').text());
          UserService.setData("senhaApp", $(respXml).find('SenhaNoivoConvidado').text());

          user.nomeUsuario = $(respXml).find('NomeNoivo').text();
          user.senhaApp = $(respXml).find('SenhaNoivoConvidado').text();
        } else {
          UserService.setData("nomeUsuario", $(respXml).find('NomeNoiva').text());
          UserService.setData("senhaApp", $(respXml).find('SenhaNoivaConvidado').text());

          user.nomeUsuario = $(respXml).find('NomeNoiva').text();
          user.senhaApp = $(respXml).find('SenhaNoivaConvidado').text();
        }

        //Armazena os nomes dos noivos localmente
        UserService.setData("nomeNoiva", $(respXml).find('NomeNoiva').text());
        UserService.setData("nomeNoivo", $(respXml).find('NomeNoivo').text());
        user.nome_noiva = $(respXml).find('NomeNoiva').text();
        user.nome_noivo = $(respXml).find('NomeNoivo').text();

        //Armazena a url da foto do casal localmente
        var imagemFoto = $(respXml).find('Url_foto').text();

        if (imagemFoto == "NULL") {
          UserService.setData("fotoUrl", 'image/user_login.png');
          user.foto = 'image/user_login.png';
        } else {
          UserService.setData("fotoUrl", $(respXml).find('Url_foto').text() + "?13:45");
          user.foto = $(respXml).find('Url_foto').text();
          //evita cache da imagem
          user.foto += "?13:45";
        }

        //Salva no cookie o Objeto user (que contem as informacoes globais)
        $cookies.putObject('user', user);

        //Direciona para a primeira pagina do dashboard
        $location.path('/dados-do-casal');

      }
      //nao autenticado
      else {
        self.carregando = false;
        //Mostra a mensagem de erro
        self.Result = check;
        self.ErrorMessage = $(respXml).find('ErrorMessage').text();
      }
    });
  };

  self.enviarEmail = function () {
    self.carregando = true;
    self.Result = 'true';

    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/EnviarEmailRecuperacaoSenha";
    var xmlVar = '<EmailCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.recEmail + '</Email></EmailCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      var check = $(respXml).find('Result').text();

      if (check == 'false') {
        self.ErrorMessage = "E-mail não encontrado na nossa base de dados.";
        self.Result = check;
      } else {
        self.confirmacao = true;
      }
      self.carregando = false;
    });
  };
}]);