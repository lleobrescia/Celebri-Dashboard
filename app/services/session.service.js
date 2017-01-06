(function () {
  'use strict';

  angular
    .module('dashboard')
    .factory('session', session);

  session.$inject = ['$rootScope', '$state'];

  function session($rootScope, $state) {
    var padrao = {
      casal: {
        'nomeNoivo': '',
        'nomeNoiva': '',
        'generoNoiva': 'F',
        'generoNoivo': 'M',
        'urlFoto': '',
        'emailUsuario': '',
        'nomeUser': '',
        'senhaApp': '',
        'dataCasamento': ''
      },
      cerimonia: [],
      convite: [],
      diasCadastros: 0,
      id: null,
      pagante: false,
      usuarioLiberado: false
    };

    var service = {
      user: padrao,
      SaveState: SaveState,
      RestoreState: RestoreState,
      Remove: Remove
    };

    $rootScope.$on('savestate', service.SaveState);
    $rootScope.$on('restorestate', service.RestoreState);

    return service;

    ////////////////
    function SaveState() {
      if (service.user === null) {
        service.user = padrao;
      }
      sessionStorage.Session = angular.toJson(service.user);
    }

    function RestoreState() {
      var dados = angular.fromJson(sessionStorage.Session);

      if (dados === undefined || dados === null) {
        SaveState();
      } else {
        service.user = dados;
      }
    }

    function Remove() {
      sessionStorage.removeItem('Session');
      $state.go('login');
    }
  }
})();