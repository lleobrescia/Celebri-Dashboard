/**
 * Pagamento Controller
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('PagamentoCtrl', PagamentoCtrl);

  PagamentoCtrl.$inject = ['$http', 'ipService', 'UserService', 'ServiceCasamento', 'Cielo', 'EnviarEmail'];
  /**
   * @namespace PagamentoCtrl
   * @desc Controla o pagamento do sistema. Passa os dados do cartao do usuario para o sistema da Cielo.
   * Depois que estiver pago, mostra a lista de usuarios para enviar o convite
   * @memberOf Controllers
   */
  function PagamentoCtrl($http, ipService, UserService, ServiceCasamento, Cielo, EnviarEmail) {
    var emailUsuario  = UserService.dados.emailUsuario; //Serve para verificar se ha algum desconto
    var ID            = UserService.dados.ID;
    var self          = this;

    self.allowToSend        = false;
    self.carregando         = true;
    self.carregandoPagina   = true;
    self.cartao             = null;
    self.isPg               = false;
    self.convidadoLista     = [];
    self.mensagem           = false;
    self.mensagemPagamento  = null;
    self.messes = [
      {
        'mes'   : 'Janeiro',
        'value' : '01'
      },
      {
        'mes'   : 'Fevereiro',
        'value' : '02'
      },
      {
        'mes'   : 'Março',
        'value' : '03'
      },
      {
        'mes'   : 'Abril',
        'value' : '04'
      },
      {
        'mes'   : 'Maio',
        'value' : '05'
      },
      {
        'mes'   : 'Junho',
        'value' : '06'
      },
      {
        'mes'   : 'Julho',
        'value' : '07'
      },
      {
        'mes'   : 'Agosto',
        'value' : '08'
      },
      {
        'mes'   : 'Setembro',
        'value' : '09'
      },
      {
        'mes'   : 'Outubro',
        'value' : '10'
      },
      {
        'mes'   : 'Novembro',
        'value' : '11'
      },
      {
        'mes'   : 'Dezembro',
        'value' : '12'
      }
    ];
    self.nome         = null;
    self.numeroCartao = null;
    self.numeroSeg    = null;
    self.selecionados = [];
    self.selectedAll  = false;
    self.senhaApp     = UserService.dados.senhaApp;
    self.validadeAno  = null;
    self.validadeMes  = null;

    self.CheckAll         = CheckAll;
    self.CheckConvidado   = CheckConvidado;
    self.Enviar           = Enviar;
    self.EnviarPagamento  = EnviarPagamento;

    Init();

  /**
   * @namespace AtualizarStatus
   * @desc Atualiza o status do usuario. ( Se pagou ou nao )
   * @memberOf Controllers.PagamentoCtrl
   */
    function AtualizarStatus(aprovado, status, cod) {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RegistrarPagamentoCelebri';
      var xmlVar = '<DadosPagamentoCelebri xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <IdCasal>' + ID + '</IdCasal>  <PagtoAprovado>' + aprovado + '</PagtoAprovado> <Valor>185.00</Valor></DadosPagamentoCelebri>';


      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        self.carregandoPagina = false;
      }).catch(function (error) {
        console.error('AtualizarStatus -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @namespace CheckConvidado
   * @desc Seleciona um ou mais convidados da lista
   * @memberOf Controllers.PagamentoCtrl
   */
    function CheckConvidado(id, selected) {
      if (selected) {
        self.selecionados.push(id);
      } else {
        var count = 0;
        angular.forEach(self.selecionados, function (item) {
          if (item === id) {
            self.selecionados.splice(count, 1);
          }
          count++;
        });
      }
      if (self.selecionados.length > 0) {
        self.allowToSend = true;
      } else {
        self.allowToSend = false;
      }
    }

  /**
   * @namespace CheckAll
   * @desc Seleciona todos os convidados da lista
   * @memberOf Controllers.PagamentoCtrl
   */
    function CheckAll() {
      if (self.selectedAll) {
        self.selectedAll = true;
        self.allowToSend = true;
      } else {
        self.selectedAll  = false;
        self.allowToSend  = false;
        self.selecionados = [];
      }
      angular.forEach(self.convidadoLista, function (item) {
        item.Selected = self.selectedAll;

        if (self.selectedAll) {
          self.selecionados.push(item.Id);
        }
      });
    }

  /**
   * @namespace Enviar
   * @desc Envia os convidados selecionados para o servidor, para receberem o convite
   * @memberOf Controllers.PagamentoCtrl
   */
    function Enviar() {
      // Verifica se o usuario pagou antes de enviar
      GetStatusPagamento();

      self.carregando = true;
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/EnvioEmailConvite';
      var xmlVar = '<ListaEmailConvidados xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_convidado>';

      angular.forEach(self.selecionados, function (item) {
        xmlVar += '<int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + item + '</int>';
      });
      xmlVar += '</Id_convidado></ListaEmailConvidados>';

      if (self.isPg) {
        ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
          self.mensagem = true;

          GetConvidados();
        }).catch(function (error) {
          console.error('Enviar -> ', error);
          console.warn('Dados enviados:', xmlVar);
        });
      }
      self.carregando = false;
    }

  /**
   * @namespace EnviarEmailAdmin
   * @desc Envia um e-mail para o Gustavo com o status da transação
   * @memberOf Controllers.PagamentoCtrl
   */
    function EnviarEmailAdmin(status){
      var destinatario   = 'gustavo@pixla.com.br';
      var assunto       = 'Status Pagamento [Celebri]';
      var conteudo      = 'ID Casal: ' + ID + '<br>' +'Status:' + status ;

      EnviarEmail.Mail(destinatario, assunto, conteudo).catch(function (error) {
        console.error('EnviarEmailAdmin ->', error);
      });
    }

  /**
   * @namespace EnviarPagamento
   * @desc Envia os dados do cartao do usuario para o sistema da Cielo
   * @memberOf Controllers.PagamentoCtrl
   */
    function EnviarPagamento() {
      if (!self.cartao      &&
        !self.numeroCartao  &&
        !self.nome          &&
        !self.validadeMes   &&
        !self.validadeAno   &&
        !self.numeroSeg) {
        return null;
      }

      var dataVar = {
        'cartao'      : self.cartao,
        'numeroCartao': self.numeroCartao,
        'nome'        : self.nome,
        'validadeMes' : self.validadeMes,
        'validadeAno' : self.validadeAno,
        'numeroSeg'   : self.numeroSeg
      };

      self.carregandoPagina = true;
      Cielo.Request(self.numeroCartao, self.validadeAno, self.validadeMes, self.numeroSeg, self.cartao).then(function (resp) {
        var respXml   = $.parseXML(resp);
        var aprovado  = 'false';
        var status    = null;
        var codigo    = 0;
        var tid       = null;

        try {
          status = self.mensagemPagamento = $(respXml).find('autorizacao').find('mensagem').text();
          codigo = $(respXml).find('autorizacao').find('codigo').text();
        } catch (error) {
          status                 = 'Erro ao enviar os dados. Por favor, tente novamente.';
          self.mensagemPagamento = status;
        }

        tid = resp.tid;

        self.cartao       = null;
        self.numeroCartao = null;
        self.nome         = null;
        self.validadeMes  = null;
        self.validadeAno  = null;
        self.numeroSeg    = null;

        if (codigo === '4' || codigo === '6') {
          aprovado                = 'true';
          self.isPg               = true;
          self.mensagemPagamento  = 'autorizada';
        }

        self.carregandoPagina = false;

        EnviarEmailAdmin(status);
        AtualizarStatus(aprovado, status, tid);
      }).catch(function (error) {
        console.error('EnviarPagamento ->', error);
        console.warn('Dados enviados:', dataVar);
      });
    }

  /**
   * @namespace GetConvidados
   * @desc Pega a lista de convidados do servidor
   * @memberOf Controllers.PagamentoCtrl
   */
    function GetConvidados() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConvidados';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.convidadoLista = [];

        $(respXml).find('Convidado').each(function () {
          var status = 'Enviado';
          if ($(this).find('ConviteEnviado').text() === 'false') status = 'Não Enviado';

          self.convidadoLista.push(
            {
              'Id'            : $(this).find('Id').text(),
              'Nome'          : $(this).find('Nome').text(),
              'Email'         : $(this).find('Email').text(),
              'ConviteEnviado': status
            }
          );
        });
        self.carregando = false;
        self.mensagem   = false;
      }).catch(function (error) {
        console.error('GetConvidados ->', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @namespace GetStatusPagamento
   * @desc Pega o status do pagamento. Se o usuario ja pagou ou nao
   * @memberOf Controllers.PagamentoCtrl
   */
    function GetStatusPagamento() {
      var status = 'false';
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarStatusPagamentoCelebri';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        status = $(respXml).find('PagamentoRealizado').text();

      }).then(function () {
        if (status === 'true') {
          self.isPg = true;
        } else {
          self.isPg = false;
        }
        self.carregandoPagina = false;
      });
    }

  /**
   * @namespace VerificarPagamento
   * @desc Verifica se ha desconto ou se o usuario pagou de alguma forma, fora do sistema
   * @memberOf Controllers.PagamentoCtrl
   */
    function VerificarPagamento() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarExisteEmailIsentoPagtoCelebri';
      var xmlVar = '<EmailCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Email>' + emailUsuario + '</Email></EmailCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var result = $(respXml).find('Result').text();

        if (result === 'true') {
          self.isPg = true;
          AtualizarStatus(true, 'Pagou', 0);
        }
      }).catch(function (error) {
        console.error('VerificarPagamento -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @namespace Init
   * @desc Setup do sistema
   * @memberOf Controllers.PagamentoCtrl
   */
    function Init() {
      VerificarPagamento();
      GetConvidados();
      GetStatusPagamento();

      self.isPg = true;
    }
  }
} ());