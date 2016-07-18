// Modules
angular
  .module("dashboard", [
    'ngRoute',//Controlar URL
    'ngFileUpload',//Usado para upload da foto do casal
    'ngMask',//Mascara dos inputs
    'rzModule',//Usado no slider para alterar o tamanho da fonte
    'ngAnimate',//Usado nas trancições de telas
    'chart.js',//Usado nas estastisticas
    'ngImageEditor',//Usado para recortar a foto do casal
    'ngMaterial'//Usado na data do casamento
  ]);

(function () {
  'use strict';

  angular
    .module("dashboard")
    .run(Run);

  Run.$inject = ['$rootScope', '$location', 'UserService'];

  function Run($rootScope, $location, UserService) {
    //Load os dados do usuario
    UserService.RestoreState();

    $rootScope.$on('$routeChangeStart', ChangeStart);
    $rootScope.$on('$routeChangeSuccess', ChangeSuccess);

    //let everthing know that we need to save state now.
    window.onbeforeunload = function (event) {
      $rootScope.$broadcast('savestate');
    };

    function ChangeStart(event, next, current) {
      //hide sidebar on personalizar-convite
      $rootScope.hideSideBar = true;

      if ($location.path() == "/personalizar-convite") {
        $rootScope.hideSideBar = false;
      }
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
    }

    function ChangeSuccess() {
      if ($rootScope.fotoCasal === undefined) {
        $rootScope.fotoCasal = UserService.dados.fotoUrl;
      }
      //hide loading gif
      $rootScope.loading = false;
    }
  }
})();

(function () {
  'use strict';

  angular
    .module("dashboard")
    .config(Config);

  //Configura aliguagem do calendario
  function Config($mdDateLocaleProvider) {
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
  }
})();
