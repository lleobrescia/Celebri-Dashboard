(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CardapioController', CardapioController);

  CardapioController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr', '$rootScope'];
  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name CardapioController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc gerencia o cardapio do casamento. <br>
   * Pasta de origem : app/evento/cardapio <br>
   * State : cardapio <br>
   * Controller As : cardapio <br>
   * Template Url : app/evento/cardapio/cardapio.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - CadastrarCardapio {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/CadastrarCardapio}
   *  - ExcluirCardapio {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ExcluirCardapio}
   *  - RetornarCardapio {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarCardapio}
   * @param {service} serverService       - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService    - usado para converter xml <-> json (conversor.service.js)
   * @param {service} ListManagerService  - gerencia listas. Passa um object de uma lista para outra (list.service.js)
   * @param {service} session             - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} toastr              - notificação para o usuario
   * @param {service} $rootScope          - scope geral
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function CardapioController(serverService, conversorService, ListManagerService, session, toastr, $rootScope) {
    const enable = $rootScope.pagante; //somente casal pagante pode adicionar o cardapio
    const ID = session.user.id; //id do casal

    var vm = this;

    vm.dados = {
      'Cardapio': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Descricao': '',
        'Id': 0,
        'Id_usuario_logado': ID,
        'Nome': ''
      }
    };
    vm.cardapios = []; //lista do cardapio
    vm.carregando = true;
    vm.erro = false;

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Adicionar = Adicionar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof CardapioController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function Adicionar
     * @desc Cadastra um novo cardapio
     * @memberof CardapioController
     */
    function Adicionar() {
      vm.carregando = true;
      if (enable) {
        var dados = conversorService.Json2Xml(vm.dados, '');
        serverService.Request('CadastrarCardapio', dados).then(function (resp) {
          vm.carregando = false;

          vm.dados.Cardapio.Descricao = '';
          vm.dados.Cardapio.Nome = '';

          toastr.success('Cardápio Adicionado');

          GetDados();
        }).catch(function (error) {
          console.error('CadastrarCardapio -> ', error);
          vm.carregando = false;
          vm.erro = true;
          toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
        });
      } else {
        toastr.error('Você deve efetuar o pagamento para usar essa funcionalidade');
        vm.carregando = false;
      }
    }

    /**
     * @function Excluir
     * @desc Apaga o cardapio
     * @param {string} id - id do cardapio
     * @memberof CardapioController
     */
    function Excluir(id) {
      vm.carregando = true;
      var item = {
        'ListaRegistrosExcluir': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Id_casal': ID,
          'Id_registro': {
            'int': [{
              '#text': id,
              '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays'
            }]
          }
        }
      };

      var dado = conversorService.Json2Xml(item, '');
      serverService.Request('ExcluirCardapio', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Cardápio Excluido');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirCardapio -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function GetDados
     * @desc Recupera a lista do cardapio do servidor
     * @memberof CardapioController
     */
    function GetDados() {
      vm.carregando = true;
      vm.cardapios = [];
      serverService.Get('RetornarCardapio', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfCardapio.Cardapio) {
          if (resp.ArrayOfCardapio.Cardapio.length > 1) {
            vm.cardapios = resp.ArrayOfCardapio.Cardapio;
          } else {
            vm.cardapios.push(resp.ArrayOfCardapio.Cardapio);
          }
        }

        vm.carregando = false;

      }).catch(function (error) {
        console.error('RetornarCardapio -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();