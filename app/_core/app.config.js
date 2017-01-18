/**
 * dashboard Module
 * @author Leo Brescia <leonardo@leobrescia.com.br>
 * @namespace Module
 */
(function () {
  'use strict';

  angular.module('dashboard')
    .run(Run)
    .config(Config);

  /**
   * $rootScope - usado para quardar as variaveis globais
   * $state - usado para trocar o titulo do site
   * e verificar em qual pagina esta para alterar a barra lateral
   * session - armazena os dados no session.Para detalhes do servico, verifique o arquivo session.service.js 
   */
  Run.$inject = ['$rootScope', '$state', 'session'];

  /**
   * @namespace Run
   * @desc Exetuca açoes assim que o module eh iniciado
   * @see Veja {@link https://docs.angularjs.org/guide/module#run-blocks|Angular DOC} Para mais informações
   * @see Veja {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#run-blocks|John Papa DOC} Para melhores praticas
   */
  function Run($rootScope, $state, session) {
    $rootScope.$on('$stateChangeSuccess', ChangeSuccess);
    $rootScope.$on('$stateChangeStart', ChangeStart);

    /**
     * @name ChangeStart
     * @desc Executa quando o state comeca a mudar
     * @memberof Module.Run
     */
    function ChangeStart(event, toState, toParams, fromState, fromParams) {
      var userAuthenticated = false; //Por padrao o usuario nao esta autenticado
      session.RestoreState(); //Carrega os dados do usuario salvos no session

      /** @global */
      $rootScope.pagante = session.user.pagante; //Controla as funções que o usuario pode fazer
      /** @global */
      $rootScope.dias = session.user.diasCadastros; //Dias decorridos desde o cadstro
      /** @global */
      $rootScope.liberado = session.user.usuarioLiberado;
      /** @global */
      $rootScope.foto = session.user.casal.urlFoto; //A foto do casal eh global pois esta em dois controladores

      /**
       * Se existir id no session significa que o usuario ja efetuou o login
       * O id so vai existir depois do usuario entrar no sistema
       */
      if (session.user.id) {
        userAuthenticated = true;
      }

      //Se nao estiver autenticado vai para a pagina de login
      if (!userAuthenticated && !toState.isLogin) {
        event.preventDefault();
        $state.go('login');
      }

      /**
       * Verifica se esta na pagina de login 
       * e esconde a barra lateral
       * o isLogin controla isso
       */
      if (toState.name === 'login') {
        $rootScope.isLogin = true;
      } else {
        $rootScope.isLogin = false;
      }
    }
    /**
     * @name ChangeSuccess
     * @desc Executa depois que o state mudou
     * @memberof Module.Run
     */
    function ChangeSuccess() {
      /** @global */
      $rootScope.personalizar = false; //usado para escoder a navegacao lateral
      $rootScope.$broadcast('restorestate');

      $rootScope.title = $state.current.title; //Change page title, based on Route information

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

  /**
   * $mdDateLocaleProvider - servico de data e tempo do datapicker
   */
  Config.$inject = ['$mdDateLocaleProvider'];

  /**
   * @namespace Config
   * @desc Executa configurações quando o mudule eh iniciado
   * @see Veja {@link https://docs.angularjs.org/guide/module#configuration-blocks|Angular DOC} Para mais informações
   * @see Veja {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#configuration-1|John Papa DOC} Para melhores praticas
   * @memberof Module
   */
  function Config($mdDateLocaleProvider) {
    /**
     * Configura o datapicker para o pt-br utilizando o momentJs
     * Referencia: http://momentjs.com/
     */
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