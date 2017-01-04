(function () {
  'use strict';

  angular.module('dashboard')
    .run(Run);

  Run.$inject = ['$rootScope', '$state', 'session'];

  function Run($rootScope, $state, session) {
    $rootScope.$on('$stateChangeSuccess', ChangeSuccess);
    $rootScope.$on('$stateChangeStart', ChangeStart);

    function ChangeStart(event, toState, toParams, fromState, fromParams) {
      session.RestoreState();
    }

    function ChangeSuccess() {
      $rootScope.personalizar = false; //usado para escoder a navegacao lateral
      $rootScope.$broadcast('restorestate');
      //Change page title, based on Route information
      $rootScope.title = $state.current.title;

      /**
       * Verifica se esta na pagina de personalizar o convite
       * e escode a navegacao lateral
       * a variavel eh usada no arquivo sidebar.html
       */
      if ($state.current.name === 'personalizar') {
        $rootScope.personalizar = true;
      }
    }
  }
})();