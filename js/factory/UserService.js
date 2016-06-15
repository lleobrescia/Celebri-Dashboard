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
    dataCasamento: null,

    //Dados Convite
    conviteCheck: false,
    noiva_mae: '',
    noiva_mae_memorian: '',
    noiva_pai: '',
    noiva_pai_memorian: '',
    noivo_mae: '',
    noivo_mae_memorian: '',
    noivo_pai: '',
    noivo_pai_memorian: '',
    cerimonia_cep: '',
    cerimonia_end: '',
    cerimonia_numero: '',
    cerimonia_bairro: '',
    cerimonia_uf: '',
    cerimonia_cidade: '',
    cerimonia_local: '',
    cerimonia_rota: '',
    cerimonia_hora: '',
    cerimonia_min: ''
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