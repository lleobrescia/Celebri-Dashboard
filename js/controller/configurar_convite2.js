angular.module("dashboard").controller('configurar_convite2', ['UserService', 'ServiceCasamento', 'ipService', function (UserService, ServiceCasamento, ipService) {

  var self = this;
  var ID = UserService.dados.ID;

  self.thumbNome = 'Laranja';
  self.thumbEscolhido = 'image/convites/thumb/thumb1.png';

  self.thumbs = [
    {
      ID: 1,
      url: 'image/convites/thumb/thumb1.png',
      nome: 'Laranja'
    },
    {
      ID: 3,
      url: 'image/convites/thumb/thumb3.png',
      nome: 'Ramos'
    },
    {
      ID: 4,
      url: 'image/convites/thumb/thumb4.png',
      nome: 'Plain'
    },
    {
      ID: 6,
      url: 'image/convites/thumb/thumb6.png',
      nome: 'Gold'
    }
  ];

  self.setConvite = function (id, nome, url) {
    self.thumbNome = nome;
    self.thumbEscolhido = url;
    UserService.dados.modeloConvite = id;
    UserService.SaveState();
  };

}]);