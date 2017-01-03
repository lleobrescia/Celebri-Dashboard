(function() {
  'use strict';

  angular.module('dashboard')
    .run(Run);

  Run.$inject = ['$rootScope', '$state', 'session'];

  function Run($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', ChangeSuccess);
    $rootScope.$on('$stateChangeStart', ChangeStart);

    function ChangeStart(event, toState, toParams, fromState, fromParams) {
      session.RestoreState();
    }

    function ChangeSuccess() {
      $rootScope.$broadcast('restorestate');
      //Change page title, based on Route information
      $rootScope.title = $state.current.title;
    }
  }
})();