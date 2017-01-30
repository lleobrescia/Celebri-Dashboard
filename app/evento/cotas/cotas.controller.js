(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CotasController', CotasController);

  CotasController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', '$rootScope', 'toastr', 'consultCEP', '$http'];
  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name CotasController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc gerencia as cotas de lua de mel. <br>
   * Pasta de origem : app/evento/cotas <br>
   * State : cotas <br>
   * Controller As : cotas <br>
   * Template Url : app/evento/cotas/cotas.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - CriacaoContaVendedorMoip {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/CriacaoContaVendedorMoip}
   *  - RetornarContaVendedorMoip {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarContaVendedorMoip}
   *  - RetornarTodosProdutosLuaDeMel {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarTodosProdutosLuaDeMel}
   *  - ConfigurarPresentesEscolhidos {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ConfigurarPresentesEscolhidos}
   * @param {service} serverService       - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService    - usado para converter xml <-> json (conversor.service.js)
   * @param {service} ListManagerService  - gerencia listas. Passa um object de uma lista para outra (list.service.js)
   * @param {service} session             - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $rootScope          - scope geral
   * @param {service} toastr              - notificação para o usuario
   * @param {service} consultCEP          - serviço para consultar cep
   * @param {service} $http               - usado para pegar o arquivo estado.json
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function CotasController(serverService, conversorService, ListManagerService, session, $rootScope, toastr, consultCEP, $http) {
    const enable = $rootScope.pagante;
    const ID = session.user.id;

    var vm = this;

    vm.carregando = true;
    vm.cep = '';
    vm.contaCriada = false; //escode o formulario de cadastro se ja foi feita uma conta MOIP
    vm.dados = {
      'ContaMoip': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Cep': '',
        'Cidade': '',
        'CodigoAreaTelefone': '',
        'Cpf': '',
        'DataNascimento': '',
        'Email': '',
        'Endereco': '',
        'Estado': '',
        'Id': '0',
        'Id_usuario_logado': ID,
        'Nome': '',
        'Numero': '',
        'NumeroTelefone': '',
        'Sigla_Estado': '',
        'UltimoNome': ''
      }
    };
    vm.data = '';
    vm.estados = []; //estados disponiveis para o formulario
    vm.erro = false;
    vm.link = '';
    vm.ListManager = ListManagerService; // atribuicao do serviço no escopo
    vm.produtos = []; //lista de produtos
    vm.produtosAux = []; //Ajuda a gerenciar a escolha de produtos
    vm.produtosEscolhidos = []; // lista de produtos escolhidos
    vm.telefone = '';

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Cep = Cep;
    vm.CriarConta = CriarConta;
    vm.Salvar = SavarProdutos;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof CotasController
     */
    function Activate() {
      CheckConta();
      $http.get('app/evento/cotas/estado.json')
        .then(function (resp) {
          vm.estados = resp.data;
        });
    }

    /**
     * @function CriarConta
     * @desc Cria a conta MOIP para o casal
     * @memberof CotasController
     */
    function CriarConta() {
      vm.carregando = true;

      if (enable) {
        var tel = vm.telefone.split(')');
        var cep = vm.cep.replace(/\./g, '');
        var codigoArea = tel[0];
        var split = vm.data.split('/');
        var nascimento = split[2] + '-' + split[1] + '-' + split[0];
        var idEstado = RetornarIndexEstado(vm.dados.ContaMoip.Sigla_Estado);

        tel = tel[1];
        tel = tel.replace(/\)/g, '');
        tel = tel.replace(/\ /g, '');
        tel = tel.replace(/\-/g, '');

        cep = cep.replace(/\-/g, '');

        codigoArea = codigoArea.replace(/\(/g, '');

        vm.dados.ContaMoip.NumeroTelefone = tel;
        vm.dados.ContaMoip.CodigoAreaTelefone = codigoArea;
        vm.dados.ContaMoip.DataNascimento = nascimento;
        vm.dados.ContaMoip.Estado = vm.estados[idEstado].Nome;
        vm.dados.ContaMoip.Cep = cep;

        var dados = conversorService.Json2Xml(vm.dados, '');

        serverService.Request('CriacaoContaVendedorMoip', dados).then(function (resp) {
          resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

          if (!resp.ResultadoCriacaoContaVendedorMoip.Result) {
            toastr.error('Não foi possível criar a conta.', 'Erro');
          } else {
            vm.link = resp.ResultadoCriacaoContaVendedorMoip.LinkSetPassword;
            toastr.success('Conta Criada');
            GetProdutos();
            vm.contaCriada = true;
          }
          vm.carregando = false;
        });
      } else {
        toastr.error('Você deve efetuar o pagamento para usar essa funcionalidade');
        vm.carregando = false;
      }
    }

    /**
     * @function Cep
     * @desc Verifica o cep e preenche no formulario
     * @memberof CotasController
     */
    function Cep() {
      consultCEP.consultar(vm.cep).then(function (resp) {
        vm.dados.ContaMoip.Sigla_Estado = resp.estado;
        vm.dados.ContaMoip.Cidade = resp.cidade;
        vm.dados.ContaMoip.Endereco = resp.logradouro;
        vm.bairro = resp.bairro;
      });
    }

    /**
     * @function CheckConta
     * @desc Verifica se a conta moip ja foi criada
     * @memberof CotasController
     */
    function CheckConta() {
      serverService.Get('RetornarContaVendedorMoip', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ContaVendedorMoip.Result === 'true') {
          GetProdutos();
          GetProdutosEscolhidos();
          vm.contaCriada = true;
        }

        vm.carregando = false;
      });
    }

    /**
     * @function GetProdutos
     * @desc Pega os produtos disponiveis para o usuario escolher
     * @memberof CotasController
     */
    function GetProdutos() {
      serverService.Get('RetornarTodosProdutosLuaDeMel', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        vm.produtos = resp.ArrayOfPresentesLuaDeMel.PresentesLuaDeMel;
      });
    }

    /**
     * @function GetProdutosEscolhidos
     * @desc Pega os produtos ja escolhidos pelo usuario
     * @memberof CotasController
     */
    function GetProdutosEscolhidos() {
      serverService.Get('RetornarPresentesLuaDeMel', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfPresentesLuaDeMel.PresentesLuaDeMel.length > 1) {
          vm.produtosAux = resp.ArrayOfPresentesLuaDeMel.PresentesLuaDeMel;
        } else {
          vm.produtosAux.push(resp.ArrayOfPresentesLuaDeMel.PresentesLuaDeMel);
        }

        angular.forEach(vm.produtosAux, function (item) {
          Transfer(item);
        });
      });
    }

    /**
     * @function RetornarIndexEstado
     * @desc Procura o id do estado para a criação da conta moip
     * @param {string} sigla - sigla do estado
     * @return {number} id do estado
     * @memberof CotasController
     */
    function RetornarIndexEstado(sigla) {
      var count = 0;
      var retorno = 0;

      angular.forEach(vm.estados, function (item) {
        if (item.Sigla === sigla) {

          retorno = count;
        }
        count++;
      });

      return retorno;
    }

    /**
     * @function SavarProdutos
     * @desc Salva os produtos escolhidos
     * @memberof CotasController
     */
    function SavarProdutos() {
      var enviarProdutos = {
        'ListaPresentesEscolhidos': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Id_casal': ID,
          'Id_item': {
            'int': []
          }
        }
      };
      angular.forEach(vm.produtosEscolhidos, function (item) {
        enviarProdutos.ListaPresentesEscolhidos.Id_item.int.push({
          '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
          '#text': item.Id
        });
      });

      var dado = conversorService.Json2Xml(enviarProdutos, '');
      serverService.Request('ConfigurarPresentesEscolhidos', dado).then(function (resp) {});
    }

    /**
     * @function Transfer
     * @desc Verifica quais ja sao os produtos escolhidos para coloca-los na lista de produtos escolhidos
     * @param {object} produto
     * @memberof CotasController
     */
    function Transfer(produto) {
      angular.forEach(vm.produtos, function (item) {
        if (produto.Id === item.Id) {
          vm.produtosEscolhidos.push(item);
        }
      });
    }
  }
})();