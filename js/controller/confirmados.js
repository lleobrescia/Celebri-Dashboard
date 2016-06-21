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
      var listaAcompanhante = [];
      self.listaConfirmados = [];

      $(respXml).find('ListaConvidadosConfirmados').each(function () {
        var count = 1;
        var convidado = this;
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
            'Nome': $(this).find('NomeConvidado').text(),
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
      var data = dataCasamento.split('/');
      data = data[1] + "/" + data[0] + "/" + data[2];

      var dados = {
        'NomeEnvio': self.nome,
        'EmailEnvio': self.email,
        'nomeNoiva': nomeNoiva,
        'nomeNoivo': nomeNoivo,
        'dataCasamento': data,
        'TotalGeral': self.total,
        'Dados': self.listaConfirmados
      };

      $http.post('php/enviarListaConfirmados.php', dados).success(function (data) {
        self.enviando = false;
        self.msg = true;
        console.log(data);
        self.nome = '';
        self.email = '';
      });
    }
  };

  self.download = function () {
    var columns = ["Nome do convidado", "Acompanhantes", "Total de Confirmados"];
    var rows = [];

    angular.forEach(self.listaConfirmados, function (item) {
      var acompanhantes = '';

      angular.forEach(item.Acompanhantes, function (itens) {
        acompanhantes += itens.Nome + "\n";
      });
      rows.push(
        [item.Nome, acompanhantes, item.Total]
      );
    });

    var doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows);
    doc.save('lista_convidados.pdf');
  };

  self.getConfirmados();
}]);