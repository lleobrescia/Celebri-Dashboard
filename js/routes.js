// Navegação
angular.module("dashboard").config(function($routeProvider){
  $routeProvider
  .when('/',{
    redirectTo:"/dados-do-casal"
  })
  .when('/dados-do-casal',{
    templateUrl:"/dashboard/templates/page/dados_casal.html"
  })
  .when('/configurar-convite',{
    templateUrl:"/dashboard/templates/page/configurar_convite.html"
  })
  .when('/configurar-evento',{
    templateUrl:"/dashboard/templates/page/configurar_evento.html"
  })
  .when('/cadastrar-convidados',{
    templateUrl:"/dashboard/templates/page/cadastrar_convidados.html"
  })
  .when('/save-the-date',{
    templateUrl:"/dashboard/templates/page/save_the_date.html"
  })
  .when('/enviar-convite',{
    templateUrl:"/dashboard/templates/page/enviar_convite.html"
  })
  .when('/convidados-confirados',{
    templateUrl:"/dashboard/templates/page/convidados_confirmados.html"
  })
  .otherwise({ redirectTo:'/dados-do-casal'});
});

 // angular.module('NoteWrangler', ['ngRoute'])
 // .config(['$routeProvider', function($routeProvider) {
 //   $routeProvider.when('/notes', {
 //     templateUrl: 'templates/pages/notes/index.html'
 //   });
 // }]);
