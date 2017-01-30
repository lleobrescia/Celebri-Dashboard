(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SalaoController', SalaoController);

  SalaoController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', '$rootScope', 'toastr', 'consultCEP'];
  /**
   * @todo exclusao em massa
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name SalaoController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc gerencia os saloes de beleza. <br>
   * Pasta de origem : app/evento/salao <br>
   * State : salao <br>
   * Controller As : salao <br>
   * Template Url : app/evento/salao/salao.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - ConfigAdicionalEvento_ListaSaloes {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ConfigAdicionalEvento_ListaSaloes}
   *  - ExcluirSaloes {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ExcluirSaloes}
   *  - RetornarConfiguracaoListaSaloes {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConfiguracaoListaSaloes}
   * @param {service} serverService       - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService    - usado para converter xml <-> json (conversor.service.js)
   * @param {service} ListManagerService  - gerencia listas. Passa um object de uma lista para outra (list.service.js)
   * @param {service} session             - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $rootScope          - scope geral
   * @param {service} toastr              - notificação para o usuario
   * @param {service} consultCEP          - serviço para consultar cep
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function SalaoController(serverService, conversorService, ListManagerService, session, $rootScope, toastr, consultCEP) {
    const enable = $rootScope.pagante; //somente usuarios pagantes podem adicionar um salao
    const ID = session.user.id; //id do usuario

    var vm = this;

    vm.carregando = true;
    vm.cep = '';
    vm.dados = {
      'ConfiguracaoGenericaEndereco': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Bairro': '',
        'Cidade': '',
        'CodigoArea': ' ',
        'Email': '',
        'Endereco': '',
        'Estado': '',
        'Id': '0',
        'Id_usuario_logado': ID,
        'Nome': '',
        'Numero': '',
        'Obs': ' ',
        'Pais': ' ',
        'Site': '',
        'Telefone': '',
        'TipoLogradouro': '',
        'Tracar_rota_local': 'true'
      }
    };
    vm.saloes = []; //lista dos saloes cadastrados

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Adicionar = Adicionar;
    vm.ConsultCEP = ConsultCEP;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof SalaoController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function Adicionar
     * @desc Adiciona um salao
     * @memberof SalaoController
     */
    function Adicionar() {
      vm.carregando = true;
      if (enable) {
        var dados = conversorService.Json2Xml(vm.dados, '');
        serverService.Request('ConfigAdicionalEvento_ListaSaloes', dados).then(function (resp) {
          GetDados();
          vm.carregando = false;
        }).catch(function (error) {
          console.error('ConfigAdicionalEvento_ListaSaloes -> ', error);
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
     * @function ConsultCEP
     * @desc Usa o serviço consultCEP para consultar o cep e preenche o formulario com a resposta
     * @memberof SalaoController
     */
    function ConsultCEP() {
      consultCEP.consultar(vm.cep).then(function (resp) {
        vm.dados.ConfiguracaoGenericaEndereco.Endereco = resp.logradouro;
        vm.dados.ConfiguracaoGenericaEndereco.Bairro = resp.bairro;
        vm.dados.ConfiguracaoGenericaEndereco.Cidade = resp.cidade;
        vm.dados.ConfiguracaoGenericaEndereco.Estado = resp.estado;
      });
    }

    /**
     * @function Excluir
     * @desc Apaga um salao
     * @param {string} id - id do salao
     * @memberof SalaoController
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
      serverService.Request('ExcluirSaloes', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Salão de beleza Excluido');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirSaloes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function GetDados
     * @desc Recupera os saloes cadastrados do servidor
     * @memberof SalaoController
     */
    function GetDados() {
      vm.dados = {
        'ConfiguracaoGenericaEndereco': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Bairro': '',
          'Cidade': '',
          'CodigoArea': ' ',
          'Email': '',
          'Endereco': '',
          'Estado': '',
          'Id': '0',
          'Id_usuario_logado': ID,
          'Nome': '',
          'Numero': '',
          'Obs': ' ',
          'Pais': ' ',
          'Site': '',
          'Telefone': '',
          'TipoLogradouro': ' ',
          'Tracar_rota_local': 'true'
        }
      };
      vm.carregando = true;
      vm.saloes = [];
      serverService.Get('RetornarConfiguracaoListaSaloes', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco) {
          if (resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco > 1) {
            vm.saloes = resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco;
          } else {
            vm.saloes.push(resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco);
          }
        }

        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarConfiguracaoListaSaloes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();