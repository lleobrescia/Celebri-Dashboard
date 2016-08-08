(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PagamentoCtrl', PagamentoCtrl);

  PagamentoCtrl.$inject = ['$http', 'ipService', 'UserService', 'ServiceCasamento'];

  function PagamentoCtrl($http, ipService, UserService, ServiceCasamento) {
    var ID = UserService.dados.ID;
    var self = this;

    self.allowToSend = false;
    self.carregando = true;
    self.carregandoPagina = true;
    self.cartao = null;
    self.isPg = false;
    self.convidadoLista = [];
    self.mensagem = false;
    self.mensagemPagamento = null;
    self.messes = [
      {
        'mes': 'Janeiro',
        'value': '01'
      },
      {
        'mes': 'Fevereiro',
        'value': '02'
      },
      {
        'mes': 'Março',
        'value': '03'
      },
      {
        'mes': 'Abril',
        'value': '04'
      },
      {
        'mes': 'Maio',
        'value': '05'
      },
      {
        'mes': 'Junho',
        'value': '06'
      },
      {
        'mes': 'Julho',
        'value': '07'
      },
      {
        'mes': 'Agosto',
        'value': '08'
      },
      {
        'mes': 'Setembro',
        'value': '09'
      },
      {
        'mes': 'Outubro',
        'value': '10'
      },
      {
        'mes': 'Novembro',
        'value': '11'
      },
      {
        'mes': 'Dezembro',
        'value': '12'
      }
    ];
    self.nome = null;
    self.numeroCartao = null;
    self.numeroSeg = null;
    self.selecionados = [];
    self.senhaApp = UserService.dados.senhaApp;
    self.validadeAno = null;
    self.validadeMes = null;

    self.CheckAll = CheckAll;
    self.CheckConvidado = CheckConvidado;
    self.Enviar = Enviar;
    self.EnviarPagamento = EnviarPagamento;

    init();

    function AtualizarStatus(aprovado, status, cod) {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RegistrarPagamentoCelebri';
      var xmlVar = '<DadosPagamentoCelebri xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <IdCasal>' + ID + '</IdCasal>  <PagtoAprovado>' + aprovado + '</PagtoAprovado> <Valor>185.00</Valor></DadosPagamentoCelebri>';


      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        self.carregandoPagina = false;
      });

    }

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

    function CheckAll() {
      if (self.selectedAll) {
        self.selectedAll = true;
        self.allowToSend = true;
      } else {
        self.selectedAll = false;
        self.allowToSend = false;
        self.selecionados = [];
      }
      angular.forEach(self.convidadoLista, function (item) {
        item.Selected = self.selectedAll;

        if (self.selectedAll) {
          self.selecionados.push(item.Id);
        }
      });
    }

    function Enviar() {
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
        });
      }
      self.carregando = false;
    }

    function EnviarPagamento() {
      if (!self.cartao &&
        !self.numeroCartao &&
        !self.nome &&
        !self.validadeMes &&
        !self.validadeAno &&
        !self.numeroSeg) {
        return null;
      }

      var dataVar = {
        'cartao': self.cartao,
        'numeroCartao': self.numeroCartao,
        'nome': self.nome,
        'validadeMes': self.validadeMes,
        'validadeAno': self.validadeAno,
        'numeroSeg': self.numeroSeg
      };

      self.carregandoPagina = true;

      $.ajax({
        type: 'POST',
        url: 'php/cieloRequisicao.php',
        data: dataVar,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).then(function (resp) {
        console.log(resp);
        var aprovado = 'false';
        var status = null;
        var codigo = 0;
        var tid = null;

        try {
          status = self.mensagemPagamento = resp.autorizacao.mensagem;
          codigo = resp.autorizacao.codigo;
        } catch (error) {
          status = 'Erro ao enviar os dados. Por favor, tente novamente.';
          self.mensagemPagamento = status;
        }

        tid = resp.tid;

        console.log(codigo);

        self.cartao = null;
        self.numeroCartao = null;
        self.nome = null;
        self.validadeMes = null;
        self.validadeAno = null;
        self.numeroSeg = null;

        if (codigo=== '4') {
          aprovado = 'true';
          self.isPg = true;
          self.mensagemPagamento = 'autorizada';
        }

         self.carregandoPagina = false;
        // AtualizarStatus(aprovado, status, tid);
      });
    }

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
              'Id': $(this).find('Id').text(),
              'Nome': $(this).find('Nome').text(),
              'Email': $(this).find('Email').text(),
              'ConviteEnviado': status
            }
          );
        });
        self.carregando = false;
        self.mensagem = false;
      });
    }

    function GetStatusPagamento() {
      var status = 'false';
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarStatusPagamentoCelebri';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        // status = $(respXml).find('PagamentoRealizado').text();

      }).then(function () {
        if (status === 'true') {
          self.isPg = true;
        } else {
          self.isPg = false;
        }
        self.carregandoPagina = false;
      });
    }

    function init() {
      GetConvidados();
      GetStatusPagamento();
    }
  }
} ());