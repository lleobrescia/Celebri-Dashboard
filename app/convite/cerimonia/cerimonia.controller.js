/**
 * CerimoniaController
 * @author Leo Brescia <leonardo@leobrescia.com.br>
 * Gerencia os dados da pagina da cerimonia( cerimonia.html)
 * Utiliza o seguintes serviços do servidor:
 *  - RetornarConfiguracaoConvite
 *  - ConfiguracaoConvite
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CerimoniaController', CerimoniaController);

  /**
   * serverService - usado para comunicar com o servidor (server.service.js)
   * conversorService - usado para converter xml <-> json (conversor.service.js)
   * session - usado para armazenar e buscar dados no session (session.service.js)
   * toastr - usado para mostrar mensagens ao usuario
   * consultCEP - servico para consulta de cep (checkCep.service.js)
   */
  CerimoniaController.$inject = ['serverService', 'conversorService', 'session', 'toastr', 'consultCEP'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name CerimoniaController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Recebe, do usuario, dados basicos para a criação do convite.<br>
   * Pasta de origem : app/convite/cerimonia <br>
   * State : cerimonia <br>
   * Controller As : cerimonia <br>
   * Template Url : app/convite/cerimonia/cerimonia.html <br><br>
   * Usa o(s) serviço(s) do servidor:
   *  - RetornarConfiguracaoConvite {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConfiguracaoConvite}
   *  - ConfiguracaoConvite {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ConfiguracaoConvite}
   * @param {service} serverService    - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService - usado para converter xml <-> json (conversor.service.js)
   * @param {service} session          - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} toastr           - usado para mostrar mensagens ao usuario
   * @param {service} consultCEP       - serviço para consultar cep
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function CerimoniaController(serverService, conversorService, session, toastr, consultCEP) {
    const ID = session.user.id; //Id do usuario logado.Usado para fazer requisições
    var vm = this;

    vm.carregando = true;
    //Formato do servico ConfiguracaoConvite do servidor
    vm.dados = {
      'ConfiguracaoConvite': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'Bairro': '',
        'Cep': '',
        'Cidade': '',
        'Endereco': '',
        'Estado': '',
        'Horario_cerimonia': '',
        'Id_usuario_logado': ID,
        'Local_cerimonia': '',
        'Mae_noiva': '',
        'Mae_noiva_in_memoriam': 'false',
        'Mae_noivo': '',
        'Mae_noivo_in_memoriam': 'false',
        'Msg1': 'null',
        'Msg2': 'null',
        'Msg3': 'null',
        'Msg4': 'null',
        'Msg5': 'null',
        'Msg6': 'null',
        'Numero': '',
        'Obs': 'null',
        'Pai_noiva': '',
        'Pai_noiva_in_memoriam': 'false',
        'Pai_noivo': '',
        'Pai_noivo_in_memoriam': 'false',
        'Pais': 'null',
        'TemplateConviteApp': '0',
        'Tracar_rota_local': 'true'
      }
    };
    vm.erro = false;
    //Controla o genero de algumas palavras do formulario
    vm.genero = {
      'noiva': session.user.casal.generoNoiva,
      'noivo': session.user.casal.generoNoivo
    };
    /**
     * O formato enviado para o servidor eh 12:00 por ex.
     * Mas no formulario a hora e os min sao separados.
     * Por isso eles estao fora do vm.dados
     * Antes de enviar eles sao agrupados dentro de vm.dados
     */
    vm.hora = '';
    vm.min = '';

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Cancelar = GetDados;
    vm.ConsultCEP = ConsultCEP;
    vm.Salvar = SetDados;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof CerimoniaController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function ConsultCEP
     * @desc Usa o serviço consultCEP para consultar o cep e preenche o formulario com a resposta
     * @memberof CerimoniaController
     */
    function ConsultCEP() {
      consultCEP.consultar(vm.dados.ConfiguracaoConvite.Cep).then(function (resp) {
        vm.dados.ConfiguracaoConvite.Endereco = resp.logradouro;
        vm.dados.ConfiguracaoConvite.Bairro = resp.bairro;
        vm.dados.ConfiguracaoConvite.Cidade = resp.cidade;
        vm.dados.ConfiguracaoConvite.Estado = resp.estado;
      });
    }

    /**
     * @function GetDados
     * @desc Pega os dados salvos no servidor
     * @memberof CerimoniaController
     */
    function GetDados() {
      vm.carregando = true;

      serverService.Get('RetornarConfiguracaoConvite', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        /**
         * Se for o primeiro acesso ou se não houver dados salvos nao sera possivel usar o 
         * split.Se esse eh o caso não ha nada para pegar do servidor.
         */
        try {
          var horario = resp.ConfiguracaoConvite.Horario_cerimonia.split(":");
          resp.ConfiguracaoConvite.Tracar_rota_local = 'true'; //força o traçar rota para true
          vm.dados = resp;
          vm.hora = horario[0];
          vm.min = horario[1];
        } catch (error) {}

        //Salva no session para ser usado na configuração do convite
        session.user.cerimonia = vm.dados;
        session.SaveState();

        vm.carregando = false;
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('RetornarConfiguracaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function SetDados
     * @desc Salva os dados do formulario no servidor
     * @memberof CerimoniaController
     */
    function SetDados() {
      vm.carregando = true;
      //Junta a hora e os min no formato HH:MM
      vm.dados.ConfiguracaoConvite.Horario_cerimonia = vm.hora + ':' + vm.min;
      var dados = conversorService.Json2Xml(vm.dados, '');

      //Salva as alterações no session para ser usado na configuração de convite
      session.user.cerimonia = vm.dados;
      session.SaveState();

      serverService.Request('ConfiguracaoConvite', dados).then(function (resp) {
        vm.carregando = false;
        toastr.success('Alterações Salvas!');
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('RetornarConfiguracaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();