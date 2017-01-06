(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PagamentoController', PagamentoController);

  PagamentoController.$inject = ['serverService', 'conversorService', 'Cielo', 'session', '$state', 'consultCEP', 'toastr'];

  function PagamentoController(serverService, conversorService, Cielo, session, $state, consultCEP, toastr) {
    const ID = session.user.id;
    var vm = this;

    vm.cartao = {
      'numero': '',
      'validade': '',
      'indicador': '',
      'codigo': '',
      'bandeira': ''
    };
    vm.carregando = false;
    vm.dados = {
      'nome': '',
      'cep': '',
      'endereco': '',
      'bairro': '',
      'cidade': '',
      'estado': '',
      'numero': ''
    };
    vm.erro = false;
    vm.fiscal = {
      'DadosNotaFiscal': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Cpf': '',
        'Email': '',
        'Endereco': '',
        'Id_Casal': ID,
        'Nome': ''
      }
    };

    vm.ConsultCEP = ConsultCEP;
    vm.Pagar = Pagar;

    Activate();

    ////////////////

    function Activate() {
      $('.cartao').validateCreditCard(function (result) {
        var cardName = null;

        try {
          cardName = result.card_type.name;
        } catch (error) {
          $('.cartao').css('background-position', '99% 4px');
        }

        switch (cardName) {
          case null:
            $('.cartao').css('background-position', '99% 4px');
            break;
          case 'mastercard':
            $('.cartao').css('background-position', '99% -106px');
            break;
          case 'visa':
            $('.cartao').css('background-position', '99% -31px');
            break;
          case 'visa_electron':
            $('.cartao').css('background-position', '99% -69px');
            break;

          default:
            $('.cartao').css('background-position', '99% -143px');
            break;
        }
        vm.cartao.bandeira = cardName;

      });

    }

    function AtualizarStatus(status, aprovacao, cod) {
      var dado = {
        'StatusPagamentoCelebri': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'CodTransacao': cod,
          'IdCasal': ID,
          'PagtoAprovado': aprovacao,
          'Status': status
        }
      };

      var xml = conversorService.Json2Xml(dado, '');
      serverService.Request('AtualizarStatusPagamentoCelebri', xml).then(function (resp) {

      });
    }

    function ConsultCEP() {
      consultCEP.consultar(vm.dados.cep).then(function (resp) {
        vm.dados.endereco = resp.logradouro;
        vm.dados.bairro = resp.bairro;
        vm.dados.cidade = resp.cidade;
        vm.dados.estado = resp.estado;
      });
    }

    function Pagar() {
      vm.carregando = true;
      var vencimento = vm.cartao.validade.split('/');
      vencimento = '20' + vencimento[1] + vencimento[0];

      Cielo.Send(vm.cartao.numero, vencimento, vm.cartao.codigo, vm.cartao.bandeira).then(function (resp) {
        var aprovado = 'false';
        var status = '';
        var codigo = 0;
        var tid = '';

        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        codigo = resp.transacao.status;

        if (codigo === '4' || codigo === '6') {
          aprovado = 'true';
          status = 'Transação autorizada';
          tid = resp.transacao.tid;

          RegistrarNotaFiscal();
          RegistrarPagamento(aprovado);

          //Limpa os campos
          vm.dados.nome = '';
          vm.fiscal.Cpf = '';
          vm.fiscal.Email = '';
          vm.dados.endereco = '';
          vm.dados.cep = '';
          vm.dados.bairro = '';
          vm.dados.numero = '';
          vm.dados.cidade = '';
          vm.dados.estado = '';
          vm.cartao.numero = '';
          vm.cartao.validade = '';
          vm.cartao.codigo = '';
        } else {
          aprovado = 'false';
          status = 'Autorização negada';
        }

        vm.carregando = false;
        AtualizarStatus(status, aprovado, tid);

      }).catch(function (error) {
        console.error('AtualizarDadosCadastroNoivos -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function RegistrarNotaFiscal() {
      var xml = conversorService.Json2Xml(vm.fiscal, '');
      serverService.Request('CadastrarDadosNotaFiscal', xml).then(function (resp) {

      });
    }

    function RegistrarPagamento(aprovacao) {
      var dado = {
        'StatusPagamentoCelebri': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'IdCasal': ID,
          'Origem': 'Dashboard',
          'PagtoAprovado': aprovacao,
          'Valor': '185.00'
        }
      };

      var xml = conversorService.Json2Xml(dado, '');
      serverService.Request('RegistrarPagamentoCelebri', xml).then(function (resp) {

      });
    }
  }
})();