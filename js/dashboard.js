// INIT
angular.module("dashboard", ['ngRoute', 'ngFileUpload', 'ngMask', 'rzModule', 'ngAnimate', 'ui.bootstrap', 'chart.js', 'ngImageEditor', 'ngMaterial']);

angular.module("dashboard").run(['$rootScope', '$location', 'UserService', function ($rootScope, $location, UserService) {

  UserService.RestoreState();

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    //show loading gif
    $rootScope.loading = true;

    if (sessionStorage.restorestate == "true") {
      $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
      sessionStorage.restorestate = false;
    }

    var id = UserService.dados.ID;
    var userAuthenticated = false;

    if (id != null) {
      userAuthenticated = true;
    }

    if (!userAuthenticated && !next.isLogin) {
      $location.path('/login');
    }
  });
  $rootScope.$on('$routeChangeSuccess', function () {

    //hide loading gif
    $rootScope.loading = false;

  });
  //let everthing know that we need to save state now.
  window.onbeforeunload = function (event) {
    $rootScope.$broadcast('savestate');
  };
}]);

angular.module("dashboard").config(function ($mdDateLocaleProvider) {
  $mdDateLocaleProvider.months = [
    'Janeiro', 'Fevereiro', 'Março',
    'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro',
    'Outubro', 'Novembro', 'Dezembro'
  ];

  $mdDateLocaleProvider.shortMonths = [
    'Jan', 'Fev', 'Mar',
    'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set',
    'Out', 'Nov', 'Dez'
  ];
  $mdDateLocaleProvider.days = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta',
    'Sábado', 'Domingo'
  ];
  $mdDateLocaleProvider.shortDays = [
    'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'
  ];
  $mdDateLocaleProvider.formatDate = function (date) {
    return moment(date).format('DD/MM/YYYY');
  };
  $mdDateLocaleProvider.parseDate = function (dateString) {
    var m = moment(dateString, 'DD/MM/YYYY', true);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };
  $mdDateLocaleProvider.msgCalendar = 'Calendario';
  $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
});
