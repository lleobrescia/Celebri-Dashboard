(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DicasSalaoCtrl', DicasSalaoCtrl);

  DicasSalaoCtrl.$inject = ['ServiceCasamento', 'ipService', 'UserService', 'PageService', 'consultCEP', '$mdToast', '$document'];
  function DicasSalaoCtrl(ServiceCasamento, ipService, UserService, PageService, consultCEP, $mdToast, $document) {
    var self = this;
    var ID = UserService.dados.ID;
    
    self.bairro     = '';
    self.carregando = true;
    self.cep        = '';
    self.cidade     = '';
    self.email      = '';
    self.end        = '';
    self.salaoLista = [];
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
   * @name AdicionarSalao
   * @desc Adiciona um salao a lista e envia os dados para o servidor
   * @memberOf Controllers.DicasSalaoCtrl
   */
    function Adicionar() {
      var rota = true;

      if (self.rota === 'nao') {
        rota = false;
      }

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfigAdicionalEvento_ListaSaloes';
      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.bairro + '</Bairro><Cidade>' + self.cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + self.email + '</Email><Endereco>' + self.end + '</Endereco><Estado>' + self.uf + '</Estado><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.local + '</Nome><Numero>' + self.numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + self.site + '</Site><Telefone>' + self.telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      /**
       * Eh necessario puxar o conteudo do servico novamente
       * pq o ID do novo salao eh gerado no servico.
       */
      GetSaloes();
      Toast('Salão Adicionado', 'Visualizar');

      }).catch(function (error) {
        console.error('AdicionarSalao -> ', error);
      });
    }

  /**
   * @name ConsultCEP
   * @desc Consulta o CEP do salao e armazena os dados
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
   * @name GetSaloes
   * @desc Pega os saloes do servidor
   * @memberOf Controllers.DicasSalaoCtrl
   */
    function GetSaloes() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoListaSaloes';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      self.carregando = true;

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.salaoLista = [];
        $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {

          self.salaoLista.push(
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

        //armazena localmente
        UserService.dados.listaSalao  = self.salaoLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetSaloes -> ', error);
      });
    }

    function Init() {
      //Set Title 
      PageService.SetTitle('Dicas de Salão de Beleza');

      if (UserService.dados.listaSalao !== null) {
        self.salaoLista = UserService.dados.listaSalao;
        self.carregando = false;
      } else {
        GetSaloes();
      }
    }

  /**
   * @name Remover
   * @desc Remove o salao fornecido
   * @memberOf Controllers.DicasSalaoCtrl
   */
    function Remover(dataId, key) {
      Toast('Salão ' + self.salaoLista[key].Local + ' Removido','x');
      self.salaoLista.splice(key, 1);

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirSaloes';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        //atualiza localmente
        UserService.dados.listaSalao = self.salaoLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverSalao -> ', error);
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
          var someElement = angular.element(document.getElementById('Lista_Salao'));
          $document.scrollToElement(someElement, 0, 1000);
        }
      });
    }
  }
})(); 
