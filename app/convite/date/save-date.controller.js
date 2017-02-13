(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SaveDateController', SaveDateController);

  SaveDateController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr', '$rootScope'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name SaveDateController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Receber e enviar dados do casal ( nome do casal, data de casamento e foto ).<br>
   * Pasta de origem : app/convite/date <br>
   * State : savethedate <br>
   * Controller As : save<br>
   * Template Url : app/convite/date/save-date.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - FormatacaoSaveTheDate {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/FormatacaoSaveTheDate}
   *  - RetornarFormatacaoSaveTheDate {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarFormatacaoSaveTheDate}
   *  - EnvioEmailSaveTheDate {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/EnvioEmailSaveTheDate}
   *  - RetornarConvidados {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConvidados}
   * @param {service} serverService      - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService   - usado para converter xml <-> json (conversor.service.js)
   * @param {service} ListManagerService - gerencia listas. Passa um object de uma lista para outra (list.service.js)
   * @param {service} session            - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} toastr             - usado para mostrar mensagens ao usuario
   * @param {service} $rootScope         - scope geral
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function SaveDateController(serverService, conversorService, ListManagerService, session, toastr, $rootScope) {
    const ID = session.user.id; //id do usuario logado.Usado para fazer requisições

    var vm = this;

    vm.carregando = true; //Loading das configurações do save the date
    vm.carregandoLista = true; // Loading da lista de convidados para envio
    vm.convidados = []; //Lista de convidados
    //Dados para envio da configuração do save the date
    vm.dados = {
      'DadosFormatacaoSaveTheDate': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'ErrorMessage': '',
        'Result': 'true',
        'id_casal': ID,
        'id_modelo': '1',
        'msg': 'Pessoas especiais como você fazem parte deste momento! O dia ' + session.user.casal.dataCasamento + ' é muito importante para nós, o dia do nosso casamento, e gostaríamos de compartilhá-lo com você. Marque esta data no seu calendário para não se esquecer.  A sua presença é essencial! Em breve você receberá por email, o convite e mais informações do nosso casamento.',
        'nomecasal': session.user.casal.nomeNoiva + ' e ' + session.user.casal.nomeNoivo
      }
    };
    vm.erro = false; // Mostra msg de erro caso haja erro no envio de informações ao serviço de configuração
    vm.erroLista = false; // Mostra msg de erro caso haja erro no envio de informações ao serviço de convidados
    vm.ListManager = ListManagerService; // Atribiu o serviço ao escopo
    //Modelos do save the date
    vm.modelos = [{
        'id': '1',
        'image': 'modelo1.png'
      },
      {
        'id': '3',
        'image': 'modelo3.png'
      },
      {
        'id': '8',
        'image': 'modelo8.png'
      }
    ];
    vm.selecionados = []; //Lista de convidados selecionados para envio

    Activate();

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Enviar = Enviar;
    vm.Cancelar = GetDados;
    vm.IsThisSelected = IsThisSelected;
    vm.SelectImage = SelectImage;
    vm.SetDados = SetDados;

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof SaveDateController
     */
    function Activate() {
      GetDados();
      GetConvidados();
    }

    /**
     * @function Enviar
     * @desc Envia o save the date para a lista de convidados selecionados
     * @memberof SaveDateController
     */
    function Enviar() {
      vm.carregandoLista = true;

      var lista = {
        'ListaEmailConvidados': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Id_casal': ID,
          'Id_convidado': {
            'int': []
          }
        }
      };
      var xml = null;

      angular.forEach(vm.selecionados, function (selecionado) {
        lista.ListaEmailConvidados.Id_convidado.int.push({
          '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
          '#text': selecionado.Id
        });
      });
      xml = conversorService.Json2Xml(lista, '');

      serverService.Request('EnvioEmailSaveTheDate', xml).then(function (resp) {
        toastr.success('Save the Date Enviado!');
        GetConvidados();
      });
    }

    /**
     * @function GetConvidados
     * @desc Pega a lista de convidados do servidor
     * @memberof SaveDateController
     */
    function GetConvidados() {
      vm.convidados = [];
      vm.selecionados = [];

      serverService.Get('RetornarConvidados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConvidado.Convidado) {
          if (resp.ArrayOfConvidado.Convidado.length > 1) {
            vm.convidados = resp.ArrayOfConvidado.Convidado;
          } else {
            vm.convidados.push(resp.ArrayOfConvidado.Convidado);
          }
        }

        delete vm.convidados['@xmlns'];
        delete vm.convidados['@xmlns:i'];

        vm.carregandoLista = false;
      }).catch(function (error) {
        console.error('RetornarConvidados -> ', error);
        vm.carregandoLista = false;
        vm.erroLista = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function GetDados
     * @desc Pega a configuração do save the date salva no servidor
     * @memberof SaveDateController
     */
    function GetDados() {
      vm.carregando = true;
      serverService.Get('RetornarFormatacaoSaveTheDate', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.DadosFormatacaoSaveTheDate.id_modelo != '0') {
          vm.dados.DadosFormatacaoSaveTheDate.id_modelo = resp.DadosFormatacaoSaveTheDate.id_modelo;
          vm.dados.DadosFormatacaoSaveTheDate.msg = resp.DadosFormatacaoSaveTheDate.msg;
          SelectImage(vm.dados.DadosFormatacaoSaveTheDate.id_modelo); //marca no layout o modelo selecionado
        }
        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarFormatacaoSaveTheDate -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function IsThisSelected
     * @desc Verifica se o modelo ja foi selecionado para atribuir uma classe a ele
     * Eh usado para marcar o checkbox
     * @param {string} id - id do modelo
     * @return {boolean}
     * @memberof SaveDateController
     */
    function IsThisSelected(id) {
      return (vm.dados.DadosFormatacaoSaveTheDate.id_modelo == id);
    }

    /**
     * @function SelectImage
     * @desc Seleciona o modelo do save the date
     * @param {string} id - id do modelo
     * @memberof SaveDateController
     */
    function SelectImage(id) {
      vm.dados.DadosFormatacaoSaveTheDate.id_modelo = id;
    }

    /**
     * @function SetDados
     * @desc Salva a configuração do save the date
     * @memberof SaveDateController
     */
    function SetDados() {
      vm.dados.DadosFormatacaoSaveTheDate.Result = 'true'; //precisa disso para nao dar erro
      //Eh preciso enviar o nome do casal
      vm.dados.DadosFormatacaoSaveTheDate.nomecasal = session.user.casal.nomeNoiva + ' e ' + session.user.casal.nomeNoivo;
      var dados = conversorService.Json2Xml(vm.dados, '');

      serverService.Request('FormatacaoSaveTheDate', dados).then(function (resp) {
        toastr.success('Alterações Salvas!');
      });
    }
  }
})();