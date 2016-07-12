angular.module("dashboard").controller('login', ['$location', 'ipService', 'ServiceCasamento', 'UserService', function ($location, ipService, ServiceCasamento, UserService) {

  var self = this;
  self.recuperarSenha = false;
  self.carregando = false;
  self.confirmacao = false;
  self.nomeUsuario = '';
  self.senhaUsuario = '';

  var ID = UserService.ID;

  /**
   * se existir ID nao ha necessidade de logar
   */
  if (ID != null) {
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
        UserService.dados.ID = $(respXml).find('Id_usuario_logado').text();

        /**
         * Verifica qual email esta logando e armazena o nome de acordo.
         */
        var emailNoivo = $(respXml).find('EmailNoivo').text();

        if (self.nomeUsuario == emailNoivo) {
          UserService.dados.nomeUsuario = $(respXml).find('NomeNoivo').text();
          UserService.dados.senhaApp = $(respXml).find('SenhaNoivoConvidado').text();
        } else {
          UserService.dados.nomeUsuario = $(respXml).find('NomeNoiva').text();
          UserService.dados.senhaApp = $(respXml).find('SenhaNoivaConvidado').text();
        }

        //Armazena os nomes dos noivos localmente
        UserService.dados.nomeNoiva = $(respXml).find('NomeNoiva').text();
        UserService.dados.nomeNoivo = $(respXml).find('NomeNoivo').text();


        //Armazena a url da foto do casal localmente
        var imagemFoto = $(respXml).find('Url_foto').text();

        if (imagemFoto == "NULL") {
          UserService.dados.fotoUrl = 'image/user_login.png';
        } else {
          UserService.dados.fotoUrl = $(respXml).find('Url_foto').text() + "?13:45";
        }

        UserService.SaveState();

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