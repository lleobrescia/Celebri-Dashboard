angular.module("dashboard").factory('UserService', ['$rootScope', function ($rootScope) {

  var padrao = {
    //Login
    ID: null,
    nomeUsuario: '',
    fotoUrl: '',
    senhaApp: '',

    //Dados do Casal
    nomeNoiva: '',
    nomeNoivo: '',
    dataCasamento: null
  };

  var service = {

    dados: null,

    SaveState: function () {
      console.log("save");
      sessionStorage.UserService = angular.toJson(service.dados);
    },

    RestoreState: function () {
      console.log("load");
      try {
        service.dados = angular.fromJson(sessionStorage.UserService);
      } catch (error) {
        service.dados = padrao;
      }

    },
    Remove: function () {
      sessionStorage.UserService = null;
      service.dados = padrao;
    }
  };

  $rootScope.$on("savestate", service.SaveState);
  $rootScope.$on("restorestate", service.RestoreState);

  return service;
}]);