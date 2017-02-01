(function () {
  'use strict';

  angular.module('dashboard')
    .run(Run)
    .config(Config);

  Run.$inject = ['$rootScope', '$state', 'session'];

  /**
   * @memberof dashboard
   * @ngdoc config
   * @scope {}
   * @name Run
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Exetuca açoes assim que o module eh iniciado.<br>
   * Pasta de origem : app/_core <br>
   * @param {service} $rootScope  - scope geral
   * @param {service} $state      - usado para trocar o titulo do site
   * @param {service} session     - usado para armazenar e buscar dados no session (session.service.js)
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/module#run-blocks} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#style-y171} Para melhores praticas
   */
  function Run($rootScope, $state, session) {
    $rootScope.$on('$stateChangeSuccess', ChangeSuccess);
    $rootScope.$on('$stateChangeStart', ChangeStart);

    /**
     * @function ChangeStart
     * @desc Executa quando o state comeca a mudar
     * @param {event} event
     * @param {object} toState
     * @param {object} toParams
     * @param {object} fromState
     * @param {object} fromParams
     * @memberof Run
     */
    function ChangeStart(event, toState, toParams, fromState, fromParams) {
      var userAuthenticated = false; //Por padrao o usuario nao esta autenticado
      session.RestoreState(); //Carrega os dados do usuario salvos no session

      $rootScope.pagante = session.user.pagante; //Controla as funções que o usuario pode fazer
      $rootScope.dias = session.user.diasCadastros; //Dias decorridos desde o cadstro
      $rootScope.liberado = session.user.usuarioLiberado;
      $rootScope.foto = session.user.casal.urlFoto; //A foto do casal eh global pois esta em dois controladores
      $rootScope.nomeUser = session.user.casal.nomeUser;

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
     * @function ChangeSuccess
     * @desc Executa depois que o state mudou
     * @memberof Run
     */
    function ChangeSuccess() {
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

  Config.$inject = ['$mdDateLocaleProvider'];
  /**
   * @memberof dashboard
   * @ngdoc config
   * @scope {}
   * @name Config
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Executa configurações quando o mudule eh iniciado.<br>
   * Pasta de origem : app/_core <br>
   * @param {service} $mdDateLocaleProvider  - servico de data e tempo do datapicker
   * @param {service} $state      - usado para trocar o titulo do site
   * @param {service} session     - usado para armazenar e buscar dados no session (session.service.js)
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/module#configuration-blocks} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#style-y170} Para melhores praticas
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