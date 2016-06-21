angular.module("dashboard").controller('confirmados', ['UserService', 'ipService', 'ServiceCasamento', '$http', function (UserService, ipService, ServiceCasamento, $http) {

  var self = this;
  var ID = UserService.dados.ID;
  var nomeNoiva = UserService.dados.nomeNoiva;
  var nomeNoivo = UserService.dados.nomeNoivo;
  var dataCasamento = UserService.dados.dataCasamento;

  self.carregando = true;
  self.enviando = false;
  self.msg = false;
  self.total = 0;

  self.listaConfirmados = [];

  self.getConfirmados = function () {

    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConvidadosConfirmados";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);

      $(respXml).find('ListaConvidadosConfirmados').each(function () {
        var listaAcompanhante = null;
        var count = 1;

        $(respXml).find('Lista_Acompanhantes').each(function () {
          count++;
          listaAcompanhante.push(
            {
              'Nome': $(this).find('Nome'),
            }
          );
        });
        self.listaConfirmados.push(
          {
            'Nome': $(respXml).find('Nome'),
            'Acompanhantes': listaAcompanhante,
            'Total': count
          }
        );
        self.total += count;
      });
      self.carregando = false;
    });

  };

  self.enviar = function () {
    if (self.email && self.nome) {
      self.enviando = true;
      var dados = {
        'NomeEnvio': self.email,
        'EmailEnvio': self.nome,
        'nomeNoiva': nomeNoiva,
        'nomeNoivo': nomeNoivo,
        'dataCasamento': dataCasamento,
        'TotalGeral': self.total,
        'Dados': self.listaConfirmados
      };

      $http.post('php/enviarListaConfirmados.php', dados).success(function (data) {
        self.enviando = false;
        self.msg = true;
      });
    }
  };
  self.getConfirmados();
}]);