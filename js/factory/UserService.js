angular.module("dashboard").factory('UserService', function () {
  var userData = {
    //Login
    ID: '',
    nomeUsuario: '',
    fotoUrl: '',
    senhaApp: '',

    //Dados do Casal
    nomeNoiva: '',
    nomeNoivo: '',
    dataCasamento: ''

  };

  return {
    setData: function (name, value) {
      userData[name] = value;
    },
    getData: function (name) {
      return userData[name];
    },
    user: function () {
      return userData;
    }
  };
});