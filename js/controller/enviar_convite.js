angular.module("dashboard").controller('enviar_convite', ['UserService', 'ipService', 'ServiceCasamento', function (UserService, ipService, ServiceCasamento) {

  var self = this;
  var ID = UserService.dados.ID;
  self.senhaApp = UserService.dados.senhaApp;

  self.carregando = true;
  self.allowToSend = false;
  self.mensagem = false;

  self.convidado_lista = [];
  self.selecionados = [];

  self.checkAll = function () {
    if (self.selectedAll) {
      self.selectedAll = true;
      self.allowToSend = true;
    } else {
      self.selectedAll = false;
      self.allowToSend = false;
      self.selecionados = [];
    }
    angular.forEach(self.convidado_lista, function (item) {
      item.Selected = self.selectedAll;

      if (self.selectedAll) {
        self.selecionados.push(item.Id);
      }
    });
  };

  self.checkConvidado = function (id, selected) {
    if (selected) {
      self.selecionados.push(id);
    } else {
      var count = 0;
      angular.forEach(self.selecionados, function (item) {
        if (item == id) {
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
  };

  self.enviar = function () {
    self.carregando = true;
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/EnvioEmailConvite";
    var xmlVar = '<ListaEmailConvidados xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_convidado>';

    angular.forEach(self.selecionados, function (item) {
      xmlVar += '<int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + item + '</int>';
    });
    xmlVar += '</Id_convidado></ListaEmailConvidados>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      self.mensagem = true;
      self.carregando = false;
      self.getConvidados();
    });
  };

  self.getConvidados = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConvidados";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      self.convidado_lista = [];

      $(respXml).find('Convidado').each(function () {
        var status = "Enviado";
        if ($(this).find('ConviteEnviado').text() == 'false') status = "Não Enviado";

        self.convidado_lista.push(
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
  };

  self.getConvidados();
}]);