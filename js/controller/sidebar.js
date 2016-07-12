angular.module('dashboard').controller('sidebar', ['$location', 'UserService', '$scope', function ($location, UserService, $scope) {

  var self = this;
  var id = UserService.dados.ID;

  self.usuarioLogado = UserService.dados.nomeUsuario;


  //Verifica em qual pag esta
  $scope.isActive = function (viewLocation) {
    var retorno = false;
    if (viewLocation == $location.path() || viewLocation + "/2" == $location.path()) {
      retorno = true;
    }
    return retorno;
  };

  self.sair = function () {
    UserService.dados.ID = null;
    UserService.Remove();

    //direciona para a pagina de login
    $location.path('/login');
  };

  //Lista do menu
  self.menu =
    [
      {
        Id: 1,
        Name: "Dados do Casal",
        url: 'dados-do-casal'
      },
      {
        Id: 2,
        Name: 'Configurar Convite',
        url: 'configurar-convite'
      },
      {
        Id: 3,
        Name: 'Configurar Evento',
        url: 'configurar-evento'
      },
      {
        Id: 4,
        Name: 'Cadastrar Convidados',
        url: 'cadastrar-convidados'
      },
      {
        Id: 5,
        Name: 'Save the Date',
        url: 'save-the-date'
      },
      {
        Id: 6,
        Name: 'Enviar Convite',
        url: 'enviar-convite'
      },
      {
        Id: 7,
        Name: 'Lista de Confirmados',
        url: 'confirmados'
      },
      {
        Id: 8,
        Name: 'Estatísticas do Convite',
        url: 'estatisticas'
      }
    ];
}]);