(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ListaPresentesCtrl', ListaPresentesCtrl);

  ListaPresentesCtrl.$inject = ['ServiceCasamento', 'ipService', 'UserService', 'PageService', '$mdToast', '$document'];
  function ListaPresentesCtrl(ServiceCasamento, ipService, UserService, PageService, $mdToast, $document) {
    var self = this;
    var ID = UserService.dados.ID;

    self.nome       = '';
    self.lojaLista  = [];
    self.url        = '';

    self.Adicionar  = Adicionar;
    self.Remover    = Remover;
    self.ResetForm  = ResetForm;

    Init();
  /**
   * @name AdicionarUrl
   * @desc Adiciona uma url da lista de casamento e envia os dados para o servidor
   * @memberOf Controllers.ListaPresentesCtrl
   */
    function Adicionar() {
      self.showPresente = false;
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfigAdicionalEvento_LojaPresentes';
      var xmlVar = '<ConfiguracaoLojaPresentes xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.nome + '</Nome><Url>' + self.url + '</Url></ConfiguracaoLojaPresentes>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo presente eh gerado no servico.
         */
        GetPresentes();

        Toast('Loja Adicionada', 'Visualizar');

        //limpa so dados do formulario
        self.nome    = '';
        self.url     = '';

        self.showPresente = true;
      }).catch(function (error) {
        console.error('AdicionarUrl -> ', error);
      });
    }

  /**
   * @name GetPresentes
   * @desc Pega os urls das listas de presentes do servidor
   * @memberOf Controllers.ListaPresentesCtrl
   */
    function GetPresentes() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoLojaPresentes';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.lojaLista = [];

        $(respXml).find('ConfiguracaoLojaPresentes').each(function () {
          self.lojaLista.push(
            {
              'Id'  : $(this).find('Id').text(),
              'Nome': $(this).find('Nome').text(),
              'Url' : $(this).find('Url').text()
            }
          );
        });

        UserService.dados.listaPresente = self.lojaLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetPresentes -> ', error);
      });
    }

    function Init() {
      //Set Title 
      PageService.SetTitle('Lista de Presentes');

      if (UserService.dados.listaPresente != null) {
        self.lojaLista = UserService.dados.listaPresente;
      } else {
        GetPresentes();
      }
    }

  /**
   * @name RemoverUrl
   * @desc Remove o url fornecido
   * @memberOf Controllers.ListaPresentesCtrl
   */
    function Remover(dataId, key) {
      Toast('Loja ' + self.lojaLista[key].Nome + ' Removida','x');
      self.lojaLista.splice(key, 1);
      
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirLojasPresentes';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        //atualiza localmente
        UserService.dados.listaPresente = self.lojaLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverUrl -> ', error);
      });
    }

    function ResetForm(form){
      //limpa dos dados do formulario
      self.nome       = '';
      self.url        = '';

      form.$setUntouched();
    }

  /**
   * @name Toast
   * @desc Faz aparecer uma mensagem para o usuario
   * @memberOf Controllers.DicasHotelCtrl
   */
    function Toast(text, action) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(3000)
          .action(action)
      ).then(function (response) {
        if (response === 'ok' && action !== 'x') {
          var someElement = angular.element(document.getElementById('Lista_Loja'));
          $document.scrollToElement(someElement, 0, 1000);
        }
      });
    }
  }
})();