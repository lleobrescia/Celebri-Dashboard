(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PagamentoController', PagamentoController);

  PagamentoController.$inject = ['serverService', 'conversorService', 'Cielo', 'session', 'consultCEP', 'toastr', '$rootScope', 'EnviarEmail'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name PagamentoController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc realiza o processo de pagamento do celebri.<br>
   * Pasta de origem : app/pagamento <br>
   * State : pagamento <br>
   * Controller As : pgto<br>
   * Template Url : app/pagamento/pagamento.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - AtualizarStatusPagamentoCelebri {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/AtualizarStatusPagamentoCelebri}
   *  - RegistrarPagamentoCelebri {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RegistrarPagamentoCelebri}
   *  - CadastrarDadosNotaFiscal {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/CadastrarDadosNotaFiscal}
   * @param {service} serverService    - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService - usado para converter xml <-> json (conversor.service.js)
   * @param {service} Cielo            - serviço de pagamento da cielo
   * @param {service} session          - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} consultCEP       - serviço para consulta de cep
   * @param {service} toastr           - notificações para os usuarios
   * @param {service} $rootScope       - scope geral
   * @param {service} EnviarEmail      - serviço para envio de email
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function PagamentoController(serverService, conversorService, Cielo, session, consultCEP, toastr, $rootScope, EnviarEmail) {
    const ID = session.user.id; //Id do casal
    var vm = this;

    //Dados do cartao de credito
    vm.cartao = {
      'numero': '',
      'validade': '',
      'indicador': '',
      'codigo': '',
      'bandeira': ''
    };
    vm.carregando = false; //Controla o loading
    //Dados do usuario pagante
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
    //Dados para nota fiscal
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

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.ConsultCEP = ConsultCEP;
    vm.Pagar = Pagar;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof PagamentoController
     */
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

    /**
     * @function AtualizarStatus
     * @desc Atualiza o status de pagamento do casal
     * @param {strong} status - Status do pagamento
     * @param {boolean} aprovacao - se foi pago ou nao
     * @param {strong} cod - codigo da transação
     * @memberof PagamentoController
     */
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
      serverService.Request('AtualizarStatusPagamentoCelebri', xml);
    }

    /**
     * @function ConsultCEP
     * @desc Usa o serviço consultCEP para procurar o endeço do cep digitado. E entao preenche o formulario
     * @memberof PagamentoController
     */
    function ConsultCEP() {
      consultCEP.consultar(vm.dados.cep).then(function (resp) {
        vm.dados.endereco = resp.logradouro;
        vm.dados.bairro = resp.bairro;
        vm.dados.cidade = resp.cidade;
        vm.dados.estado = resp.estado;
      });
    }

    /**
     * @function Email
     * @desc Envia um email para gustavo@pixla.com.br e bernardo@pixla.com.br com os dados de quem pagou
     * @memberof PagamentoController
     */
    function Email() {
      var conteudo = 'Pagamento realizado <br> <table>  <tr>    <td>ID</td>    <td>' + ID + '</td>  </tr>  <tr>    <td>Casal</td>    <td>' + session.user.casal.nomeNoiva + ' e ' + session.user.casal.nomeNoivo + '</td>  </tr>  <tr>    <td>Casamento</td>    <td>' + session.user.casal.dataCasamento + '</td>  </tr>  <tr>    <td>Email</td>    <td>' + session.user.casal.emailUsuario + '</td>  </tr>  </table>';

      EnviarEmail.Mail('gustavo@pixla.com.br', 'Status Pagamento [Dashboard]', conteudo);
      EnviarEmail.Mail('bernardo@pixla.com.br', 'Status Pagamento [Dashboard]', conteudo);

    }

    /**
     * @function Pagar
     * @desc Envia os dados de pagamento para a cielo
     * @memberof PagamentoController
     */
    function Pagar() {
      vm.carregando = true;
      /**
       * O padrao da data de vencimento da cielo eh
       * ano mes( ex. 201612)
       */
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

        if (codigo === '4' || codigo === '6') { //Codigo 4 ou 6 significa que esta td ok
          //Libera o dashboard
          $rootScope.pagante = true;
          $rootScope.liberado = true;
          toastr.success('Pagamento Realizado!');

          //Dados para registrar a transação
          aprovado = 'true';
          status = 'Transação autorizada';
          tid = resp.transacao.tid;

          RegistrarNotaFiscal();
          RegistrarPagamento(aprovado);
          Email();
          RegistrarRD();

          //Google Analytics
          ga('send', 'event', 'pagamento', 'clique');

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
        } else { // transacao nao autorizada
          aprovado = 'false';
          toastr.error('Autorização negada');
          status = 'Autorização negada';
        }

        vm.carregando = false;
        AtualizarStatus(status, aprovado, tid);

      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('AtualizarDadosCadastroNoivos -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function RegistrarNotaFiscal
     * @desc Registrada os dados do pagamento para efetuar a nota fiscal
     * @memberof PagamentoController
     */
    function RegistrarNotaFiscal() {
      vm.fiscal.DadosNotaFiscal.Endereco = vm.dados.endereco + ', ' + vm.dados.numero + ' - ' + vm.dados.bairro + ', ' + vm.dados.cidade + ' - ' + vm.dados.estado;
      vm.fiscal.DadosNotaFiscal.Nome = vm.dados.nome;
      var xml = conversorService.Json2Xml(vm.fiscal, '');
      serverService.Request('CadastrarDadosNotaFiscal', xml);
    }

    /**
     * @function RegistrarPagamento
     * @desc Registra que o pagamento foi feito no dashboard.
     * Pagamentos podem ser feitos fora do dashboard
     * @memberof PagamentoController
     */
    function RegistrarPagamento(aprovacao) {
      var dado = {
        'DadosPagamentoCelebri': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'IdCasal': ID,
          'Origem': 'Dashboard',
          'PagtoAprovado': aprovacao,
          'Valor': '185.00'
        }
      };

      var xml = conversorService.Json2Xml(dado, '');
      serverService.Request('RegistrarPagamentoCelebri', xml).then(function (resp) {});
    }

    /**
     * @function RegistrarRD
     * @desc Registra quem pagou no sistema do RD Station
     * @memberof PagamentoController
     */
    function RegistrarRD() {
      //Registra o token e o formulario para o qual vai a informacao
      RdIntegration.integrate('19182991894ae673fc83ae31d1c0134a', 'pagamento-dashboard');

      //Armazena os dados em um array para ser enviado ao RD Station
      var dataArray = [{
          name: 'email',
          value: session.user.casal.emailUsuario
        },
        {
          name: 'identificador',
          value: 'pagamento-dashboard'
        },
        {
          name: 'nome',
          value: session.user.casal.nomeUser
        },
        {
          name: 'token_rdstation',
          value: '19182991894ae673fc83ae31d1c0134a'
        }
      ];

      //Envia os dados para o RD
      RdIntegration.post(dataArray);
    }
  }
})();