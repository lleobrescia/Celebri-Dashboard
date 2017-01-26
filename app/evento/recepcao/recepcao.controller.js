/**
 * Recepção Controller
 * Usa os seguinte endpoints:
 *  - RetornarConfiguracaoEvento
 *  - ConfiguracaoEvento 
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('RecepcaoController', RecepcaoController);

  RecepcaoController.$inject = ['serverService', 'conversorService', 'session', 'toastr', '$rootScope'];
  /**
   * @todo consultar o cep
   * @todo adicionar s/n
   * @todo trocar switch por checkbox
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name RecepcaoController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc gerencia os dados da recepção. <br>
   * Pasta de origem : app/evento/recepcao <br>
   * State : recepcao <br>
   * Controller As : recepcao <br>
   * Template Url : app/evento/recepcao/recepcao.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - RetornarConfiguracaoEvento {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConfiguracaoEvento}
   *  - ConfiguracaoEvento {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ConfiguracaoEvento}
   * @param {service} serverService       - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService    - usado para converter xml <-> json (conversor.service.js)
   * @param {service} session             - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} toastr              - notificação para o usuario
   * @param {service} $rootScope          - scope geral
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function RecepcaoController(serverService, conversorService, session, toastr, $rootScope) {
    const enable = $rootScope.pagante; //somente pagantes podem alterar as informações
    const ID = session.user.id; //id do usuario logado

    var dadosAux = {
      'ConfiguracaoEvento': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'Bairro': null,
        'Cep': null,
        'Cidade': null,
        'Endereco': null,
        'Estado': null,
        'Horario_festa': null,
        'Id_usuario_logado': ID,
        'Local_festa': null,
        'Mesmo_local_cerimonia': 'false',
        'Numero': null,
        'Obs': null,
        'Pais': null,
        'Tracar_rota_local': 'false'
      }
    };
    var vm = this;

    vm.carregando = true;
    vm.dados = [];
    vm.erro = false;
    /**
     * O casamento pode nao ter recepcao.
     * Essa variavel controla se vai ou nao aparecer o formulario para preencher os dados da recepção
     */
    vm.hasRecepcao = false;

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Cancelar = GetDados;
    vm.SetDados = SetDados;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof RecepcaoController
     */
    function Activate() {
      vm.dados = dadosAux.ConfiguracaoEvento;
      GetDados();
    }

    /**
     * @function GetDados
     * @desc Recupera os dados do servidor
     * @memberof RecepcaoController
     */
    function GetDados() {
      vm.carregando = true;
      serverService.Get('RetornarConfiguracaoEvento', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        /**
         * Se for o primeiro acesso, o servidor vai retornar um objeto
         */
        if (typeof (resp.ConfiguracaoEvento.Bairro) !== 'object') {
          vm.dados = dadosAux.ConfiguracaoEvento = resp.ConfiguracaoEvento;

          if (vm.dados.Bairro) {
            vm.hasRecepcao = true;
          }
        }

        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarConfiguracaoEvento -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function SetDados
     * @desc Salva os dados no servidor
     * @memberof RecepcaoController
     */
    function SetDados() {
      vm.carregando = true;
      if (enable) {
        var dados = conversorService.Json2Xml(dadosAux, '');
        serverService.Request('ConfiguracaoEvento', dados).then(function (resp) {
          vm.carregando = false;
          toastr.success('Alterações Salvas!');
        }).catch(function (error) {
          console.error('ConfiguracaoEvento -> ', error);
          vm.carregando = false;
          vm.erro = true;
          toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
        });
      } else {
        toastr.error('Você deve efetuar o pagamento para usar essa funcionalidade');
        vm.carregando = false;
      }
    }
  }
})();