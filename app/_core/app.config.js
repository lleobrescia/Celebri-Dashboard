(function () {
  'use strict';

  angular.module('dashboard')
    .run(Run);

  Run.$inject = ['$rootScope', '$state', 'session'];

  function Run($rootScope, $state, session) {
    $rootScope.$on('$stateChangeSuccess', ChangeSuccess);
    $rootScope.$on('$stateChangeStart', ChangeStart);

    function ChangeStart(event, toState, toParams, fromState, fromParams) {
      var userAuthenticated = false;
      session.RestoreState();

      if (session.user.id) {
        userAuthenticated = true;
      }

      if (!userAuthenticated && !toState.isLogin) {
        event.preventDefault();
        $state.go('login');
      }

      if (toState.name === 'login') {

        $rootScope.isLogin = true;

        if (userAuthenticated) {
          event.preventDefault();
          $state.go('casal');
        }
      } else {
        $rootScope.isLogin = false;
      }
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