/**
 * Configurar Confirmados Controller
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('ConfirmadosCtrl', ConfirmadosCtrl);

  ConfirmadosCtrl.$inject = ['UserService', 'ipService', 'ServiceCasamento', '$http', 'EnviarEmail'];
  /**
   * @namespace ConfirmadosCtrl
   * @desc Mostra quem confirmou para a festa
   * @memberOf Controllers
   */
  function ConfirmadosCtrl(UserService, ipService, ServiceCasamento, $http, EnviarEmail) {
    var self          = this;
    var dataCasamento = UserService.dados.dataCasamento;
    var ID            = UserService.dados.ID;
    var nomeNoiva     = UserService.dados.nomeNoiva;
    var nomeNoivo     = UserService.dados.nomeNoivo;

    self.carregando       = true;
    self.enviando         = false;
    self.listaConfirmados = [];
    self.msg              = false;
    self.total            = 0;

    Init();

  /**
   * @namespace Download
   * @desc Fez o dowload em pdf da lista de confirmados
   * @memberOf Controllers.ConfirmadosCtrl
   */
    function Download() {
      var columns = ['Nome do convidado', 'Acompanhantes', 'Total de Confirmados'];
      var rows    = [];

      angular.forEach(self.listaConfirmados, function (item) {
        var acompanhantes = '';

        angular.forEach(item.Acompanhantes, function (itens) {
          acompanhantes += itens.Nome + '\n';
        });
        rows.push(
          [item.Nome, acompanhantes, item.Total]
        );
      });

      var doc = new jsPDF('p', 'pt');
      doc.autoTable(columns, rows);
      doc.save('lista_convidados.pdf');
    }

  /**
   * @namespace Enviar
   * @desc Envia para o e-mail fornecido a lista de confirmados
   * @memberOf Controllers.ConfirmadosCtrl
   */
    function Enviar() {
      if (self.email && self.nome) {
        self.enviando = true;
        var data      = dataCasamento.split('/');
        data          = data[1] + '/' + data[0] + '/' + data[2];

        var destinatario  = self.email;
        var assunto       = 'Lista de Casamento [Celebri]';
        var conteudo      = '<span>Olá ' + self.nome + ', <br>essa é a lista dos convidados confirmados para o casamento de ' + nomeNoiva + ' e ' + nomeNoivo + ', no dia ' + data + '</span><br><br><table width="500" cellspacing="0" cellpadding="0" border="1"><thead><tr><td style="padding: 10px;"><b>Nome do convidado</b></td><td style="padding: 10px;"><b>Acompanhantes</b></td><td style="padding: 10px;"><b>Nº de Confirmados <br> (Convidado + Acompanhantes)</b></td></tr></thead>';

        angular.forEach(self.listaConfirmados, function (item) {
          conteudo += '<tr><td style="padding: 10px;">' + item.Nome + '</td><td style="padding: 10px;">';

          angular.forEach(item.Acompanhantes, function (acompanhant) {
            conteudo += acompanhant.Nome + '<br>';
          });
          conteudo += '</td><td align="center" style="padding: 10px;">' + item.Total + '</td></tr>';
        });

        conteudo += '</table><span style="margin-top: 30px;display: block;width: 500px;text-align: right;">  Total geral de convidados: <b>' + self.total + '</b></span>';


        EnviarEmail.Mail(destinatario, assunto, conteudo).then(function (data) {
          console.log(data);
          console.log(conteudo);
          self.enviando   = false;
          self.msg        = true;
          self.nome       = '';
          self.email      = '';
        }).catch(function (error) {
          console.error('Enviar -> ', error);
        });
      }
    }

  /**
   * @namespace GetConfirmados
   * @desc Pega a lista de confirmados do servidor
   * @memberOf Controllers.ConfirmadosCtrl
   */
    function GetConfirmados() {

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConvidadosConfirmados';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml           = $.parseXML(resp);
        var listaAcompanhante = [];
        self.listaConfirmados = [];

        $(respXml).find('ListaConvidadosConfirmados').each(function () {
          var count         = 1;
          var convidado     = this;
          listaAcompanhante = [];

          $(convidado).find('ListaAcompanhantes').each(function () {
            count++;
            listaAcompanhante.push(
              {
                'Nome': $(this).find('Nome').text(),
              }
            );
          });

          self.listaConfirmados.push(
            {
              'Nome'          : $(this).find('NomeConvidado').text(),
              'Acompanhantes' : listaAcompanhante,
              'Total'         : count
            }
          );
          self.total    += count;
        });
        self.carregando = false;
      }).catch(function (error) {
        console.error('GetConfirmados -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @namespace Init
   * @desc Setup do controlador
   * @memberOf Controllers.ConfirmadosCtrl
   */
    function Init() {
      /**
       * Adiciona as funcoes ao scope do controlador
       */
      self.Download = Download;
      self.Enviar   = Enviar;

      GetConfirmados();
    }
  }
} ());