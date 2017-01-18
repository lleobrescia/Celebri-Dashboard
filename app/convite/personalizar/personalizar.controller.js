(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PersonalizarController', PersonalizarController);

  PersonalizarController.$inject = ['serverService', 'conversorService', 'session', '$http', '$filter', '$state', 'Controlador', 'toastr'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name PersonalizarController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Edita o convite escolhido.<br> <strong>!! Não eh possivel editar ou trocar de modelo apos o envio !!</strong> Isso prejudicaria o APP<br>
   * Pasta de origem : app/convite/personalizar <br>
   * State : personalizar <br>
   * Controller As : convite <br>
   * Template Url : app/convite/personalizar/personalizar.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - RetornarConvidadosConfirmados {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConvidadosConfirmados}
   *  - RetornarFormatacaoConvite {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarFormatacaoConvite}
   *  - FormatacaoConvite {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/FormatacaoConvite}
   * @param {service} serverService    - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService - usado para converter xml <-> json (conversor.service.js)
   * @param {service} session          - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $http            - usado para pegar o convites.json e fonts.json
   * @param {service} $filter          - usado para formatações de texto
   * @param {service} $state           - usado para pegar parametro(id do modelo) para a configuração de convite
   * @param {service} Controlador      - servico para gerenciar a parsonalização do convite (controlador.service.js)
   * @param {service} toastr           - usado para mostrar mensagens ao usuario
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function PersonalizarController(serverService, conversorService, session, $http, $filter, $state, Controlador, toastr) {
    const ID = session.user.id; //id do usuario logado.Usado para fazer requisições
    var vm = this;

    vm.carregando = true; // Controla o loading
    vm.convites = {}; // Configuração basica dos convites
    //Formatação para enviar ao servidor da configuração do convite
    vm.dados = {
      'DadosFormatacaoConvite': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'alinhamento_msg1': '1', // id do alinhamento. Existe funcao para converter
        'alinhamento_msg2': '1',
        'alinhamento_msg3': '1',
        'alinhamento_msg4': '1',
        'alinhamento_nomecasal': '1',
        'alinhamento_pais_noiva': '1',
        'alinhamento_pais_noivo': '1',
        'conteudo_msg1': 'convidam para a cerimônia de casamento dos seus filhos', // Conteudo padrao. Nao altera
        'conteudo_msg2': '',
        'conteudo_msg3': '',
        'conteudo_msg4': '',
        'conteudo_nomecasal': '',
        //Padrao do nome dos pais. Nao eh alterado
        'conteudo_pais_noiva': session.user.cerimonia.ConfiguracaoConvite.Pai_noiva + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noiva,
        'conteudo_pais_noivo': session.user.cerimonia.ConfiguracaoConvite.Pai_noivo + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noivo,
        //Nao existe opção para alterar a cor. A cor eh padrao
        'cor_msg1': '#3333',
        'cor_msg2': '#3333',
        'cor_msg3': '#3333',
        'cor_msg4': '#3333',
        'cor_nomecasal': '#3333',
        'cor_pais_noiva': '#3333',
        'cor_pais_noivo': '#3333',
        'fonte_msg1': '1', //Id da fonte. Existe funcao para converter
        'fonte_msg2': '1',
        'fonte_msg3': '1',
        'fonte_msg4': '1',
        'fonte_nomecasal': '1',
        'fonte_pais_noiva': '1',
        'fonte_pais_noivo': '1',
        'id_casal': ID,
        'id_modelo': '0',
        'tamanho_fonte_msg1': '1', //O tamanho da fonte eh sem o px
        'tamanho_fonte_msg2': '1',
        'tamanho_fonte_msg3': '1',
        'tamanho_fonte_msg4': '1',
        'tamanho_fonte_pais_noiva': '1',
        'tamanho_fonte_pais_noivo': '1',
        'tamanho_nomecasal': '1'
      }
    };
    vm.editionEnable = true; //Controla se o usuario pode editar
    vm.erro = false; //Mostra erro se houver erro para conectar ao servidor
    vm.fonts = []; //Fontes disponiveis para edição
    vm.idConvite = 1; //Id do convite
    vm.imageSelected = ''; // Imagem de fundo do convite
    //Estilos dos blocos do convite
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
     * Quando o usuario clica em um bloco
     * essa variavel armazena o estilo desse bloco
     * para poder fazer a edição ( alinhamento, tamanho de fonte, tipo de fonte)
     */
    vm.styleSelected = [];

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Controlador = Controlador; //service
    vm.Salvar = Salvar;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof PersonalizarController
     */
    function Activate() {
      CheckSend();
      GetDados();
    }

    /**
     * @function CheckSend
     * @desc Verifica se o casal ja enviou os convites. Nao eh possivel editar ou alterar o modelo do convite se ja foi enviado.
     * @memberof PersonalizarController
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
     * @function GetAlignId
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @param {service} align - nome do alinhamento (left,center,right)
     * @return {string} id do alinhamento (0,1,2)
     * @memberof PersonalizarController
     */
    function GetAlignId(align) {
      var retorno = '';
      switch (align) {
        case 'right':
          retorno = '2';
          break;
        case 'left':
          retorno = '0';
          break;
        case 'center':
          retorno = '1';
          break;
        default:
          retorno = '0';
          break;
      }
      return retorno;
    }

    /**
     * @function GetDados
     * @desc Pega a configuração do covnite do servidor. As fonts e a configuração basica dos convites
     * @memberof PersonalizarController
     */
    function GetDados() {
      serverService.Get('RetornarFormatacaoConvite', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        /**
         * modelo = 0 significa que não ha configuração salva.
         */
        if (resp.DadosFormatacaoConvite.id_modelo === '0') {
          session.user.convite = vm.dados;
        } else {
          session.user.convite = vm.dados = resp;
        }
        session.SaveState();

        //pega o id do modelo do convite
        if ($state.params.idModelo) {
          vm.idConvite = $state.params.idModelo;
        } else {
          vm.idConvite = resp.DadosFormatacaoConvite.id_modelo;
        }

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

            /**
             * Se houver id vindo de paramentro significa que o usuario
             * escolheu um modelo. Portanto, eh so colocar as configurações basicas no convite
             * Se nao houver, significa que o usuario esta editando um convite ja configurado, nesse caso
             * aplica as configurações salvas no servidor
             */
            if ($state.params.idModelo) {
              SetDefault(); // Configuração padrao do convites
            } else {
              SetStyles(); // Configuração salva no servidor
            }
          });
        });
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
     * @memberof PersonalizarController
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
     * @function GetFontID
     * @desc Busca o id baseado no nome da fonte fornecido. O servidor armazena apenas o id e nao o nome da fonte
     * @param {string} fontName - Nome da fonte
     * @return {string} Id da fonte
     * @memberof PersonalizarController
     */
    function GetFontID(fontName) {
      var retorno = 0;
      angular.forEach(vm.fonts, function (value, key) {
        angular.forEach(vm.fonts[key], function (value, key) {
          var font = value['font-name'];
          if (font == fontName) {
            retorno = key;
          }
        });
      });
      return retorno;
    }

    /**
     * @function Salvar
     * @desc Salva a configuração do convite no servidor
     * @memberof PersonalizarController
     */
    function Salvar() {
      vm.carregando = true; //Ativa o loading

      /**
       * O servidor so armazena o id do alinhamento
       * Por isso eh preciso converter o alinhamento de cada bloco em id
       * A funçao GetAlignId faz isso
       */
      vm.dados.DadosFormatacaoConvite.alinhamento_msg1 = GetAlignId(vm.styles.bloco1['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_msg2 = GetAlignId(vm.styles.bloco2['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_msg3 = GetAlignId(vm.styles.bloco3['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_msg4 = GetAlignId(vm.styles.bloco4['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_nomecasal = GetAlignId(vm.styles.nomeCasal['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_pais_noivo = GetAlignId(vm.styles.paisNoivo['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_pais_noiva = GetAlignId(vm.styles.paisNoiva['text-align']);

      /**
       * O servidor armazena o tamanho das fontes sem o px
       * Por isso eh preciso retirar o px dos tamanhos de fontes dos blocos
       * o filtro removePx faz isso
       */
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg1 = $filter('removePx')(vm.styles.bloco1['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg2 = $filter('removePx')(vm.styles.bloco2['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg3 = $filter('removePx')(vm.styles.bloco3['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg4 = $filter('removePx')(vm.styles.bloco4['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_nomecasal = $filter('removePx')(vm.styles.nomeCasal['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_pais_noivo = $filter('removePx')(vm.styles.paisNoivo['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_pais_noiva = $filter('removePx')(vm.styles.paisNoiva['font-size']);

      /**
       * O servidor so armazena o id da fonte
       * Por isso eh converter o nome da fonte em id
       * A função GetFontID faz isso
       */
      vm.dados.DadosFormatacaoConvite.fonte_msg1 = GetFontID(vm.styles.bloco1['font-family']);
      vm.dados.DadosFormatacaoConvite.fonte_msg2 = GetFontID(vm.styles.bloco2['font-family']);
      vm.dados.DadosFormatacaoConvite.fonte_msg3 = GetFontID(vm.styles.bloco3['font-family']);
      vm.dados.DadosFormatacaoConvite.fonte_msg4 = GetFontID(vm.styles.bloco4['font-family']);
      vm.dados.DadosFormatacaoConvite.fonte_nomecasal = GetFontID(vm.styles.nomeCasal['font-family']);
      vm.dados.DadosFormatacaoConvite.fonte_pais_noivo = GetFontID(vm.styles.paisNoivo['font-family']);
      vm.dados.DadosFormatacaoConvite.fonte_pais_noiva = GetFontID(vm.styles.paisNoiva['font-family']);

      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('FormatacaoConvite', dados).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        //Verifica se foi realmente salvo
        if (resp.ResultadoFormatacaoConvite.Result === 'true') {
          toastr.success('Alterações Salvas!');
        } else {
          toastr.error('Não foi possível salvar as alterações.', 'Erro');
        }
        vm.carregando = false;
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('FormatacaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    /**
     * @function SetDefault
     * @desc Configura o basico do convite
     * @memberof PersonalizarController
     */
    function SetDefault() {
      vm.dados.DadosFormatacaoConvite.conteudo_pais_noiva = session.user.cerimonia.ConfiguracaoConvite.Pai_noiva + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noiva;
      vm.dados.DadosFormatacaoConvite.conteudo_pais_noiva = session.user.cerimonia.ConfiguracaoConvite.Pai_noivo + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noivo;
      vm.dados.DadosFormatacaoConvite.conteudo_msg1 = 'convidam para a cerimônia de casamento dos seus filhos';
      vm.dados.DadosFormatacaoConvite.conteudo_msg2 = 'a realizar-se às ' + session.user.cerimonia.ConfiguracaoConvite.Horario_cerimonia + ' horas, dia ' + session.user.casal.dataCasamento + ', ' + session.user.cerimonia.ConfiguracaoConvite.Local_cerimonia;
      vm.dados.DadosFormatacaoConvite.conteudo_msg3 = 'Este é um texto de referência para a mensagem do seu convite. Para editá-lo clique aqui e reescreva. Se você optar por não ter nenhuma mensagem, basta selecionar o texto e deletar.';

      vm.dados.DadosFormatacaoConvite.conteudo_msg4 = 'Cerimônia: # ' + session.user.cerimonia.ConfiguracaoConvite.Local_cerimonia + ' # ' + session.user.cerimonia.ConfiguracaoConvite.Endereco + ', ' + session.user.cerimonia.ConfiguracaoConvite.Numero + ' - ' + session.user.cerimonia.ConfiguracaoConvite.Bairro + ' # ' + session.user.cerimonia.ConfiguracaoConvite.Cidade + ' - ' + session.user.cerimonia.ConfiguracaoConvite.Estado;

      vm.dados.DadosFormatacaoConvite.conteudo_nomecasal = session.user.casal.nomeNoiva + ' &amp; ' + session.user.casal.nomeNoivo;

      vm.dados.DadosFormatacaoConvite.id_modelo = vm.idConvite;

      vm.styles = vm.convites['convite' + vm.idConvite];

      //Pega o tamanho da fonte e acrescenta o px
      vm.styles.bloco1['font-size'] = $filter('sufixPx')(vm.styles.bloco1['font-size']);
      vm.styles.bloco2['font-size'] = $filter('sufixPx')(vm.styles.bloco2['font-size']);
      vm.styles.bloco3['font-size'] = $filter('sufixPx')(vm.styles.bloco3['font-size']);
      vm.styles.bloco4['font-size'] = $filter('sufixPx')(vm.styles.bloco4['font-size']);
      vm.styles.nomeCasal['font-size'] = $filter('sufixPx')(vm.styles.nomeCasal['font-size']);
      vm.styles.paisNoivo['font-size'] = $filter('sufixPx')(vm.styles.paisNoivo['font-size']);
      vm.styles.paisNoiva['font-size'] = $filter('sufixPx')(vm.styles.paisNoiva['font-size']);

      vm.carregando = false; //escode o load
    }

    /**
     * @function SetStyles
     * @desc Configura o convite com as informações vindas do servidor
     * @memberof PersonalizarController
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
       * O filtro alinhamento converte para string
       */
      vm.styles.bloco1['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg1);
      vm.styles.bloco2['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg2);
      vm.styles.bloco3['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg3);
      vm.styles.bloco4['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_msg4);
      vm.styles.nomeCasal['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_nomecasal);
      vm.styles.paisNoivo['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_pais_noivo);
      vm.styles.paisNoiva['text-align'] = $filter('alinhamento')(vm.dados.DadosFormatacaoConvite.alinhamento_pais_noiva);

      /**
       * O servidor armazena o nome da fonte em valor inteiro
       * A funcao GetFont converte para string
       */
      vm.styles.bloco1['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg1);
      vm.styles.bloco2['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg2);
      vm.styles.bloco3['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg3);
      vm.styles.bloco4['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_msg4);
      vm.styles.nomeCasal['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_nomecasal);
      vm.styles.paisNoivo['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_pais_noivo);
      vm.styles.paisNoiva['font-family'] = GetFont(vm.dados.DadosFormatacaoConvite.fonte_pais_noiva);

      Controlador.SelectStyle(vm.styles.bloco3); //seleciona o bloco para edicao

      vm.carregando = false; //escode o load
    }
  }
})();