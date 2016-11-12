(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EnviarConviteCtrl', EnviarConviteCtrl);

  EnviarConviteCtrl.$inject = ['UserService', 'ServiceCasamento', 'ipService', 'PageService', '$mdToast'];
  function EnviarConviteCtrl(UserService, ServiceCasamento, ipService, PageService, $mdToast) {
    var self = this;
    var ID    = UserService.dados.ID;

    self.carregando     = true;
    self.convidadoLista = [];
    self.selectedAll    = false;
    self.selecionados   = [];

    self.Enviar           = Enviar;
    self.Exists           = Exists;
    self.IsChecked        = IsChecked;
    self.IsIndeterminate  = IsIndeterminate;
    self.ToggleAll        = ToggleAll;
    self.Toggle           = Toggle;

    GetConvidados();

    //Set Title 
    PageService.SetTitle('Enviar os Convites');

    /**
   * @namespace Enviar
   * @desc Envia os dados para o servidor para enviar o email
   * @memberOf Controllers.EnviarSaveDateCtrl
   */
    function Enviar() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/EnvioEmailConvite';
      var xmlVar = '<ListaEmailConvidados xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + ID + '</Id_casal>  <Id_convidado>';

      angular.forEach(self.selecionados, function (item) {
        xmlVar += '<int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + item.Id + '</int>';
      });

      xmlVar += '</Id_convidado></ListaEmailConvidados>';

      self.carregando   = true;
      self.selecionados = [];

      ServiceCasamento.SendData(urlVar, xmlVar).then(function () {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Convite Enviado')
            .position('top right')
            .hideDelay(3000)
            .action('x')
        );
        GetConvidados();
      }).catch(function (error) {
        console.error('Enviar -> ', error);
      });
    }

    function Exists(item, list) {
      return list.indexOf(item) > -1;
    }


    /**
    * @namespace GetConvidados
    * @desc Pega a lista de convidados do servidor
    * @memberOf Controllers.EnviarSaveDateCtrl
    */
    function GetConvidados() {
      self.carregando = true;
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConvidados';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        self.carregando = false;
        var respXml = $.parseXML(resp);
        console.log(respXml);
        self.convidadoLista = [];

        $(respXml).find('Convidado').each(function () {
          var status = 'Não Enviado';

          if ($(this).find('ConviteEnviado').text() === 'true') {
            status = 'Enviado';
          }
          self.convidadoLista.push(
            {
              'Id': $(this).find('Id').text(),
              'nome': $(this).find('Nome').text(),
              'email': $(this).find('Email').text(),
              'status': status
            }
          );
        });
      }).catch(function (error) {
        console.error('GetConvidados -> ', error);
      });
    }

    function IsChecked() {
      return (self.selecionados.length === self.convidadoLista.length);
    }

    function IsIndeterminate() {
      return (self.selecionados.length !== 0 &&
        self.selecionados.length !== self.convidadoLista.length);
    }

    function ToggleAll() {
      if (self.selecionados.length === self.convidadoLista.length) {
        self.selecionados = [];
      } else if (self.selecionados.length === 0 || self.selecionados.length > 0) {
        self.selecionados = self.convidadoLista.slice(0);
      }
    }

    function Toggle(item, list) {
      var idx = list.indexOf(item);

      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    }
  }
})();