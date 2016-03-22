// INIT
angular.module("dashboard", ['ngRoute','ngFileUpload','ngMask','rzModule']);


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

// angular.module('dashboard').filter('cep', function() {
//   return function(input) {
//     var str = input+ '';
//     str = str.replace(/\D/g,'');
//     str=str.replace(/^(\d{2})(\d{3})(\d)/,"$1.$2-$3");
//     return str;
//   };
// });

angular.module('dashboard').controller('sidebar', ['$scope','$location',function ($scope,$location) {

  //Verifica em qual pag esta
  $scope.isActive = function (viewLocation) {
    var retorno = false;
    if (viewLocation === $location.path() || viewLocation+"/2" === $location.path()) {
      retorno = true
    }
    return retorno;
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

angular.module("dashboard").controller('configurar_convite',['$scope',function($scope) {

  function consultCEP(cep) {
    $.ajax({
      url:"http://api.postmon.com.br/v1/cep/"+cep,
      success:function(data) {
        console.log(data);
      }
    });
  }

}]);

angular.module("dashboard").controller('configurar_convite2',['$scope',function($scope) {
   $scope.convitemsg = "Este é um texto de referência para a mensagem do seu convite. Para editá-lo basta clicar aqui e reescrever. Se você optar por não ter nenhuma mensagem, basta deixar em branco"
}]);

angular.module('dashboard').controller('configurar_evento',['$scope',function($scope) {

  $scope.produtos = [
    {
      nome: 'Cappucino em um café bacana',
      urlImage: './image/produtos/cappucino.png',
      valor: 'R$50'
    },
    {
      nome: 'Visita a um museu descolado',
      urlImage: './image/produtos/museu.png',
      valor: 'R$80'
    },
    {
      nome: 'Massagem',
      urlImage: './image/produtos/massagem.png',
      valor: 'R$100'
    },
    {
      nome: 'Passeio de bike',
      urlImage: './image/produtos/bike.png',
      valor: 'R$150'
    },
    {
      nome: 'Aluguel de carro',
      urlImage: './image/produtos/carro.png',
      valor: 'R$200'
    },
    {
      nome: 'Jantar à luz de velas',
      urlImage: './image/produtos/jantar.png',
      valor: 'R$250'
    },
    {
      nome: 'Passeio inebriente por vinícula',
      urlImage: './image/produtos/vinicula.png',
      valor: 'R$300'
    },
    {
      nome: 'Quarto de hotel ',
      urlImage: './image/produtos/quarto.png',
      valor: 'R$350'
    },
    {
      nome: 'Passeio de balão',
      urlImage: './image/produtos/balao.png',
      valor: 'R$400'
    },
    {
      nome: 'Passeio de barco',
      urlImage: './image/produtos/barco.png',
      valor: 'R$450'
    },
    {
      nome: 'Mergulho nos corais',
      urlImage: './image/produtos/corais.png',
      valor: 'R$500'
    },
    {
      nome: 'Valor livre para o convidado',
      urlImage: './image/produtos/livre.png',
      valor: 'R$'
    }
  ]

  $scope.hoteis = [];
  $scope.removeHotel = function(key) {
    $scope.hoteis.splice(key,1);
  }
  $scope.adicionarHotel = function() {
    if($scope.hotelNome != "" && $scope.hotelNome != null){
      $scope.hoteis.push(
        {
          nome:$scope.hotelNome
        }
      );
      $scope.hotelNome = "";
      $scope.hotelCep = "";
      $scope.hotelEnd = "";
      $scope.hotelNumero = "";
      $scope.hotelBairro = "";
      $scope.hotelCidade = "";
    }
  }


  $scope.saloes = [];
  $scope.removeSalao = function(key) {
    $scope.saloes.splice(key,1);
  }
  $scope.adicionarSalao = function() {
    if($scope.salaoNome != "" && $scope.salaoNome != null){
      $scope.saloes.push(
        {
          nome:$scope.salaoNome
        }
      );
      $scope.salaoNome = "";
      $scope.salaoCep = "";
      $scope.salaoEnd = "";
      $scope.salaoNumero = "";
      $scope.salaoBairro = "";
      $scope.salaoCidade = "";
    }
  }

  $scope.urls = [];
  $scope.removeUrl = function(key) {
    $scope.urls.splice(key,1);
  }
  $scope.adicionarUrl = function() {
    if($scope.urlNome != "" && $scope.urlNome != null){
      $scope.urls.push(
        {
          nome:$scope.urlNome
        }
      );
      console.log($scope.urls);
      $scope.urlNome = "";
      $scope.urlLink = "";
    }
  }

}]);

angular.module("dashboard").controller('cadastrar_convidados',['$scope','Upload',function($scope,Upload) {
  $scope.convidadosCadastrados = [];
  $scope.removeConvidado = function(key) {
    $scope.convidadosCadastrados.splice(key,1);
  }
  $scope.adicionarConvidado = function() {
    if($scope.convidado != "" && $scope.convidado != null){
      $scope.convidadosCadastrados.push(
        {
          nome:$scope.convidado,
          email:$scope.emailConvidado,
          convidados:$scope.aconpanhante,
          telefone:$scope.telefone
        }
      );
      $scope.convidado = "";
      $scope.aconpanhante = "";
      $scope.emailConvidado = "";
      $scope.telefone = "";
    }
  }
}]);

angular.module("dashboard").controller('enviar_convite',['$scope','Upload',function($scope,Upload) {}]);

angular.module("dashboard").controller('save_date',['$scope','Upload',function($scope,Upload) {}]);
