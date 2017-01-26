(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CasalController', CasalController);
  /** @desc injetor dos serviços */
  CasalController.$inject = ['serverService', 'conversorService', 'session', '$filter', 'toastr', 'EnviarFoto', '$scope', '$rootScope'];
  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name CasalController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Receber e enviar dados do casal ( nome do casal, data de casamento e foto ).<br>
   * Pasta de origem : app/casal <br>
   * State : casal <br>
   * Controller As : casal<br>
   * Template Url : app/casal/casal.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - AtualizarDadosCadastroNoivos {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/AtualizarDadosCadastroNoivos}
   *
   * @param {service} serverService    - usado para comunicar com o servidor {@link dashboard.serverService}
   * @param {service} conversorService - usado para converter xml <-> json {@link dashboard.conversorService}
   * @param {service} session          - usado para armazenar e buscar dados no session {@link dashboard.session}
   * @param {service} $filter          - usado para formatar a data de casamento
   * @param {service} toastr           - usado para mostrar mensagens ao usuario
   * @param {service} EnviarFoto       - envia a foto do casal para o servidor {@link dashboard.EnviarFoto}
   * @param {service} $scope           - usado para colocar um listen no input[file] que vai receber a foto do casal
   * @param {service} $rootScope       - scope geral
   *
   * @property {int} ID                 - id do usuario logado.Usado para fazer requisições `const`
   * @property {object} vm              - A named variable for the `this` keyword representing the ViewModel
   * @property {boolean} vm.carregando  - Controla o loading
   * @property {json} vm.dados          - Formatação dos dados a serem enviados ao servidor. Veja o serviço AtualizarDadosCadastroNoivos
   *
   * @property {int} vm.dados.Casal.Id_casal            - id do casal
   * @property {boolean} vm.dados.Casal.AtualizarSenha  - indentifica se a senha esta sendo trocada. <strong> Não Alterar </strong>
   * @property {string} vm.dados.Casal.DataCasamento    - data do casamento
   * @property {string} vm.dados.Casal.NomeNoiva        - nome da noiva
   * @property {string} vm.dados.Casal.NomeNoivo        - nome do noivo
   * @property {string} vm.dados.Casal.Senha            - senha do casal. So deve preencher se estiver alterando. <strong> Não Alterar </strong>
   *
   * @property {date} vm.dateMin         - Data minima para mostrar no datepicker
   * @property {boolean} vm.erro         - Mostra msg de erro quando nao conecta com o servidor
   * @property {boolean} vm.fotoEditor   - Controla o display do popup para recortar a foto
   * @property {json} vm.genero          - Controla o genero de algumas palavras, baseado no genero dos noivos
   * @property {string} vm.imageEditor   - Armazena a imagem do casal
   * @property {json} vm.selected        - Configuração do editor de imagem
   * @property {int} vm.selected.width  - Largura inicial da area de corte
   * @property {int} vm.selected.height - Altura inicial da area de corte
   * @property {int} vm.selected.top    - Posição inicial vertical em relação ao topo da area de corte
   * @property {int} vm.selected.left   - Posição inicial horizontal em relação ao topo da area de corte
   *
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function CasalController(serverService, conversorService, session, $filter, toastr, EnviarFoto, $scope, $rootScope) {
    const ID = session.user.id;
    var vm = this;

    vm.carregando = false;
    vm.dados = {
      'Casal': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Id_casal': 2147483647,
        'AtualizarSenha': false,
        'DataCasamento': '',
        'NomeNoiva': session.user.casal.nomeNoiva,
        'NomeNoivo': session.user.casal.nomeNoivo,
        'Senha': ''
      }
    };
    vm.dateMin = new Date();
    vm.erro = false;
    vm.fotoEditor = false;
    vm.genero = {
      'noiva': session.user.casal.generoNoiva,
      'noivo': session.user.casal.generoNoivo
    };
    vm.imageEditor = '';
    vm.selected = {
      width: 50,
      height: 50,
      top: 0,
      left: 0
    };

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Cancelar = ResetDados;
    vm.Salvar = Salvar;
    vm.UploadFoto = UploadFoto;

    $scope.OpenFile = OpenFile;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof CasalController
     */
    function Activate() {
      ResetDados();
    }

    /**
     * @function OpenFile
     * @desc Executa quando uma nova foto eh selecionada. Ativa o recorte para o usuario recortar
     * @memberof CasalController
     */
    function OpenFile(elem) {
      vm.carregando = true;
      var reader = new FileReader();

      reader.onload = function () {
        var dataURL = reader.result;
        vm.fotoEditor = dataURL;
        vm.carregando = false;
        vm.editar = true;

        // Configura os valores para a area de corte inicial
        vm.selected.width = 200;
        vm.selected.height = 200;
        vm.selected.left = 0;
        vm.selected.top = 0;
      };
      reader.readAsDataURL(elem.files[0]);
    }

    /**
     * @function ResetDados
     * @desc Desfaz as modificações, não salvas, do usuario
     * @memberof CasalController
     */
    function ResetDados() {
      var casamento = session.user.casal.dataCasamento.split('/');
      var data = new Date(casamento[2], casamento[1] - 1, casamento[0]);

      vm.dados.Casal.DataCasamento = data;
      vm.dados.Casal.NomeNoiva = session.user.casal.nomeNoiva;
      vm.dados.Casal.NomeNoivo = session.user.casal.nomeNoivo;
    }

    /**
     * @function  Salvar
     * @desc Envia o nome do casal e a data do casamento para o servidor e armazena no session
     * @memberof CasalController
     */
    function Salvar() {
      vm.carregando = true;
      var dados = conversorService.Json2Xml(vm.dados, '');

      //Salva os nomes no session para serem usados em outras views
      session.user.casal.nomeNoiva = vm.dados.Casal.NomeNoiva;
      session.user.casal.nomeNoivo = vm.dados.Casal.NomeNoivo;

      // Formata a data
      session.user.casal.dataCasamento = $filter('date')(vm.dados.Casal.DataCasamento, 'dd/MM/yyyy');

      session.SaveState();

      serverService.Request('AtualizarDadosCadastroNoivos', dados).then(function (resp) {
        vm.carregando = false;
        toastr.success('Alterações Salvas!');
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('AtualizarDadosCadastroNoivos -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function UploadFoto
     * @desc Enviar a foto recortada para o servidor e armazena a nova url da foto
     * @memberof CasalController
     */
    function UploadFoto() {
      vm.carregando = true; //Esconde foto atual e mostra gif de loding

      /**
       * Pega a foto recordada
       * Transforma em jpg
       * Passa para a base64
       */
      var imagemCortada = vm.imageEditor.toDataURL({
        useOriginalImg: true,
        imageType: 'image/jpg'
      });

      EnviarFoto.Request(ID, imagemCortada).then(function (resp) {
        var novaImg = '';
        var time = new Date(); //Pega a data e hora atual
        /**
         * O nome da imagem nunca muda,portanto
         * ela fica no cache. Para evitar o cache
         * eh preciso colocar ?+a hora atual
         */

        try {
          novaImg = $rootScope.foto.split('?'); //Retira a hora antiga
          novaImg = novaImg[0] + '?' + $filter('date')(time, 'H:mm', '-0300');
        } catch (error) {
          novaImg = imagemCortada;
        }

        /**
         * Armazena o nome da imagem com a hora atual
         * O filtro [$filter('date')] mostra so a hora
         */

        $rootScope.foto = novaImg; //Salva a foto no scopo global e na pagina atual
        session.user.casal.urlFoto = novaImg; //Salva a foto local
        session.SaveState();
        vm.carregando = false; //seconde o gif de loding e mostra a nova imagem
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('UploadFoto -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();