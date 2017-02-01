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
      .state('setup', {
        url: '/setup',
        abstract: true,
        templateUrl: 'app/setup/setup.html'
      })
      .state('setup.noivos', {
        url: '/noivos',
        templateUrl: 'app/setup/noivos.html'
      })
      .state('setup.foto', {
        url: '/foto',
        templateUrl: 'app/setup/foto.html'
      })
      .state('setup.convite', {
        url: '/convite',
        templateUrl: 'app/setup/convite.html'
      })
      .state('setup.informacoes', {
        url: '/informacoes',
        templateUrl: 'app/setup/informacoes.html'
      })
      .state('setup.edicao', {
        url: '/edicao',
        templateUrl: 'app/setup/edicao.html'
      })
      .state('setup.confirmacao', {
        url: '/confirmacao',
        templateUrl: 'app/setup/confirmacao.html'
      })
      .state('login', {
        url: '/login',
        cache: true,
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login',
        title: '- Acessar o Dashboard',
        isLogin: true
      })
      .state('config', {
        url: '/configuracao',
        abstract: true,
        templateUrl: 'app/main.html'
      })
      .state('pagamento', {
        parent: 'config',
        url: '/pagamento',
        cache: false,
        templateUrl: 'app/pagamento/pagamento.html',
        controller: 'PagamentoController',
        controllerAs: 'pgto',
        title: '- Pagamento'
      })
      .state('casal', {
        parent: 'config',
        url: '/casal',
        cache: false,
        templateUrl: 'app/casal/casal.html',
        controller: 'CasalController',
        controllerAs: 'casal',
        title: '- Dados do Casal'
      })
      .state('cerimonia', {
        parent: 'config',
        url: '/convite/cerimonia',
        cache: false,
        templateUrl: 'app/convite/cerimonia/cerimonia.html',
        controller: 'CerimoniaController',
        controllerAs: 'cerimonia',
        title: '- Cerimônia'
      })
      .state('convite', {
        parent: 'config',
        url: '/convite/escolher-convite',
        cache: false,
        templateUrl: 'app/convite/selecao/convite.html',
        controller: 'ConviteController',
        controllerAs: 'convite',
        title: '- Escolha de Convite'
      })
      .state('personalizar', {
        parent: 'config',
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
        parent: 'config',
        url: '/save-the-date',
        cache: false,
        templateUrl: 'app/convite/date/save-date.html',
        controller: 'SaveDateController',
        controllerAs: 'save',
        title: '- Save the Date'
      })
      .state('aplicativo', {
        parent: 'config',
        url: '/convite/aplicativo',
        cache: false,
        templateUrl: 'app/convite/aplicativo/aplicativo.html',
        controller: 'AplicativoController',
        controllerAs: 'app',
        title: '- Aplicativo'
      })
      .state('enviarConvite', {
        parent: 'config',
        url: '/convite/enviar',
        cache: false,
        templateUrl: 'app/convite/enviar.html',
        controller: 'EnviarConviteController',
        controllerAs: 'enviar',
        title: '- Enviar Convite'
      })
      .state('recepcao', {
        parent: 'config',
        url: '/evento/recepcao',
        cache: false,
        templateUrl: 'app/evento/recepcao/recepcao.html',
        controller: 'RecepcaoController',
        controllerAs: 'recepcao',
        title: '- Recepção'
      })
      .state('hotel', {
        parent: 'config',
        url: '/evento/dicas-de-hotel',
        cache: false,
        templateUrl: 'app/evento/hotel/hotel.html',
        controller: 'HotelController',
        controllerAs: 'hotel',
        title: '- Dicas de Hotel'
      })
      .state('salao', {
        parent: 'config',
        url: '/evento/dicas-de-salao-de-beleza',
        cache: false,
        templateUrl: 'app/evento/salao/salao.html',
        controller: 'SalaoController',
        controllerAs: 'salao',
        title: '- Dicas de Salão de Beleza'
      })
      .state('presentes', {
        parent: 'config',
        url: '/evento/lista-de-presentes',
        cache: false,
        templateUrl: 'app/evento/presentes/presentes.html',
        controller: 'PresentesController',
        controllerAs: 'presentes',
        title: '- Lista de Presentes'
      })
      .state('cardapio', {
        parent: 'config',
        url: '/evento/cardapio',
        cache: false,
        templateUrl: 'app/evento/cardapio/cardapio.html',
        controller: 'CardapioController',
        controllerAs: 'cardapio',
        title: '- Cardápio'
      })
      .state('cotas', {
        parent: 'config',
        url: '/evento/cotas-de-lua-de-mel',
        cache: false,
        templateUrl: 'app/evento/cotas/cotas.html',
        controller: 'CotasController',
        controllerAs: 'cotas',
        title: '- Cotas de Lua de Mel'
      })
      .state('cadastrarConvidados', {
        parent: 'config',
        url: '/convidado/cadastrar',
        cache: false,
        templateUrl: 'app/convidado/cadastrar.html',
        controller: 'CadastrarConvidadoController',
        controllerAs: 'convidados',
        title: '- Cadastrar Convidados'
      })
      .state('convidadosConfirmados', {
        parent: 'config',
        url: '/convidado/confirmados',
        cache: false,
        templateUrl: 'app/convidado/confirmados.html',
        controller: 'ConvidadosConfirmadosController',
        controllerAs: 'convidados',
        title: '- Convidados Confirmados'
      })
      .state('estatisticas', {
        parent: 'config',
        url: '/estatisticas',
        cache: false,
        templateUrl: 'app/estatisticas/estatisticas.html',
        controller: 'EstatisticaController',
        controllerAs: 'ctrl',
        title: '- Estatísticas'
      });
  }
})();