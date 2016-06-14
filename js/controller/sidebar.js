angular.module('dashboard').controller('sidebar', ['$scope', '$location', '$cookies', 'user', function ($scope, $location, $cookies, user) {

  if (user.id == null) {
    user = $cookies.getObject('user');
    $scope.fotoCasal = user.foto;
    $scope.usuarioLogado = user.nomeUsuario;
  } else {
    $scope.fotoCasal = user.foto;
    $scope.usuarioLogado = user.nomeUsuario;
  }

  //Verifica em qual pag esta
  $scope.isActive = function (viewLocation) {
    var retorno = false;
    if (viewLocation == $location.path() || viewLocation + "/2" == $location.path()) {
      retorno = true;
    }
    return retorno;
  };

  $scope.sair = function () {
    //Remove o cookie
    $cookies.remove('user');

    //garante que os dados serao apagados
    user = null;

    //direciona para a pagina de login
    $location.path('/login');
  };

  //Lista do menu
  $scope.menu =
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
        Name: 'Estatísticas do Convite',
        url: 'estatisticas'
      }
    ];
}]);