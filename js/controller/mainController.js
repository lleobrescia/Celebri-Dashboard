(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$location', 'UserService', '$http', '$window'];
  function MainCtrl($scope, $location, UserService, $http, $window) {
    var self = this;

    self.CheckTemplate  = CheckTemplate;
    self.GetTimes       = GetTimes;

    init();

    function init() {
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

    function GetTimes(n) {
      return new Array(n);
    }

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