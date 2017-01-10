(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CotasController', CotasController);

  CotasController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', '$rootScope', 'toastr', 'consultCEP', '$http'];

  function CotasController(serverService, conversorService, ListManagerService, session, $rootScope, toastr, consultCEP, $http) {
    const enable = $rootScope.pagante;
    const ID = session.user.id;

    var vm = this;

    vm.carregando = true;
    vm.cep = '';
    vm.contaCriada = false;
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
    vm.estados = [];
    vm.erro = false;
    vm.link = '';
    vm.ListManager = ListManagerService;
    vm.produtos = [];
    vm.produtosAux = [];
    vm.produtosEscolhidos = [];
    vm.telefone = '';

    vm.Cep = Cep;
    vm.CriarConta = CriarConta;
    vm.Salvar = SavarProdutos;

    Activate();

    ////////////////

    function Activate() {
      CheckConta();
      $http.get('app/evento/cotas/estado.json')
        .then(function (resp) {
          vm.estados = resp.data;
        });
    }

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
            vm.contaCriada = true;
          }
          vm.carregando = false;
        });
      } else {
        toastr.error('Você deve efetuar o pagamento para usar essa funcionalidade');
        vm.carregando = false;
      }
    }

    function Cep() {
      consultCEP.consultar(vm.cep).then(function (resp) {
        vm.dados.ContaMoip.Sigla_Estado = resp.estado;
        vm.dados.ContaMoip.Cidade = resp.cidade;
        vm.dados.ContaMoip.Endereco = resp.logradouro;
        vm.bairro = resp.bairro;
      });
    }

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

    function GetProdutos() {
      serverService.Get('RetornarTodosProdutosLuaDeMel', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        vm.produtos = resp.ArrayOfPresentesLuaDeMel.PresentesLuaDeMel;
      });
    }

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
      serverService.Request('ConfigurarPresentesEscolhidos', dado).then(function (resp) {
      });
    }

    function Transfer(produto) {
      angular.forEach(vm.produtos, function (item) {
        if (produto.Id === item.Id) {
          vm.produtosEscolhidos.push(item);
        }
      });
    }
  }
})();