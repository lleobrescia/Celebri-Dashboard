(function () {
  'use strict';

  angular
    .module('dashboard')
    .config(RouteConfig);

  RouteConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

  /**
   * @memberof dashboard
   * @ngdoc config
   * @scope {}
   * @name RouteConfig
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Controla as rotas do dashboard.<br>
   * Pasta de origem : app/ <br>
   * @param {service} $stateProvider
   * @param {service} $locationProvider
   * @param {service} $urlRouterProvider
   * @see Veja [Angular DOC]    {@link https://ui-router.github.io/ng1/} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#routing} Para melhores praticas
   */
  function RouteConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('login', {
        url: '/login',
        cache: true,
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
        controller: 'PagamentoController',
        controllerAs: 'pgto',
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
      .state('cerimonia', {
        url: '/convite/cerimonia',
        cache: false,
        templateUrl: 'app/convite/cerimonia/cerimonia.html',
        controller: 'CerimoniaController',
        controllerAs: 'cerimonia',
        title: '- Cerimônia'
      })
      .state('convite', {
        url: '/convite/escolher-convite',
        cache: false,
        templateUrl: 'app/convite/selecao/convite.html',
        controller: 'ConviteController',
        controllerAs: 'convite',
        title: '- Escolha de Convite'
      })
      .state('personalizar', {
        url: '/convite/personalizar-convite',
        cache: false,
        params: {
          idModelo: null
        },
        templateUrl: 'app/convite/personalizar/personalizar.html',
        controller: 'PersonalizarController',
        controllerAs: 'convite',
        title: '- Personalizar de Convite'
      })
      .state('savethedate', {
        url: '/save-the-date',
        cache: false,
        templateUrl: 'app/convite/date/save-date.html',
        controller: 'SaveDateController',
        controllerAs: 'save',
        title: '- Save the Date'
      })
      .state('aplicativo', {
        url: '/convite/aplicativo',
        cache: false,
        templateUrl: 'app/convite/aplicativo/aplicativo.html',
        controller: 'AplicativoController',
        controllerAs: 'app',
        title: '- Aplicativo'
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
        controller: 'EstatisticaController',
        controllerAs: 'ctrl',
        title: '- Estatísticas'
      });
  }
})();