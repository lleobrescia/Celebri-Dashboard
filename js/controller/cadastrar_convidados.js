angular.module("dashboard").controller('cadastrar_convidados', ['ServiceCasamento', 'UserService', 'ipService', function (ServiceCasamento, UserService, ipService) {

  var self = this;
  var ID = UserService.dados.ID;
  self.showConvidados = false;
  self.convidado_acompanhantes = '0';

  self.getConvidados = function () {
    self.showConvidados = false;
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConvidados";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';
    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);

      self.convidado_lista = [];
      $(respXml).find('Convidado').each(function () {
        self.convidado_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'nome': $(this).find('Nome').text(),
            'email': $(this).find('Email').text(),
            'convidados': $(this).find('Qtde_Acompanhantes').text()
          }
        );
      });
      self.showConvidados = true;
      UserService.dados.convidado_lista = self.convidado_lista;
      UserService.SaveState();
    });
  };

  self.removeConvidado = function (dataId, key) {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ExcluirConvidados";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    self.convidado_lista.splice(key, 1);
    UserService.dados.convidado_lista = self.convidado_lista;
    UserService.SaveState();

    ServiceCasamento.SendData(urlVar, xmlVar);
  };

  self.adicionarConvidado = function () {
    if (self.convidado_nome && self.convidado_email) {
      self.showConvidados = false;


      var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/CadastroConvidados";
      var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.convidado_email + '</Email><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.convidado_nome + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + self.convidado_acompanhantes + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        console.log(urlVar);
        console.log(xmlVar);
        console.log(resp);
        self.getConvidados();
        self.convidado_nome = "";
        self.convidado_acompanhantes = '0';
        self.convidado_email = "";
        self.convidado_telefone = "";

        self.getConvidados();
      });
    }
  };

  function handleFile(e) {
    var files = e.target.files;
    var i, f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
      var reader = new FileReader();
      var name = f.name;
      reader.onload = function (e) {
        var data = e.target.result;

        var workbook = XLSX.read(data, { type: 'binary' });

        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function (y) { /* iterate through sheets */
          var worksheet = workbook.Sheets[y];
          var count = 0;
          var result = [];
          for (z in worksheet) {

            /* all keys that do not begin with "!" correspond to cell addresses */
            if (z[0] === '!') continue;
            result[count] = worksheet[z].v;

            if (count == 2) {
              self.showConvidados = false;
              var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/CadastroConvidados";
              var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + result[1] + '</Email><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + result[0] + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + result[2] + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';
              ServiceCasamento.SendData(urlVar, xmlVar).then(function () {
                self.getConvidados();
              });

              count = 0;
              result = [];
            }
            else count++;
          }
        });
      };
      reader.readAsBinaryString(f);
    }
  }
  document.getElementById("xlf").addEventListener('change', handleFile, false);

  if (!UserService.dados.convidado_lista) {
    self.getConvidados();
  } else {
    self.convidado_lista = UserService.dados.convidado_lista;
    self.showConvidados = true;
  }
}]);