/**
 * Save The Date2 Controller
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SaveTheDatePg2Ctrl', SaveTheDatePg2Ctrl);

  SaveTheDatePg2Ctrl.$inject = ['UserService', 'ServiceCasamento', 'ipService'];
  /**
   * @namespace SaveTheDatePg2Ctrl
   * @desc Mostra a lista de convidados para selecionar quais receberao o save the date
   * @memberOf Controllers
   */
  function SaveTheDatePg2Ctrl(UserService, ServiceCasamento, ipService) {
    var self  = this;
    var ID    = UserService.dados.ID;

    self.selectedAll    = false;
    self.allowToSend    = false;
    self.carregando     = true;
    self.convidadoLista = [];
    self.selecionados   = [];

    self.CheckAll       = CheckAll;
    self.CheckConvidado = CheckConvidado;
    self.Enviar         = Enviar;

    GetConvidados();

  /**
   * @namespace CheckAll
   * @desc Seleciona todos os convidados da lsita
   * @memberOf Controllers.SaveTheDatePg2Ctrl
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
   * @namespace CheckConvidado
   * @desc Seleciona um convidado da lsita
   * @memberOf Controllers.SaveTheDatePg2Ctrl
   */
    function CheckConvidado(key, id, selected) {
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
   * @namespace Enviar
   * @desc Envia os dados para o servidor para enviar o email
   * @memberOf Controllers.SaveTheDatePg2Ctrl
   */
    function Enviar() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/EnvioEmailSaveTheDate';
      var xmlVar = '<ListaEmailConvidados xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + ID + '</Id_casal>  <Id_convidado>';

      angular.forEach(self.selecionados, function (item) {
        xmlVar += '<int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + item + '</int>';
      });

      xmlVar += '</Id_convidado></ListaEmailConvidados>';

      self.carregando = true;

      ServiceCasamento.SendData(urlVar, xmlVar).then(function () {
        GetConvidados();
      }).catch(function (error) {
        console.error('Enviar -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @namespace GetConvidados
   * @desc Pega a lista de convidados do servidor
   * @memberOf Controllers.SaveTheDatePg2Ctrl
   */
    function GetConvidados() {
      self.carregando = true;
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConvidados';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        self.carregando = false;
        var respXml = $.parseXML(resp);
        self.convidadoLista = [];

        $(respXml).find('Convidado').each(function () {
          var status = 'Não Enviado';

          if ($(this).find('SaveTheDateEnviado').text() === 'true') {
            status = 'Enviado';
          }
          self.convidadoLista.push(
            {
              'Id'      : $(this).find('Id').text(),
              'nome'    : $(this).find('Nome').text(),
              'email'   : $(this).find('Email').text(),
              'status'  : status,
              'Selected': false,
            }
          );
        });
      }).catch(function (error) {
        console.error('GetConvidados -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }
  }
} ());