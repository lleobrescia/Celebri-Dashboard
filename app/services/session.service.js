(function() {
  'use strict';

  angular
    .module('dashboard')
    .factory('session', session);

  session.$inject = ['$rootScope'];

  function session($rootScope) {
    var padrao = {
      id: 34, // escola de exemplo.
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
      sessionStorage.Session = angular.toJson(padrao);
      service.user = padrao;
    }
  }
})();