(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('HotelController', HotelController);

  HotelController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr', '$rootScope', 'consultCEP'];
  /**
   * @todo exclusao em massa
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name HotelController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc gerencia os hoteis de referencia do casamento. <br>
   * Pasta de origem : app/evento/hotel <br>
   * State : hotel <br>
   * Controller As : hotel <br>
   * Template Url : app/evento/hotel/hotel.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - ConfigAdicionalEvento_ListaHoteis {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ConfigAdicionalEvento_ListaHoteis}
   *  - ExcluirHoteis {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ExcluirHoteis}
   *  - RetornarConfiguracaoListaHoteis {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConfiguracaoListaHoteis}
   * @param {service} serverService       - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService    - usado para converter xml <-> json (conversor.service.js)
   * @param {service} ListManagerService  - gerencia listas. Passa um object de uma lista para outra (list.service.js)
   * @param {service} session             - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} toastr              - notificação para o usuario
   * @param {service} $rootScope          - scope geral
   * @param {service} consultCEP          - serviço para consultar cep
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function HotelController(serverService, conversorService, ListManagerService, session, toastr, $rootScope, consultCEP) {
    const enable = $rootScope.pagante; //somente usuario pagante pode adicionar um hotel
    const ID = session.user.id; //id do usuario logado

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
    vm.erro = false;
    vm.hoteis = []; //lista de hoteis

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
     * @memberof HotelController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function Adicionar
     * @desc Adiciona um novo hotel. Somente se o usuario pagou
     * @memberof HotelController
     */
    function Adicionar() {
      vm.carregando = true;
      if (enable) {
        var dados = conversorService.Json2Xml(vm.dados, '');
        serverService.Request('ConfigAdicionalEvento_ListaHoteis', dados).then(function (resp) {
          vm.carregando = false;
          toastr.success('Hotel Adicionado!');
          GetDados();
        }).catch(function (error) {
          console.error('ConfigAdicionalEvento_ListaHoteis -> ', error);
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
     * @memberof HotelController
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
     * @desc Apaga um hotel
     * @param {string} id - id do hotel
     * @memberof HotelController
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
      serverService.Request('ExcluirHoteis', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Hotel Excluido');
        /**
         * Quando adiciona um novo hotel
         * eh preciso recuperar a lista novamente para pegar o id do novo hotel
         */
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirHoteis -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function GetDados
     * @desc Recupera a lista de hoteis do servidor
     * @memberof HotelController
     */
    function GetDados() {
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
      serverService.Get('RetornarConfiguracaoListaHoteis', ID).then(function (resp) {
        vm.hoteis = [];
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco) {
          if (resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco.length > 1) {
            vm.hoteis = resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco;
          } else {
            vm.hoteis.push(resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco);
          }
        }

        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarConfiguracaoListaHoteis -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();