(function() {
  'use strict';

  angular
    .module('dashboard')
    .config(RouteConfig);

  RouteConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

  function RouteConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login',
        title: '- Acessar o Dashboard',
        isLogin: true
      })
      .state('pagamento', {
        url: '/pagamento',
        cache: false,
        templateUrl: 'app/pagamento/pagamento.html',
        controller: 'Pagamentoontroller',
        controllerAs: 'pagamento',
        title: '- Pagamento'
      })
      .state('casal', {
        url: '/casal',
        cache: false,
        templateUrl: 'app/casal/casal.html',
        controller: 'CasalController',
        controllerAs: 'casal',
        title: '- Dados do Casal'
      })
      .state('configurarConvite', {
        url: '/convite/configurar',
        cache: false,
        templateUrl: 'app/convite/configurar/configurar.html',
        controller: 'ConfigurarConviteController',
        controllerAs: 'convite',
        title: '- Configurar Convite'
      })
      .state('savethedate', {
        url: '/save-the-date',
        cache: false,
        templateUrl: 'app/convite/date/save-date.html',
        controller: 'SaveDateController',
        controllerAs: 'save',
        title: '- Save the Date'
      })
      .state('enviarConvite', {
        url: '/convite/enviar',
        cache: false,
        templateUrl: 'app/convite/enviar.html',
        controller: 'EnviarConviteController',
        controllerAs: 'enviar',
        title: '- Enviar Convite'
      })
      .state('recepcao', {
        url: '/evento/recepcao',
        cache: false,
        templateUrl: 'app/evento/recepcao/recepcao.html',
        controller: 'RecepcaoController',
        controllerAs: 'recepcao',
        title: '- Recepção'
      })
      .state('hotel', {
        url: '/evento/dicas-de-hotel',
        cache: false,
        templateUrl: 'app/evento/hotel/hotel.html',
        controller: 'HotelController',
        controllerAs: 'hotel',
        title: '- Dicas de Hotel'
      })
      .state('salao', {
        url: '/evento/dicas-de-salao-de-beleza',
        cache: false,
        templateUrl: 'app/evento/salao/salao.html',
        controller: 'SalaoController',
        controllerAs: 'salao',
        title: '- Dicas de Salão de Beleza'
      })
      .state('presentes', {
        url: '/evento/lista-de-presentes',
        cache: false,
        templateUrl: 'app/evento/presentes/presentes.html',
        controller: 'PresentesController',
        controllerAs: 'presentes',
        title: '- Lista de Presentes'
      })
      .state('cardapio', {
        url: '/evento/cardapio',
        cache: false,
        templateUrl: 'app/evento/cardapio/cardapio.html',
        controller: 'CardapioController',
        controllerAs: 'cardapio',
        title: '- Cardápio'
      })
      .state('cotas', {
        url: '/evento/cotas-de-lua-de-mel',
        cache: false,
        templateUrl: 'app/evento/cotas/cotas.html',
        controller: 'CotasController',
        controllerAs: 'cotas',
        title: '- Cotas de Lua de Mel'
      })
      .state('cadastrarConvidados', {
        url: '/convidado/cadastrar',
        cache: false,
        templateUrl: 'app/convidado/cadastrar.html',
        controller: 'CadastrarConvidadoController',
        controllerAs: 'convidados', 
        title: '- Cadastrar Convidados'
      })
      .state('convidadosConfirmados', {
        url: '/convidado/confirmados',
        cache: false,
        templateUrl: 'app/convidado/confirmados.html',
        controller: 'ConvidadosConfirmadosController',
        controllerAs: 'convidados',
        title: '- Convidados Confirmados'
      })
      .state('estatisticas', {
        url: '/estatisticas',
        cache: false,
        templateUrl: 'app/estatisticas/estatisticas.html',
        controller: 'Estatisticasontroller',
        controllerAs: 'estatisticas',
        title: '- Estatísticas'
      });
  }
})();