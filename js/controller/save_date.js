/**
 * Save The Date Controller
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SaveTheDateCtrl', SaveTheDateCtrl);

  SaveTheDateCtrl.$inject = ['UserService', 'ServiceCasamento', 'ipService'];
  /**
   * @namespace SaveTheDateCtrl
   * @desc Gerencia o template do save the date e a mensagem
   * @memberOf Controllers
   */
  function SaveTheDateCtrl(UserService, ServiceCasamento, ipService) {
    var self  = this;
    var ID    = UserService.dados.ID;

    self.GetData  = GetData;
    self.Salvar   = Salvar;

    Init();

  /**
   * @namespace GetData
   * @desc Pega os dados do servidor
   * @memberOf Controllers.ConfirmadosCtrl
   */
    function GetData() {
      self.showDate = false;
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarFormatacaoSaveTheDate';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml       = $.parseXML(resp);
        var dataCasamento = '';

        self.modelo   = $(respXml).find('id_modelo').text();
        self.mensagem = $(respXml).find('msg').text();

        if (self.modelo === 0) {
          self.modelo = 1;

          try {
            var casamento = UserService.dados.dataCasamento.split('/');
            dataCasamento = casamento[1] + '/' + casamento[0] + '/' + casamento[2];
          } catch (error) {
            dataCasamento = '00/00/0000';
          }

          self.mensagem = 'Em momentos especiais como este, não tinha como não lembrarmos de você! Dia ' + dataCasamento + ' é um dia marcante para nós, o dia do nosso casamento e gostaríamos de compartilhar este momento com você. Marque esta data no seu calendário para não se esquecer. A sua participação é muito importante para nós! \r\n Em breve você receberá por e-mail, o convite do nosso casamento.';

          self.Salvar();
        } else {
          UserService.dados.modeloDate  = self.modelo;
          UserService.dados.msgDate     = self.mensagem;

          UserService.SaveState();
        }
        UserService.dados.dateCheck = true;
        self.showDate               = true;
      });
    }

  /**
   * @namespace Init
   * @desc Setup do controlador
   * @memberOf Controllers.ConfirmadosCtrl
   */
    function Init() {
      self.showDate = false;

      if (!UserService.dados.dateCheck) {
        self.GetData();
      } else {
        self.modelo   = UserService.dados.modeloDate;
        self.mensagem = UserService.dados.msgDate;
        self.showDate = true;
      }
    }

  /**
   * @namespace Salvar
   * @desc Envia os dados para o servidor
   * @memberOf Controllers.ConfirmadosCtrl
   */
    function Salvar() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/FormatacaoSaveTheDate';
      var xmlVar = '<DadosFormatacaoSaveTheDate xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <ErrorMessage></ErrorMessage>  <Result>true</Result>  <id_casal>' + ID + '</id_casal>  <id_modelo>' + self.modelo + '</id_modelo>  <msg>' + self.mensagem + '</msg>  <nomecasal>' + UserService.dados.nomeNoiva + ' e ' + UserService.dados.nomeNoivo + '</nomecasal></DadosFormatacaoSaveTheDate>';

      UserService.dados.modeloDate  = self.modelo;
      UserService.dados.msgDate     = self.mensagem;

      UserService.SaveState();

      ServiceCasamento.SendData(urlVar, xmlVar).catch(function (error) {
        console.error('Salvar -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }
  }
} ());