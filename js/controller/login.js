/**
 * Login Controller
 * controllerAs: 'loginCtrl'
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('login', Login);

  /**
   * $location - Serve para redirecionar o usuario depois de logar.
   * ipService - Pega o IP do servidor
   * ServiceCasamento - Factory para enviar os dados para o servidor
   * UserService - Factory para armazenar os dados do casal. Utiliza session storage.
   * $rootScope - Armazena a foto do casal globalmente, pois eh usado em dois controllers
   */
  Login.$inject = ['$location', 'ipService', 'ServiceCasamento', 'UserService', '$rootScope'];

  /**
   * @namespace Login
   * @desc Sistema de login do dashboard
   * @memberOf Controllers
   */
  function Login($location, ipService, ServiceCasamento, UserService, $rootScope) {

    var self = this;
    //ID do usuario. Para verificar se ele ja entrou
    var ID = UserService.ID;

    self.recuperarSenha = false;//Controla o display da tela de recuperar a senha
    self.carregando = false;//Controla o display do gif de loading
    self.confirmacao = false;//Controla o display da tela de confirmação do email enviado
    self.nomeUsuario = '';//Input nome do usuario(email)
    self.senhaUsuario = '';//Input senha do usuario

    self.Autenticar = Autenticar;
    self.EnviarEmail = EnviarEmail;

    // Se existir ID nao ha necessidade de logar
    if (ID != null) {
      $location.path('/dados-do-casal');
    }

    /**
     * @name Autenticar
     * @desc Autenticar os noivos.Envia os dados para o servidor.
     * Armazena os nomes dos noivos, a foto e a senha para o app de teste
     * @memberOf Controllers.Login
     */
    function Autenticar() {
      self.carregando = true;
      self.result = 'true';

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/AutenticacaoNoivos';
      var xmlVar = '<Autenticacao xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.nomeUsuario + '</Email><Senha>' + self.senhaUsuario + '</Senha></Autenticacao>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var check = $(respXml).find('Result').text();

        //Autenticado
        if (check === 'true') {
          //limpa o box de erro, caso houve erro de login anteriormente
          self.result = 'true';
          self.errorMessage = '';

          //armazena o ID
          UserService.dados.ID = $(respXml).find('Id_usuario_logado').text();

          // Verifica qual email esta logando e armazena o nome de acordo.
          var emailNoivo = $(respXml).find('EmailNoivo').text();

          if (self.nomeUsuario === emailNoivo) {
            UserService.dados.nomeUsuario = $(respXml).find('NomeNoivo').text();
            UserService.dados.senhaApp = $(respXml).find('SenhaNoivoConvidado').text();
          } else {
            UserService.dados.nomeUsuario = $(respXml).find('NomeNoiva').text();
            UserService.dados.senhaApp = $(respXml).find('SenhaNoivaConvidado').text();
          }

          //Armazena os nomes dos noivos localmente
          UserService.dados.nomeNoiva = $(respXml).find('NomeNoiva').text();
          UserService.dados.nomeNoivo = $(respXml).find('NomeNoivo').text();

          UserService.dados.emailUsuario = self.nomeUsuario;

          //Armazena a url da foto do casal localmente
          var imagemFoto = $(respXml).find('Url_foto').text();

          //Verifica a existencia da foto
          if (imagemFoto === 'NULL') {
            UserService.dados.fotoUrl = $rootScope.fotoCasal = 'image/user_login.png';
          } else {
            var d = new Date();
            var h = d.getHours();
            var m = d.getMinutes();

            UserService.dados.fotoUrl = $rootScope.fotoCasal = $(respXml).find('Url_foto').text() + '?' + h + ':' + m;
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
      }).catch(function (error) {
        console.error('Erro ao autenticar', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

    /**
     * @name EnviarEmail
     * @desc Envia um email, para os noivos, para recuepracao de senha.
     * @memberOf Controllers.Login
     */
    function EnviarEmail() {
      self.carregando = true;
      self.result = 'true';

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/EnviarEmailRecuperacaoSenha';
      var xmlVar = '<EmailCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.recEmail + '</Email></EmailCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var check = $(respXml).find('Result').text();

        if (check === 'false') {
          self.errorMessage = 'E-mail não encontrado na nossa base de dados.';
          self.result = check;
        } else {
          self.confirmacao = true;
        }
        self.carregando = false;
      }).catch(function (error) {
        console.error('Erro ao enviar o email', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }
  }
})();