// INIT
angular.module("dashboard", ['ngRoute','ngFileUpload']);


//cria o formato dos itens do menu
angular.module('dashboard').directive("navigation", [function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      menu: '='
    },
    templateUrl: '/dashboard/templates/navigation.html'
  };

}]);


angular.module('dashboard').controller('sidebar', ['$scope','$location',function ($scope,$location) {

  //Verifica em qual pag esta
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  //Lista do menu
  $scope.menu =
  [
    {
      Id: 1,
      Name: "Dados do Casal",
      url:'dados-do-casal'
    },
    {
      Id: 2,
      Name: 'Configurar Convite',
      url:'configurar-convite'
    },
    {
      Id: 3,
      Name: 'Configurar Evento',
      url:'configurar-evento'
    },
    {
      Id: 4,
      Name: 'Cadastrar Convidados',
      url:'cadastrar-convidados'
    },
    {
      Id: 5,
      Name: 'Save the Date',
      url:'save-the-date'
    },
    {
      Id: 6,
      Name: 'Enviar Convite',
      url:'enviar-convite'
    },
    {
      Id: 7,
      Name: 'Convidados Confirmados',
      url:'convidados-confirados'
    }
  ];
}]);

angular.module("dashboard").controller('dados_casal',['$scope','Upload',function($scope,Upload) {}]);
