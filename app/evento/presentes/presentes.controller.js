(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PresentesController', PresentesController);

  PresentesController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr', '$rootScope', 'consultCEP'];
  /**
   * @todo exclusao em massa
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name PresentesController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc gerencia links de listas de presentes do casamento. <br>
   * Pasta de origem : app/evento/presentes <br>
   * State : presentes <br>
   * Controller As : presentes <br>
   * Template Url : app/evento/presentes/presentes.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - ConfigAdicionalEvento_LojaPresentes {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ConfigAdicionalEvento_LojaPresentes}
   *  - ExcluirLojasPresentes {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ExcluirLojasPresentes}
   *  - RetornarConfiguracaoLojaPresentes {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConfiguracaoLojaPresentes}
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
  function PresentesController(serverService, conversorService, ListManagerService, session, toastr, $rootScope, consultCEP) {
    const enable = $rootScope.pagante; //somente usuarios pagantes podem adicionar
    const ID = session.user.id; //id do usuario

    var vm = this;

    vm.dados = {
      'ConfiguracaoLojaPresentes': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Bairro': '',
        'Cep': '',
        'Cidade': '',
        'Endereco': '',
        'Estado': '',
        'Id': 0,
        'Id_usuario_logado': ID,
        'LojaFisica': false,
        'Nome': '',
        'Numero': '',
        'Obs': '',
        'Pais': 'Brasil',
        'TipoLogradouro': '',
        'Url': ''
      }
    };
    vm.carregando = true;
    vm.enableEdition = false; //Auxilia na edição de informação
    vm.erro = false;
    vm.lojaFisica = false; // Usado para diferenciar loja fisica da loja virtual
    vm.presentes = []; //lista de urls

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Adicionar = Adicionar;
    vm.ConsultCEP = ConsultCEP;
    vm.Editar = Editar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup do controlador. Exetuca assim que o controlador inicia
     * @memberof PresentesController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function Adicionar
     * @desc Adiciona uma url de loja
     * @memberof PresentesController
     */
    function Adicionar() {
      vm.carregando = true;
      if (enable) {
        var dados = conversorService.Json2Xml(vm.dados, '');
        serverService.Request('ConfigAdicionalEvento_LojaPresentes', dados).then(function (resp) {

          if (vm.enableEdition) {
            toastr.success('Loja Alterada');
          } else {
            toastr.success('Loja Adicionada');
          }
          GetDados();
          vm.carregando = false;

        }).catch(function (error) {
          console.error('ConfigAdicionalEvento_LojaPresentes -> ', error);
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
     * @memberof PresentesController
     */
    function ConsultCEP() {
      consultCEP.consultar(vm.dados.ConfiguracaoLojaPresentes.Cep).then(function (resp) {
        vm.dados.ConfiguracaoLojaPresentes.Endereco = resp.logradouro;
        vm.dados.ConfiguracaoLojaPresentes.Bairro = resp.bairro;
        vm.dados.ConfiguracaoLojaPresentes.Cidade = resp.cidade;
        vm.dados.ConfiguracaoLojaPresentes.Estado = resp.estado;
      });
    }

    /**
     * @function Editar
     * @desc Edita uma loja
     * @param {object} loja - loja que vai ser editada
     * @memberof PresentesController
     */
    function Editar(loja) {
      vm.dados = {
        'ConfiguracaoLojaPresentes': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Bairro': loja.Bairro,
          'Cep': loja.Cep,
          'Cidade': loja.Cidade,
          'Endereco': loja.Endereco,
          'Estado': loja.Estado,
          'Id': loja.Id,
          'Id_usuario_logado': ID,
          'LojaFisica': (loja.LojaFisica === 'true'),
          'Nome': loja.Nome,
          'Numero': loja.Numero,
          'Obs': '',
          'Pais': 'Brasil',
          'TipoLogradouro': '',
          'Url': loja.Url
        }
      };

      vm.enableEdition = true;
    }

    /**
     * @function Excluir
     * @desc Apaga uma url de loja
     * @param {string} id - id do link
     * @memberof PresentesController
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
      serverService.Request('ExcluirLojasPresentes', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Loja Excluida');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirLojasPresentes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function GetDados
     * @desc Recupera todas as urls cadastradas
     * @memberof PresentesController
     */
    function GetDados() {
      vm.dados = {
        'ConfiguracaoLojaPresentes': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Bairro': '',
          'Cep': '',
          'Cidade': '',
          'Endereco': '',
          'Estado': '',
          'Id': 0,
          'Id_usuario_logado': ID,
          'LojaFisica': false,
          'Nome': '',
          'Numero': '',
          'Obs': '',
          'Pais': 'Brasil',
          'TipoLogradouro': '',
          'Url': ''
        }
      };
      vm.carregando = true;
      vm.enableEdition = false;
      vm.presentes = [];
      serverService.Get('RetornarConfiguracaoLojaPresentes', ID).then(function (resp) {

        vm.carregando = false;
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        console.log(resp);

        if (resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes) {
          if (resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes.length > 1) {
            vm.presentes = resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes;
          } else {
            vm.presentes.push(resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes);
          }
        }

      }).catch(function (error) {
        console.error('RetornarConfiguracaoLojaPresentes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();