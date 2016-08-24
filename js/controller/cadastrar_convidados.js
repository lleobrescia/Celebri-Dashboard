/**
 * Configurar Cadastrar Convidados Controller
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('CadastrarConvidadosCtrl', CadastrarConvidadosCtrl);

  CadastrarConvidadosCtrl.$inject = ['ServiceCasamento', 'UserService', 'ipService'];
    /**
   * @namespace CadastrarConvidadosCtrl
   * @desc Controla o cadastramento de convidados
   * @memberOf Controllers
   */
  function CadastrarConvidadosCtrl(ServiceCasamento, UserService, ipService) {
    var self  = this;
    var ID    = UserService.dados.ID;

    self.showConvidados         = false;
    self.convidadoAcompanhantes = '0';

    //Adiciona as funcoes ao escopo
    self.RemoverConvidado   = RemoverConvidado;
    self.AdicionarConvidado = AdicionarConvidado;

    Init();

    /**
     * @name AdicionarConvidado
     * @desc Adiciona o convidados a lista de convidados e envia os dados ao servidor
     * @memberOf Controllers.CadastrarConvidadosCtrl
     */
    function AdicionarConvidado() {
      if (self.convidadoNome && self.convidadoEmail) {
        self.showConvidados = false;

        var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/CadastroConvidados';
        var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + self.convidadoEmail + '</Email><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.convidadoNome + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + self.convidadoAcompanhantes + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';

        ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
          GetConvidados();

          self.convidadoNome          = '';
          self.convidadoAcompanhantes = '0';
          self.convidadoEmail         = '';
        }).catch(function (error) {
          console.error('AdicionarConvidado -> ', error);
          console.warn('Dados enviados:', xmlVar);
        });
      }
    }

    /**
     * @name HandleFile
     * @desc Lida com planilhas de excel. Pega os dados dos convidados e armazena no servidor
     * @memberOf Controllers.CadastrarConvidadosCtrl
     */
    function HandleFile(e) {
      var files = e.target.files;
      var i, f;

      for (i = 0, f = files[i]; i !== files.length; ++i) {
        var reader  = new FileReader();
        var name    = f.name;

        reader.onload = function (e) {
          var data          = e.target.result;
          var workbook      = XLSX.read(data, { type: 'binary' });
          var sheetNameList = workbook.SheetNames;

          sheetNameList.forEach(function (y) { /* iterate through sheets */
            var worksheet = workbook.Sheets[y];
            var count     = 0;
            var result    = [];

            for (z in worksheet) {

              /* all keys that do not begin with '!' correspond to cell addresses */
              if (z[0] === '!') continue;
              result[count] = worksheet[z].v;

              if (count === 2) {
                self.showConvidados = false;

                var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/CadastroConvidados';
                var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + result[1] + '</Email><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + result[0] + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + result[2] + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';

                ServiceCasamento.SendData(urlVar, xmlVar).then(function () {
                  GetConvidados();
                });

                count   = 0;
                result  = [];
              }
              else count++;
            }
          });
        };
        reader.readAsBinaryString(f);
      }
    }

    /**
     * @name Init
     * @desc Setup do controlador
     * @memberOf Controllers.CadastrarConvidadosCtrl
     */
    function Init() {
      document.getElementById('xlf').addEventListener('change', HandleFile, false);

      //Verifica se ja existe a lista armazenada localmente
      if (!UserService.dados.convidadoLista) {
        GetConvidados();
      } else {
        self.convidadoLista = UserService.dados.convidadoLista;
        self.showConvidados = true;
      }
    }

    /**
     * @name GetConvidados
     * @desc Pega os convidados do servidor
     * @memberOf Controllers.CadastrarConvidadosCtrl
     */
    function GetConvidados() {
      self.showConvidados = false;

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConvidados';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);

        self.convidadoLista = [];

        $(respXml).find('Convidado').each(function () {
          self.convidadoLista.push(
            {
              'Id'        : $(this).find('Id').text(),
              'nome'      : $(this).find('Nome').text(),
              'email'     : $(this).find('Email').text(),
              'convidados': $(this).find('Qtde_Acompanhantes').text()
            }
          );
        });

        self.showConvidados               = true;
        UserService.dados.convidadoLista  = self.convidadoLista; //Armazena a lista localmente

        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetConvidados -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

    /**
     * @name RemoverConvidado
     * @desc Remove o convidado da lista e apaga os dados do servidor
     * @memberOf Controllers.CadastrarConvidadosCtrl
     */
    function RemoverConvidado(dataId, key) {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirConvidados';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      self.convidadoLista.splice(key, 1);

      UserService.dados.convidadoLista = self.convidadoLista;
      UserService.SaveState();

      ServiceCasamento.SendData(urlVar, xmlVar).catch(function (error) {
        console.error('RemoverConvidado -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }
  }
} ());