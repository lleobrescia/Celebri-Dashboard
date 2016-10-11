(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DicasHotelCtrl', DicasHotelCtrl);

  DicasHotelCtrl.$inject = ['ServiceCasamento', 'ipService', 'UserService', 'PageService', 'consultCEP', '$mdToast', '$document'];
  function DicasHotelCtrl(ServiceCasamento, ipService, UserService, PageService, consultCEP, $mdToast, $document) {
    var self = this;
    var ID = UserService.dados.ID;

    self.bairro     = '';
    self.carregando = true;
    self.cep        = '';
    self.cidade     = '';
    self.email      = '';
    self.end        = '';
    self.hotelLista = [];
    self.local      = '';
    self.numero     = '';
    self.rota       = 'false';
    self.site       = '';
    self.telefone   = '';
    self.uf         = '';

    self.Adicionar  = Adicionar;
    self.ConsultCEP = ConsultCEP;
    self.Remover    = Remover;
    self.ResetForm  = ResetForm;

    Init();

  /**
   * @name Adicionar
   * @desc Adiciona um hotel a lista e envia os dados para o servidor
   * @memberOf Controllers.DicasHotelCtrl
   */
    function Adicionar() {
      var rota = true;

      if (self.rota === 'false') {
        rota = false;
      }

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfigAdicionalEvento_ListaHoteis';

      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.bairro + '</Bairro><Cidade>' + self.cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + self.email + '</Email><Endereco>' + self.end + '</Endereco><Estado>' + self.uf + '</Estado><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.local + '</Nome><Numero>' + self.numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + self.site + '</Site><Telefone>' + self.telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {

        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo hotel eh gerado no servico.
         */
        GetHoteis();

        Toast('Hotel Adicionado', 'Visualizar');

      }).catch(function (error) {
        console.error('AdicionarHotel -> ', error);
      });
    }

  /**
   * @name ConsultCEPHotel
   * @desc Consulta o CEP do hotel e armazena os dados
   * @memberOf Controllers.DicasHotelCtrl
   */
    function ConsultCEP(cep) {
      try {
        consultCEP.consultar(cep).then(function (data) {
          self.end    = data.logradouro;
          self.bairro = data.bairro;
          self.cidade = data.cidade;
          self.uf     = data.estado;
        });
      } catch (error) {
        console.warn('Erro ao consultar CEP:' + error);
      }
    }

  /**
   * @name GetHoteis
   * @desc Pega os hoteis no servidor
   * @memberOf Controllers.DicasHotelCtrl
   */
    function GetHoteis() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoListaHoteis';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      self.carregando = true;

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.hotelLista = [];

        $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {
          self.hotelLista.push(
            {
              'Id'      : $(this).find('Id').text(),
              'Local'   : $(this).find('Nome').text(),
              'Bairro'  : $(this).find('Bairro').text(),
              'Estado'  : $(this).find('Estado').text(),
              'Cidade'  : $(this).find('Cidade').text(),
              'Email'   : $(this).find('Email').text(),
              'Endereco': $(this).find('Endereco').text(),
              'Numero'  : $(this).find('Numero').text(),
              'Telefone': $(this).find('Telefone').text(),
              'Site'    : $(this).find('Site').text()
            }
          );
        });

        self.carregando = false;

        UserService.dados.listaHotel  = self.hotelLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetHoteis -> ', error);
      });
    }

    function Init() {
      //Set Title 
      PageService.SetTitle('Dicas de Hotél');

      if (UserService.dados.listaHotel !== null) {
        self.hotelLista = UserService.dados.listaHotel;
        self.carregando = false;
      } else {
        GetHoteis();
      }
    }

  /**
   * @name Remover
   * @desc Remove o hotel fornecido
   * @memberOf Controllers.DicasHotelCtrl
   */
    function Remover(dataId, key) {
      Toast('Hotel ' + self.hotelLista[key].Local + ' Removido','x');
      self.hotelLista.splice(key, 1);
      
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirHoteis';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function () {
        UserService.dados.listaHotel = self.hotelLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverHotel -> ', error);
      });
    }

    function ResetForm(form){
      //limpa dos dados do formulario
      self.bairro   = null;
      self.cep      = null;
      self.cidade   = null;
      self.email    = null;
      self.end      = null;
      self.local    = null;
      self.numero   = null;
      self.rota     = 'false';
      self.site     = null;
      self.telefone = null;
      self.uf       = null;

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
          var someElement = angular.element(document.getElementById('Lista_Hotel'));
          $document.scrollToElement(someElement, 0, 1000);
        }
      });
    }
  }
})();