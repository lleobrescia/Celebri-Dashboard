(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CadastrarConvidadoController', CadastrarConvidadoController);

  CadastrarConvidadoController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', '$rootScope', 'toastr'];
  /**
   * @todo Selecionar mais de um convidado para excluir
   * @todo Subir lista atraves de uma planilha
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name CadastrarConvidadoController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Cadastra e exclui convidados.<br>
   * Pasta de origem : app/convidado <br>
   * State : cadastrarConvidados <br>
   * Controller As : convidados<br>
   * Template Url : app/convidado/cadastrar.html <br><br>
   * Usa o(s) serviço(s) do servidor:
   *  - CadastroConvidados {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/CadastroConvidados}
   *  - ExcluirConvidados  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/ExcluirConvidados}
   *  - RetornarConvidados {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConvidados}
   * @param {service} serverService        - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService     - usado para converter xml <-> json (conversor.service.js)
   * @param {service} ListManagerService   - gerencia listas. Passa um object de uma lista para outra (list.service.js)
   * @param {service} session              - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $rootScope           - scope geral
   * @param {service} toastr               - usado para mostrar mensagens ao usuario
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function CadastrarConvidadoController(serverService, conversorService, ListManagerService, session, $rootScope, toastr) {
    const ID = session.user.id; //Id do usuario logado. Usado para requisições

    var vm = this;

    vm.carregando = true; //Controla o loading
    vm.pessoas = []; //Lista de convidados cadastrados
    //Formato do servico CadastroConvidados do servidor
    vm.dados = {
      'Convidado': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'ConvidadoSomenteCerimonia': false,
        'ConviteEnviado': false,
        'Email': '',
        'Id': 0,
        'Id_usuario_logado': ID,
        'Nome': '',
        'Padrinho': false,
        'Qtde_Acompanhantes': 0,
        'SaveTheDateEnviado': false,
        'Senha': ''
      }
    };
    vm.enableEdition = false;

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Adicionar = Adicionar;
    vm.Editar = Editar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof CadastrarConvidadoController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function Adicionar
     * @desc Adiciona um convidado e chama GetDados, para pegar o id do novo adicionado
     * @memberof CadastrarConvidadoController
     */
    function Adicionar() {
      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('CadastroConvidados', dados).then(function (resp) {
        //Limpa os campos
        vm.dados.Convidado.Nome = '';
        vm.dados.Convidado.Email = '';
        vm.dados.Convidado.Id = 0;
        vm.dados.Convidado.Qtde_Acompanhantes = 0;

        if (vm.enableEdition) {
          toastr.success('Convidado Alterado');
        } else {
          toastr.success('Convidado Adicionado');
        }

        vm.enableEdition = false;

        /**
         * Depois de adicionar o convidado eh necessario busar as informações
         * do servidor novamente. Isso eh feito para pegar o id do novo convidado adicionado
         */
        GetDados();
      }).catch(function (error) {
        //Mostra mensagem de erro se houver algum erro ao conectar ao servidor
        console.error('CadastroConvidados -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function Editar(pessoa) {
      vm.dados.Convidado.Nome = pessoa.Nome;
      vm.dados.Convidado.Email = pessoa.Email;
      vm.dados.Convidado.Qtde_Acompanhantes = pessoa.Qtde_Acompanhantes;
      vm.dados.Convidado.Id = pessoa.Id;

      vm.enableEdition = true;
    }

    /**
     * @function Excluir
     * @param {int|string} id - Id do convidado para deletar
     * @desc Exclui o convidado
     * @memberof CadastrarConvidadoController
     */
    function Excluir(id) {
      vm.carregando = true;
      //Formato do servico ExcluirConvidados do servidor
      var item = {
        'ListaRegistrosExcluir': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Id_casal': ID,
          'Id_registro': {
            'int': [{
              '#text': id,
              '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays'
            }]
          }
        }
      };
      var dado = conversorService.Json2Xml(item, '');

      serverService.Request('ExcluirConvidados', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Convidado Excluido');
        GetDados();
      }).catch(function (error) {
        //Mostra mensagem de erro se houver algum erro ao conectar ao servidor
        console.error('ExcluirConvidados -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function GetDados
     * @desc Pega todos os convidados cadastrados do servidor
     * @memberof CadastrarConvidadoController
     */
    function GetDados() {
      vm.carregando = true;
      vm.pessoas = [];
      serverService.Get('RetornarConvidados', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
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
            vm.pessoas = resp.ArrayOfConvidado.Convidado;
          } else {
            vm.pessoas = resp.ArrayOfConvidado;
          }
        }

        vm.carregando = false;
        /**
         * Campos desnecessarios que aparecem quando faz a conversao de xml para json
         * Com eles na variavel eh possivel haver erro
         */
        delete vm.pessoas['@xmlns'];
        delete vm.pessoas['@xmlns:i'];
      }).catch(function (error) {
        //Mostra mensagem de erro se houver algum erro ao conectar ao servidor
        console.error('RetornarConvidados -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();