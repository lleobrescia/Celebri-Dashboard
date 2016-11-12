/**
 * Pagamento Controller
 * Recebe os dados do formulario da pagina pagamento.html
 * envia-os para o servico cielo 
 * registra o pagamento e envia um email para os admins para controle
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('PagamentoCtrl', PagamentoCtrl);

  PagamentoCtrl.$inject = ['$http', 'ipService', 'UserService', 'ServiceCasamento', 'Cielo', 'EnviarEmail', 'PageService', 'consultCEP'];
  /**
   * @namespace PagamentoCtrl
   * @desc Controla o pagamento do sistema. Passa os dados do cartao do usuario para o sistema da Cielo.
   * @memberOf Controllers
   */
  function PagamentoCtrl($http, ipService, UserService, ServiceCasamento, Cielo, EnviarEmail, PageService, consultCEP) {
    var emailUsuario = UserService.dados.emailUsuario; //Serve para verificar se ha algum desconto
    var ID = UserService.dados.ID;
    var self = this;

    self.carregando = true;
    self.mensagem = false;
    self.mensagemPagamento = null;

    self.cartao = null;
    self.cep = null;
    self.cidade = null;
    self.email = null;
    self.end = null;
    self.estado = null;
    self.nome = null;
    self.numeroCartao = null;
    self.numeroSeg = null;
    self.validade = null;

    self.ConsultarCep = ConsultarCep;
    self.EnviarPagamento = EnviarPagamento;

    Init();

    /**
     * @namespace AtualizarStatus
     * @desc Atualiza o status do usuario. ( Se pagou ou nao )
     * @memberOf Controllers.PagamentoCtrl
     */
    function AtualizarStatus(aprovado, status, cod) {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RegistrarPagamentoCelebri';
      var xmlVar = '<DadosPagamentoCelebri xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <IdCasal>' + ID + '</IdCasal><Origem>Celebri</Origem>  <PagtoAprovado>' + aprovado + '</PagtoAprovado> <Valor>185.00</Valor></DadosPagamentoCelebri>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {

      }).catch(function (error) {
        emailConteudo = 'AtualizarStatus <br>' + self.email;
        EnviarEmail.Mail('leo.brescia@pixla.com.br', 'Erro  [Dashboard]', emailConteudo);
        console.error('AtualizarStatus -> ', error);
      });
    }

    /**
     * @namespace ConsultarCep
     * @desc Consulta o cep fornecido para obter o mome do logradouro
     * @memberOf Controllers.PagamentoCtrl
     */
    function ConsultarCep(cep) {
      console.log(cep);
      console.log('cep');
      try {
        consultCEP.consultar(cep).then(function (data) {
          console.log(data);
          self.end = data.logradouro;
          self.bairro = data.bairro;
          self.cidade = data.cidade;
          self.estado = data.estado;

        });
      } catch (error) { }
    }

    /**
     * @namespace EnviarPagamento
     * @desc Envia os dados do cartao do usuario para o sistema da Cielo
     * @memberOf Controllers.PagamentoCtrl
     */
    function EnviarPagamento() {
      /**
       * Formato da data: MM/AA
       * formato para enviar ao serviço: 20AA MM
       */
      var valiade = self.valiade.split('/');
      var validadeAno = '20' + valiade[1];

      Cielo.Request(self.numeroCartao, valiade[1], valiade[0], self.codigo, self.cartao).then(function (resp) {
        var respXml = $.parseXML(resp);
        var aprovado = 'false';
        var status = null;
        var codigo = 1;    //Codigo da operação ( codg de acerto ou erro)
        var tid = null; //codigo da transação
        var emailConteudo = null;

        try {
          status = self.mensagemPagamento = $(respXml).find('autorizacao').find('mensagem').text();
          codigo = $(respXml).find('autorizacao').find('codigo').text();
        } catch (error) {
          status = 'Erro ao enviar os dados. Por favor, tente novamente.';
          self.mensagemPagamento = status;
        }

        tid = resp.tid;

        if (codigo === '4' || codigo === '6') {
          aprovado = 'true';
          self.mensagemPagamento = 'autorizada';

          //Atualiza o Status do usuario
          AtualizarStatus(aprovado, status, tid);

          RegistrarPagamento();

          //Envia email para controle
          emailConteudo = 'Pagamento realizado! <br> Nome: ' + self.nome + '<br>E-mail:' + self.email;
          EnviarEmail.Mail('gustavo@pixla.com.br', 'Status Pagamento [Dashboard]', emailConteudo);
          EnviarEmail.Mail('benrnardo@pixla.com.br', 'Status Pagamento [Dashboard]', emailConteudo);

          //Google Analytics
          ga('send', 'event', 'pagamento', 'clique');
        }
        //Erro no xml
        else if (codigo === '1') {
          self.mensagemPagamento = 'Erro ao enviar os dados. Por favor, tente novamente.';
          self.carregando = false;
          self.mensagemErro = true;

          emailConteudo = 'Dashboard <br>' + self.email;
          EnviarEmail.Mail('leo.brescia@pixla.com.br', 'Erro pagamento [codigo 1]', emailConteudo);
        } else {
          self.carregando = false;
          self.mensagemErro = true;
        }

        self.carregando = true;
      }).catch(function (error) {
        emailConteudo = 'EnviarPagamento <br>' + self.email;
        EnviarEmail.Mail('leo.brescia@pixla.com.br', 'Erro  [Dashboard]', emailConteudo);
        console.error('EnviarPagamento ->', error);
      });
    }

    /**
     * @namespace Init
     * @desc Setup do sistema
     * @memberOf Controllers.PagamentoCtrl 
     */
    function Init() {
      //Set Title 
      PageService.SetTitle('Pagamento');

    /**
     * Inicializa o validateCreditCard no input dentro de .cartao
     */
      $(document).ready(function () {
        $('.cartao input').validateCreditCard(function (result) {
          var cardName = null;

          try {
            cardName = result.card_type.name;
          } catch (error) {
            $('.cartao input').css('background-position', '4px 4px');
          }

          switch (cardName) {
            case null:
              $('.cartao input').css('background-position', '4px 4px');
              break;
            case "mastercard":
              $('.cartao input').css('background-position', '4px -106px');
              break;
            case "visa":
              $('.cartao input').css('background-position', '4px -31px');
              break;
            case "visa_electron":
              $('.cartao input').css('background-position', '4px -69px');
              break;

            default:
              $('.cartao input').css('background-position', '4px -143px');
              break;
          }
          self.cartao = cardName;
        });
      });
    }

    /**
     * @namespace RegistrarPagamento
     * @desc Envia os dadosdo usuario para o BD da NTF
     * @memberOf Controllers.PagamentoCtrl
     */
    function RegistrarPagamento() {
      var end = self.endereco + "," + self.numero + " " + self.bairro + " * " + self.cidade + " / " + self.estado + " - " + self.cep;
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/CadastrarDadosNotaFiscal';
      var xmlVar = '<DadosNotaFiscal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Cpf>' + self.cpf + '</Cpf>  <Email>' + self.email + '</Email>  <Endereco>' + end + '</Endereco>  <Id_Casal>0</Id_Casal>  <Nome>' + self.nome + '</Nome></DadosNotaFiscal>';

      ServiceCasamento.SendData(urlVar, xmlVar).catch(function (error) {
        emailConteudo = 'RegistrarPagamento <br>' + self.email;
        EnviarEmail.Mail('leo.brescia@pixla.com.br', 'Erro  [Dashboard]', emailConteudo);
        console.error('EnviarPagamento ->', error);
      });
    }
  }
} ());