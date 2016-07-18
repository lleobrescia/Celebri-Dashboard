/**
 * login.js
 * templateUrl: "/dashboard/templates/page/login.html"
 * controllerAs: 'loginCtrl'
 */
(function () {
  'use strict';
  angular
    .module("dashboard")
    .controller('login', Login);

  Login.$inject = ['$location', 'ipService', 'ServiceCasamento', 'UserService', '$rootScope'];

  function Login($location, ipService, ServiceCasamento, UserService, $rootScope) {

    var self = this;
    //ID do usuario. Para verificar se ele ja entrou
    var ID = UserService.ID;

    self.recuperarSenha = false;//Controla o display da tela de recuperar a senha
    self.carregando = false;//Controla o display do gif de loading
    self.confirmacao = false;//Controla o display da tela de confirmação do email enviado
    self.nomeUsuario = '';//Input nome do usuario
    self.senhaUsuario = '';//Input senha do usuario

    self.Autenticar = Autenticar;
    self.EnviarEmail = EnviarEmail;

    /**
     * Se existir ID nao ha necessidade de logar
     */
    if (ID != null) {
      $location.path('/dados-do-casal');
    }

    /**
     * Funcao para fazer o login.
     * Envia os dados para o servidor
     * Armazena os nomes dos noivos, a foto e a senha para o app de teste
     */
    function Autenticar() {
      self.carregando = true;
      self.result = 'true';

      var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/AutenticacaoNoivos";
      var xmlVar = '<Autenticacao xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.nomeUsuario + '</Email><Senha>' + self.senhaUsuario + '</Senha></Autenticacao>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var check = $(respXml).find('Result').text();

        //Autenticado
        if (check == 'true') {
          //limpa o box de erro, caso houve erro de login anteriormente
          self.result = 'true';
          self.errorMessage = "";

          //armazena o ID
          UserService.dados.ID = $(respXml).find('Id_usuario_logado').text();

          // Verifica qual email esta logando e armazena o nome de acordo.
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

          //Verifica a existencia da foto
          if (imagemFoto == "NULL") {
            UserService.dados.fotoUrl = 'image/user_login.png';
          } else {
            UserService.dados.fotoUrl = $rootScope.fotoCasal = $(respXml).find('Url_foto').text() + "?13:45";
          }

          //Salva os dados localmente
          UserService.SaveState();

          //Direciona para a primeira pagina do dashboard
          $location.path('/dados-do-casal');
        }

        //Nao autenticado
        else {
          self.carregando = false;
          //Mostra a mensagem de erro
          self.result = check;
          self.errorMessage = $(respXml).find('ErrorMessage').text();
        }
      });
    }

    /**
     * Envia um email, para os noivos, para recuepracao de senha.
     */
    function EnviarEmail() {
      self.carregando = true;
      self.result = 'true';

      var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/EnviarEmailRecuperacaoSenha";
      var xmlVar = '<EmailCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.recEmail + '</Email></EmailCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var check = $(respXml).find('Result').text();

        if (check == 'false') {
          self.errorMessage = "E-mail não encontrado na nossa base de dados.";
          self.result = check;
        } else {
          self.confirmacao = true;
        }
        self.carregando = false;
      });
    }
  }
})();