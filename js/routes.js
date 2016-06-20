// Navegação
angular.module("dashboard").config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: "/login"
    })
    .when('/dados-do-casal', {
      templateUrl: "/dashboard/templates/page/dados_casal.html",
      controller: 'dados_casal',
      controllerAs: 'dadosCasalCtrl'
    })
    .when('/configurar-convite', {
      templateUrl: "/dashboard/templates/page/configurar_convite.html",
      controller: 'configurar_convite',
      controllerAs: 'configConviteCtrl'
    })
    .when('/configurar-convite/2', {
      templateUrl: "/dashboard/templates/page/configurar_convite2.html",
      controller: 'configurar_convite2',
      controllerAs: 'configConvite2Ctrl'
    })
    .when('/configurar-evento', {
      templateUrl: "/dashboard/templates/page/configurar_evento.html",
      controller: 'configurar_evento',
      controllerAs: 'eventoCtrl'
    })
    .when('/cadastrar-convidados', {
      templateUrl: "/dashboard/templates/page/cadastrar_convidados.html",
      controller: 'cadastrar_convidados',
      controllerAs: 'convidadosCtrl'
    })
    .when('/save-the-date', {
      templateUrl: "/dashboard/templates/page/save_the_date.html",
      controller: "save_date",
      controllerAs: 'dateCtrl'
    })
    .when('/save-the-date/2', {
      templateUrl: "/dashboard/templates/page/save_the_date2.html",
      controller: "save_date2",
      controllerAs: 'date2Ctrl'
    })
    .when('/enviar-convite', {
      templateUrl: "/dashboard/templates/page/enviar_convite.html",
      controller: 'enviar_convite',
      controllerAs: 'conviteCtrl'
    })
    .when('/enviar-convite/2', {
      templateUrl: "/dashboard/templates/page/enviar_convite2.html",
      controller: 'enviar_convite2'
    })
    .when('/estatisticas', {
      templateUrl: "/dashboard/templates/page/estatistica.html",
      controller: 'estatistica'
    })
    .when('/login', {
      templateUrl: "/dashboard/templates/page/login.html",
      controller: 'login',
      controllerAs: 'loginCtrl',
      isLogin: true
    })
    .otherwise({ redirectTo: '/login' });
});
