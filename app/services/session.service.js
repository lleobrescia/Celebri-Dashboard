(function () {
  'use strict';

  angular
    .module('dashboard')
    .factory('session', session);

  session.$inject = ['$rootScope', '$state'];

  /**
   * @memberof dashboard
   * @ngdoc factory
   * @name session
   * @desc Armazena e fornece informações sobre o usuario e casal
   * @param {service} $rootScope - scope geral
   * @param {service} $state - controle os states
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/providers#factory-recipe} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#factories} Para melhores praticas
   */
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

    /**
     * @function SaveState
     * @desc Salva o service no session
     * @memberof session
     */
    function SaveState() {
      if (service.user === null) {
        service.user = padrao;
      }
      sessionStorage.Session = angular.toJson(service.user);
    }

    /**
     * @function RestoreState
     * @desc Restaura o service do session
     * @memberof session
     */
    function RestoreState() {
      var dados = angular.fromJson(sessionStorage.Session);

      if (dados === undefined || dados === null) {
        SaveState();
      } else {
        service.user = dados;
      }
    }

    /**
     * @function Remove
     * @desc Remove o service do session
     * @memberof session
     */
    function Remove() {
      sessionStorage.removeItem('Session');
      $state.go('login');
    }
  }
})();