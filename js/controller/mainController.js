/**
 * Main Controller
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$location', 'UserService', '$http', '$window', 'PageService'];

  /**
   * @namespace MainCtrl
   * @desc Principal controlador.Esta acima de todos
   * @memberOf Controllers
   */
  function MainCtrl($location, UserService, $http, $window, PageService) {
    var self = this;
    UserService.RestoreState();

    self.CheckTemplate  = CheckTemplate;
    self.GetTimes       = GetTimes;
    self.page          = PageService;

    Init();

  /**
   * @namespace Init
   * @desc Setup docontrolador
   * @memberOf Controllers.MainCtrl
   */
    function Init() {

      try {
        self.generoNoiva = UserService.dados.generoNoiva;
        self.generoNoivo = UserService.dados.generoNoivo;
      } catch (error) {
         $window.location.reload();
      }

      if (UserService.listaFonts == null) {
        //carrega as informações dos blocos(altura,largura, posicao) de cada convite
        $http.get('data/convites.json')
          .then(function (res) {
            try {
              UserService.dados.listaConvites = res.data;
            } catch (error) {
              $window.location.reload();
            }
          });

        //carrega as fonts
        $http.get('data/fonts.json')
          .then(function (res) {
            UserService.dados.listaFonts = res.data;
          });
        UserService.SaveState();
      }
    }

  /**
   * @namespace GetTimes
   * @desc Roda o ng-repeat n vezes
   * @memberOf Controllers.MainCtrl
   */
    function GetTimes(n) {
      return new Array(n);
    }

  /**
   * @namespace CheckTemplate
   * @desc Verifica se esta na pagina de login para retirar a barra lateral
   * @memberOf Controllers.MainCtrl
   */
    function CheckTemplate() {
      if ('/login' === $location.path()) {
        self.login      = 'login';
        self.cabecalho  = '';
      } else {
        self.login      = '';
        self.cabecalho  = 'templates/parts/sidebar.html';
      }
    }
  }
} ());