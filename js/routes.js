(function () {
  'use strict';
  angular
    .module('dashboard')
    .config(RouteConfig)
    .run(RouteRun);

  RouteConfig.$inject = ['$routeProvider','$locationProvider'];
  function RouteConfig($routeProvider,$locationProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
    
    $routeProvider
      .when('/', {
        redirectTo: '/login'
      })
      .when('/pagamento', {
        templateUrl : 'templates/page/pagamento.html',
        controller  : 'PagamentoCtrl',
        controllerAs: 'Pagamento'
      })
      .when('/dados-do-casal', {
        templateUrl : '/dashboard/templates/page/dados_casal.html',
        controller  : 'DadosCasalCtrl',
        controllerAs: 'casal'
      })
      .when('/evento', { redirectTo: '/evento/recepcao' })
      .when('/evento/recepcao', {
        templateUrl : '/dashboard/templates/page/evento/recepcao.html',
        controller  : 'RecepcaoCtrl',
        controllerAs: 'recepcao'
      })
      .when('/evento/dicas-hoteis', {
        templateUrl : '/dashboard/templates/page/evento/dicas-hotel.html',
        controller  : 'DicasHotelCtrl',
        controllerAs: 'hotel'
      })
      .when('/evento/dicas-salao-beleza', {
        templateUrl : '/dashboard/templates/page/evento/dicas-salao.html',
        controller  : 'DicasSalaoCtrl',
        controllerAs: 'salao'
      })
      .when('/evento/lista-presentes', {
        templateUrl : '/dashboard/templates/page/evento/lista-presentes.html',
        controller  : 'ListaPresentesCtrl',
        controllerAs: 'presentes'
      })
      .when('/evento/cardapio', {
        templateUrl : '/dashboard/templates/page/evento/cardapio.html',
        controller  : 'CardapioCtrl',
        controllerAs: 'cardapio'
      })
      .when('/cerimonia', {
        templateUrl : '/dashboard/templates/page/convite/cerimonia.html',
        controller  : 'CerimoniaCtrl',
        controllerAs: 'cerimonia'
      })
      .when('/configurar-convite', {
        templateUrl : '/dashboard/templates/page/convite/config-convite.html',
        controller  : 'ConfigurarConviteCtrl',
        controllerAs: 'config'
      })
      .when('/personalizar-convite', {
        templateUrl : '/dashboard/templates/page/convite/personalizar-convite.html',
        controller  : 'PersonalizarConviteCtrl',
        controllerAs: 'personalizar'
      })
      .when('/save-the-date', { redirectTo: '/save-the-date/configurar' })
      .when('/save-the-date/configurar', {
        templateUrl : '/dashboard/templates/page/save-the-date/configurar.html',
        controller  : 'ConfigurarSaveDateCtrl',
        controllerAs: 'saveDate'
      })
      .when('/save-the-date/enviar', {
        templateUrl : '/dashboard/templates/page/save-the-date/enviar.html',
        controller  : 'EnviarSaveDateCtrl',
        controllerAs: 'saveDate'
      })
      .when('/enviar-convite', {
        templateUrl : '/dashboard/templates/page/convite/enviar-convite.html',
        controller  : 'EnviarConviteCtrl',
        controllerAs: 'enviar'
      })
      .when('/convidados', { redirectTo: '/convidados/cadastrar' })
      .when('/convidados/cadastrar', {
        templateUrl : '/dashboard/templates/page/convidados/cadastrar.html',
        controller  : 'CadastrarConvidadosCtrl',
        controllerAs: 'convidados'
      })
      .when('/convidados/confirmados', {
        templateUrl : '/dashboard/templates/page/convidados/confirmados.html',
        controller  : 'ConfirmadosCtrl',
        controllerAs: 'confirmados'
      })
      .when('/estatisticas', {
        templateUrl : '/dashboard/templates/page/estatistica.html',
        controller  : 'EstatisticaCtrl',
        controllerAs: 'estatistica'
      })
      .when('/login', {
        templateUrl : '/dashboard/templates/page/login.html',
        controller  : 'LoginCtrl',
        controllerAs: 'login',
        isLogin     : true
      })
      .otherwise({ redirectTo: '/login' });
  }

  RouteRun.$inject = ['$rootScope', 'PageService', '$document'];
  function RouteRun($rootScope, PageService, $document) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

      if (next.templateUrl) {
        // interagindo com o Analytics através do objeto global ga
        // ga('send', 'pageview', { page: '/dashboard/#' + next.$$route.originalPath });
      }
    }); 
  }
} ());