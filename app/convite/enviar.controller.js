(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EnviarConviteController', EnviarConviteController);

  EnviarConviteController.inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name EnviarConviteController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Envia o convite para os convidados selecionados.<br>
   * Pasta de origem : app/convite <br>
   * State : enviarConvite <br>
   * Controller As : enviar <br>
   * Template Url : app/convite/enviar.html <br><br>
   * Usa o(s) serviço(s) do servidor:
   *  - EnvioEmailConvite {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/EnvioEmailConvite}
   *  - RetornarConvidados {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConvidados}
   * @param {service} serverService       - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService    - usado para converter xml <-> json (conversor.service.js)
   * @param {service} ListManagerService  - gerencia listas. Passa um object de uma lista para outra (list.service.js)
   * @param {service} session             - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} toastr              - usado para mostrar mensagens ao usuario
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function EnviarConviteController(serverService, conversorService, ListManagerService, session, toastr) {
    const ID = session.user.id; //Id do usuario logado. Usado para fazer requisições
    var vm = this;

    vm.carregando = true; //Controla o loading
    vm.convidados = []; // Lista de convidados cadastrados
    vm.erro = false; // Mostra msg de erro, caso haja erro ao conectar ao servidor
    vm.ListManager = ListManagerService; // Atribuindo serviço ao escopo
    vm.selecionados = []; //Convidados selecionados para envio do convite

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Enviar = Enviar;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof EnviarConviteController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function Enviar
     * @desc Pega os ids dos convidados da lista selecionados e envia para o servidor para enviar o convite
     * @memberof EnviarConviteController
     */
    function Enviar() {
      vm.carregando = true; //Ativa o loading
      //Formato de envio para o servidor
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

      //Passa por toda a lista de convidados selecionados e pega o id de cada um
      angular.forEach(vm.selecionados, function (selecionado) {
        lista.ListaEmailConvidados.Id_convidado.int.push({
          '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
          '#text': selecionado.Id
        });
      });
      xml = conversorService.Json2Xml(lista, ''); //Converte o json para xml

      serverService.Request('EnvioEmailConvite', xml).then(function (resp) {
        vm.carregando = false;
        toastr.success('Convite Enviado!');
        /**
         * Eh preciso pegar todos os convidados novamente para pegar o status de envio
         * que provavelmente deve ter mudado depois do envio.
         * Isso tambem limpa a lista de selecionados.
         */
        GetDados();
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('RetornarFormatacaoSaveTheDate -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Não foi possível enviar os convites', 'Erro');
      });
    }

    /**
     * @function GetDados
     * @desc Pega a lista de convidados do servidor
     * @memberof EnviarConviteController
     */
    function GetDados() {
      vm.carregando = true; //Ativa o loading
      vm.convidados = []; //Limpa a lisa de convidados. Para prevenir erro
      vm.selecionados = []; //Limpa a lisa de convidados selecionados. Para prevenir erro

      serverService.Get('RetornarConvidados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        /**
         * Se nao houver convidados cadastrados a variavel resp.ArrayOfConvidado.Convidado
         * eh undefined. Por isso eh preciso verificar se existe.
         */
        if (resp.ArrayOfConvidado.Convidado) {
          /**
           * Se houver apenas um convidado, o servico conversorService nao gera um array
           * portanto a variavel Convidado dentro de resp.ArrayOfConvidado não ira existir
           */
          if (resp.ArrayOfConvidado.Convidado.length > 1) {
            vm.convidados = resp.ArrayOfConvidado.Convidado;
          } else {
            vm.convidados.push(resp.ArrayOfConvidado.Convidado);
          }
        }

        vm.carregando = false;

        /**
         * Depois da conversao esses campos sao criados
         * e gera erro quando faz a reversao da conversao.
         * Por isso eh preciso deletar
         */
        delete vm.convidados['@xmlns'];
        delete vm.convidados['@xmlns:i'];
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('RetornarConvidados -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();