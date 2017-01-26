(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ConviteController', ConviteController);

  ConviteController.$inject = ['serverService', 'conversorService', 'session', '$http', '$filter', '$state', '$window', 'toastr'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name ConviteController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Mostra o convite, se já tiver feito a configuração, para o usuario. Mostra todos os modelos de convites para o usuario escolher.
   * Depois de ecolher ele eh direcionado a configuração.O usuario pode editar o convite depois de convigurado.<br>
   * <strong>!! Não eh possivel editar ou trocar de modelo apos o envio !!</strong> Isso prejudicaria o APP<br>
   * Pasta de origem : app/convite/selecao <br>
   * State : convite <br>
   * Controller As : convite<br>
   * Template Url : app/convite/selecao/convite.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - RetornarConvidadosConfirmados {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConvidadosConfirmados}
   *  - RetornarFormatacaoConvite {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarFormatacaoConvite}
   * @param {service} serverService    - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService - usado para converter xml <-> json (conversor.service.js)
   * @param {service} session          - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $http            - usado para pegar o convites.json e fonts.json
   * @param {service} $filter          - usado para formatações
   * @param {service} $state           - usado para passar parametro para a configuração de convite
   * @param {service} $window          - usado para pegar a altura e a largura da tela.
   * @param {service} toastr           - usado para mostrar mensagens ao usuario
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function ConviteController(serverService, conversorService, session, $http, $filter, $state, $window, toastr) {
    const ID = session.user.id;
    var vm = this;

    /**
     * Altura e largura sao usados para configurar a largura e altura do popup 
     * para a escolha do convite
     */
    vm.altura = $window.innerHeight;
    vm.largura = $window.innerWidth;
    vm.carregando = true; //Controla o loading
    vm.convites = {}; // Formatação basica dos convites ( recebe o arquivo convites.json)
    //Formatação de dados do servidor. Usado para mostrar o convite configurado
    vm.dados = {
      'DadosFormatacaoConvite': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'alinhamento_msg1': '1',
        'alinhamento_msg2': '1',
        'alinhamento_msg3': '1',
        'alinhamento_msg4': '1',
        'alinhamento_nomecasal': '1',
        'alinhamento_pais_noiva': '1',
        'alinhamento_pais_noivo': '1',
        'conteudo_msg1': 'convidam para a cerimônia de casamento dos seus filhos',
        'conteudo_msg2': '',
        'conteudo_msg3': '',
        'conteudo_msg4': '',
        'conteudo_nomecasal': '',
        'conteudo_pais_noiva': session.user.cerimonia.Pai_noiva + '#' + session.user.cerimonia.Mae_noiva,
        'conteudo_pais_noivo': session.user.cerimonia.Pai_noivo + '#' + session.user.cerimonia.Mae_noivo,
        'cor_msg1': '#3333',
        'cor_msg2': '#3333',
        'cor_msg3': '#3333',
        'cor_msg4': '#3333',
        'cor_nomecasal': '#3333',
        'cor_pais_noiva': '#3333',
        'cor_pais_noivo': '#3333',
        'fonte_msg1': '1',
        'fonte_msg2': '1',
        'fonte_msg3': '1',
        'fonte_msg4': '1',
        'fonte_nomecasal': '1',
        'fonte_pais_noiva': '1',
        'fonte_pais_noivo': '1',
        'id_casal': ID,
        'id_modelo': '0',
        'tamanho_fonte_msg1': '1',
        'tamanho_fonte_msg2': '1',
        'tamanho_fonte_msg3': '1',
        'tamanho_fonte_msg4': '1',
        'tamanho_fonte_pais_noiva': '1',
        'tamanho_fonte_pais_noivo': '1',
        'tamanho_nomecasal': '1'
      }
    };
    vm.dialogUp = false; //Controla o display do popup de confirmação de escolha
    vm.editionEnable = true; // Se o casal ja enviou o convite a edição e desabilitada
    vm.erro = false; //Mostra erro se houver erro na comunicação com o servidor
    vm.fonts = []; //Lista de fontes disponiveis para mostrar o convite ( recebe o arquivo fonts.json)
    vm.hasConfig = false; //Se tiver um convite ja configurado, mostra ele.
    vm.idConvite = 0; // Id do convite. 0 significa que nao ha configuração salva
    vm.imageSelected = ''; // Imagem do convite selecionado. Usado para confirmar a seleção
    //Imagens de modelo de convites para a seleção
    vm.thumbs = [{
      ID: 1,
      url: 'image/convites/thumb/thumb1.png',
      nome: 'Laranja'
    }, {
      ID: 2,
      url: 'image/convites/thumb/thumb2.png',
      nome: 'Arabescos'
    }, {
      ID: 3,
      url: 'image/convites/thumb/thumb3.png',
      nome: 'Ramos'
    }, {
      ID: 4,
      url: 'image/convites/thumb/thumb4.png',
      nome: 'Plain'
    }, {
      ID: 5,
      url: 'image/convites/thumb/thumb5.png',
      nome: 'Orquidea'
    }, {
      ID: 6,
      url: 'image/convites/thumb/thumb6.png',
      nome: 'Gold'
    }, {
      ID: 7,
      url: 'image/convites/thumb/thumb7.png',
      nome: 'Floral'
    }, {
      ID: 9,
      url: 'image/convites/thumb/thumb9.png',
      nome: 'Árvore'
    }];
    //Estilos de cada bloco do convite. Usado para mostrar o convite configurado
    vm.styles = {
      'bloco1': {},
      'bloco2': {},
      'bloco3': {},
      'bloco4': {},
      'nomeCasal': {},
      'paisNoivo': {},
      'paisNoiva': {}
    };
    /**
     * Define a altura e largura do popup da confirmação da seleção do convite
     * baseado na altura e largura do dispositivo - 100px para dar um espaço para 'respirar'
     */
    vm.styleDialog = {
      'max-width': (vm.largura - 100) + 'px',
      'max-height': (vm.altura - 100) + 'px'
    };

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.SelectConvite = SelectConvite;
    vm.Sim = Sim;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof ConviteController
     */
    function Activate() {
      CheckSend();
      GetDados();
    }

    /**
     * @function CheckSend
     * @desc Verifica se o casal ja enviou os convites. Nao eh possivel editar ou alterar o modelo do convite se ja foi enviado.
     * @memberof ConviteController
     */
    function CheckSend() {
      serverService.Get('RetornarConvidadosConfirmados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        var pessoas = resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados;

        if (pessoas !== undefined) {
          vm.editionEnable = false;
        }
      });
    }

    /**
     * @function GetDados
     * @desc Pega, do servidor, a formatacao do convite.
     * Se houver uma formatacao entao monta o convite para ser mostrado
     * Se nao, mostra as opcoes de convites para escolher
     * @memberof ConviteController
     */
    function GetDados() {
      serverService.Get('RetornarFormatacaoConvite', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        //salva os dados localmente
        session.user.convite = vm.dados = resp;
        session.SaveState();

        //pega o id do modelo do convite
        vm.idConvite = resp.DadosFormatacaoConvite.id_modelo;

        if (vm.idConvite !== '0') {
          //Pega as configuracoes padrao dos convites
          $http({
            method: 'GET',
            url: 'app/convite/convites.json'
          }).then(function (resp) {
            vm.convites = resp.data;

            //Pega todas as fonts
            $http({
              method: 'GET',
              url: 'app/convite/fonts.json'
            }).then(function (data) {
              vm.fonts = data.data;

              vm.imageSelected = 'image/convites/convite' + vm.idConvite + '.png';

              //Personaliza o padrao com as informações do usuario
              SetStyles();
            });
          });
        } else {
          vm.carregando = false; //escode o load
        }
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('RetornarFormatacaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function GetFont
     * @desc Busca o nome da fonte baseado no id fornecido. O servidor armazena apenas o id e nao o nome da fonte
     * @param {string} id - id da fonte
     * @return {string} Nome da fonte
     * @memberof ConviteController
     */
    function GetFont(id) {
      try {
        var serif = vm.fonts.SERIF[id]['font-name'];
        return serif;
      } catch (e) {
        try {
          var sansserif = vm.fonts.SANSSERIF[id]['font-name'];
          return sansserif;
        } catch (e) {
          try {
            var display = vm.fonts.DISPLAY[id]['font-name'];
            return display;
          } catch (e) {
            try {
              var handwriting = vm.fonts.HANDWRITING[id]['font-name'];
              return handwriting;
            } catch (e) {
              return null;
            }
          }
        }
      }
    }

    /**
     * @function SelectConvite
     * @desc Armazena o id e url do convite selecionado e depois mostra o popup de confirmação.
     * A url eh usada para mostrar o modelo novamente na confirmação
     * E o id eh armazenado para enviar para a personalização de convite
     * @param {string} id - id do modelo do convite
     * @param {string} url - caminho do thumb.
     * @memberof ConviteController
     */
    function SelectConvite(id, url) {
      vm.imageSelected = url;
      vm.idConvite = id;
      vm.dialogUp = true;
    }

    /**
     * @function SetStyles
     * @desc Configura os estilos (css) de cada bloco do convite
     * @memberof ConviteController
     */
    function SetStyles() {
      //Pega o padrao do convite
      vm.styles = vm.convites['convite' + vm.idConvite];

      /**
       * O servidor armazena as fontes sem o px
       * O filtro sufixPx coloca o px nas fontes
       */
      vm.styles.bloco1['font-size'] = $filter('sufixPx')(vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg1);
      vm.styles.bloco2['font-size'] = $filter('sufixPx')(vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg2);
      vm.styles.bloco3['font-size'] = $filter('sufixPx')(vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg3);
      vm.styles.bloco4['font-size'] = $filter('sufixPx')(vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg4);
      vm.styles.nomeCasal['font-size'] = $filter('sufixPx')(vm.dados.DadosFormatacaoConvite.tamanho_nomecasal);
      vm.styles.paisNoivo['font-size'] = $filter('sufixPx')(vm.dados.DadosFormatacaoConvite.tamanho_fonte_pais_noivo);
      vm.styles.paisNoiva['font-size'] = $filter('sufixPx')(vm.dados.DadosFormatacaoConvite.tamanho_fonte_pais_noiva);

      /**
       * O servidor armazena o alinhamento em valor inteiro
       * O filtro alinhamento converte para string (left, center ou right)
       */
      vm.styles.bloco1['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg1);
      vm.styles.bloco2['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg2);
      vm.styles.bloco3['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg3);
      vm.styles.bloco4['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg4);
      vm.styles.nomeCasal['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_nomecasal);
      vm.styles.paisNoivo['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_pais_noivo);
      vm.styles.paisNoiva['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_pais_noiva);

      /**
       * O servidor armazena o tipo de fonte em valor inteiro (id)
       * Eh preciso pegar o nome da fonte.
       */
      vm.styles.bloco1['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg1);
      vm.styles.bloco2['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg2);
      vm.styles.bloco3['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg3);
      vm.styles.bloco4['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg4);
      vm.styles.nomeCasal['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_nomecasal);
      vm.styles.paisNoivo['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_pais_noivo);
      vm.styles.paisNoiva['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_pais_noiva);

      vm.carregando = false; //Escode o load
      vm.hasConfig = true; //Mostra o convite configurado
    }

    /**
     * @function Sim
     * @desc Quando o usuario confirma a seleção ele eh enviado para a personalização do convite
     * Eh passado o id do modelo escolhido por parametro
     * @memberof ConviteController
     */
    function Sim() {
      $state.go('personalizar', {
        idModelo: vm.idConvite
      });
    }
  }
})();