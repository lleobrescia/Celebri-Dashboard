(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CardapioCtrl', CardapioCtrl);

  CardapioCtrl.$inject = ['ServiceCasamento', 'ipService', 'UserService', 'PageService', '$mdToast', '$document'];
  function CardapioCtrl(ServiceCasamento, ipService, UserService, PageService, $mdToast, $document) {
    var self = this;
    var ID   = UserService.dados.ID;

    self.cardapioLista  = [];
    self.carregando     = true;
    self.descricao      = '';
    self.titulo         = '';

    self.Adicionar = Adicionar;
    self.Remover   = Remover;
    self.ResetForm = ResetForm;

    Init();

  /**
   * @name Adicionar
   * @desc Envia os dados do cardapio para o servidor
   * @memberOf Controllers.CardapioCtrl
   */
    function Adicionar() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/CadastrarCardapio';
      var xmlVar = '<Cardapio xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Descricao>' + self.descricao + '</Descricao><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.titulo + '</Nome></Cardapio>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo cardapio eh gerado no servico.
         */
        GetCardapio();

        Toast('Cardápio Adicionado', 'Visualizar');

      }).catch(function (error) {
        console.error('SetCardapio -> ', error);
      });
    }

 /**
   * @name GetCardapio
   * @desc Pega os dados do cardapio do servidor
   * @memberOf Controllers.CardapioCtrl
   */
    function GetCardapio() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarCardapio';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      self.carregando = true;

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.cardapioLista = [];
        $(respXml).find('Cardapio').each(function () {

          self.cardapioLista.push(
            {
              'Id'        : $(this).find('Id').text(),
              'Nome'      : $(this).find('Nome').text(),
              'Descricao' : $(this).find('Descricao').text()
            }
          );
        });

        self.carregando = false;

        //Salva local
        UserService.dados.listaCardapio = self.cardapioLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetListaCardapio -> ', error);
      });
    }

    function Init() {
      //Set Title 
      PageService.SetTitle('Cardápio');

      if (UserService.dados.listaCardapio !== null) {
        self.cardapioLista = UserService.dados.listaCardapio;
        self.carregando = false;
      } else {
        GetCardapio();
      }
    }

  /**
   * @name Remover
   * @desc Remove os dados do cardapio fornecido
   * @memberOf Controllers.CardapioCtrl
   */
    function Remover(dataId, key) {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirCardapio';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      self.cardapioLista.splice(key, 1);
      Toast('Cardápio Removido', 'x');

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {

        UserService.dados.listaCardapio = self.cardapioLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverCardapio -> ', error);
      });
    }

    function ResetForm(form){
      //limpa dos dados do formulario
      self.descricao = '';
      self.titulo = '';

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
          var someElement = angular.element(document.getElementById('Lista_Cardapio'));
          $document.scrollToElement(someElement, 0, 1000);
        }
      });
    }
  }
})();