angular.module("dashboard").controller('cadastrar_convidados', ['$scope', 'Convidados', 'user', '$cookies', function ($scope, Convidados, user, $cookies) {

  var self = this;

  self.setCookie = function () {
    user.lista_convidados = $scope.convidado_lista;
    $cookies.putObject('user', user);
  };

  $scope.getConvidados = function () {

    if (user.id == null) {
      user = $cookies.getObject('user');
    }

    Convidados.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.convidado_lista = [];

      $(respXml).find('Convidado').each(function () {
        $scope.convidado_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'nome': $(this).find('Nome').text(),
            'email': $(this).find('Email').text(),
            'convidados': $(this).find('Qtde_Acompanhantes').text(),
            'telefone': $(this).find('Bairro').text()
          }
        );
      });
      self.setCookie();
    });
  };

  $scope.removeConvidado = function (id, key) {
    Convidados.remove(user.id, id).then(function () {
      $scope.convidado_lista.splice(key, 1);
      self.setCookie();
    });
  };

  $scope.adicionarConvidado = function () {
    if ($scope.convidado_nome != "" && $scope.convidado_nome != null) {
      var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + $scope.convidado_email + '</Email><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + $scope.convidado_nome + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + $scope.convidado_acompanhantes + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';

      Convidados.setData(xmlVar).then(function (resp) {
        $scope.getConvidados();
        $scope.convidado_nome = "";
        $scope.convidado_acompanhantes = "";
        $scope.convidado_email = "";
        $scope.convidado_telefone = "";

        $scope.getConvidados();
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
              var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + result[1] + '</Email><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + result[0] + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + result[2] + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';
              Convidados.setData(xmlVar).then(function (resp) {
                $scope.getConvidados();
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
  };
  document.getElementById("xlf").addEventListener('change', handleFile, false);

  user = $cookies.getObject('user');

  if (user.lista_convidados == null || user.lista_convidados == '') {
    $scope.getConvidados();
  } else {
    $scope.convidado_lista = user.lista_convidados;
  }

}]);