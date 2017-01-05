(function() {
  'use strict';

  angular.module('dashboard')
    .run(Run)
    .config(Config);

  Run.$inject = ['$rootScope', '$state', 'session'];

  function Run($rootScope, $state, session) {
    $rootScope.$on('$stateChangeSuccess', ChangeSuccess);
    $rootScope.$on('$stateChangeStart', ChangeStart);

    function ChangeStart(event, toState, toParams, fromState, fromParams) {
      var userAuthenticated = false;
      session.RestoreState();

      $rootScope.pagante = session.user.pagante;
      $rootScope.dias = session.user.diasCadastros;
      $rootScope.liberado = session.user.usuarioLiberado;
      $rootScope.foto = session.user.casal.urlFoto;

      if (session.user.id) {
        userAuthenticated = true;
      }

      if (!userAuthenticated && !toState.isLogin) {
        event.preventDefault();
        $state.go('login');
      }

      if (toState.name === 'login') {

        $rootScope.isLogin = true;

        if (userAuthenticated) {
          event.preventDefault();
          $state.go('casal');
        }
      } else {
        $rootScope.isLogin = false;
      }
    }

    function ChangeSuccess() {
      $rootScope.personalizar = false; //usado para escoder a navegacao lateral
      $rootScope.$broadcast('restorestate');
      //Change page title, based on Route information
      $rootScope.title = $state.current.title;

      /**
       * Verifica se esta na pagina de personalizar o convite
       * e escode a navegacao lateral
       * a variavel eh usada no arquivo sidebar.html
       */
      if ($state.current.name === 'personalizar') {
        $rootScope.personalizar = true;
      }
    }
  }

  Config.$inject = ['$mdDateLocaleProvider'];

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
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD/MM/YYYY');
    };
    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendario';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
  }
})();