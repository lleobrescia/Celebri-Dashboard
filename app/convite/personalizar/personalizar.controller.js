(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PersonalizarController', PersonalizarController);

  PersonalizarController.$inject = ['serverService', 'conversorService', 'session', '$http', '$filter', '$state', 'Controlador', 'toastr'];

  function PersonalizarController(serverService, conversorService, session, $http, $filter, $state, Controlador, toastr) {
    const ID = session.user.id;
    var vm = this;

    vm.carregando = true;
    vm.convites = {};
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
        'conteudo_pais_noiva': session.user.cerimonia.ConfiguracaoConvite.Pai_noiva + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noiva,
        'conteudo_pais_noivo': session.user.cerimonia.ConfiguracaoConvite.Pai_noivo + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noivo,
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
    vm.editionEnable = true;
    vm.erro = false;
    vm.fonts = [];
    vm.idConvite = 1;
    vm.imageSelected = '';
    vm.styles = {
      'bloco1': {},
      'bloco2': {},
      'bloco3': {},
      'bloco4': {},
      'nomeCasal': {},
      'paisNoivo': {},
      'paisNoiva': {}
    };
    vm.styleSelected = [];

    vm.Controlador = Controlador; //service
    vm.Salvar = Salvar;

    Activate();

    ////////////////

    function Activate() {
      CheckSend();
      GetDados();
    }

    function CheckSend() {
      serverService.Get('RetornarConvidadosConfirmados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        var pessoas = resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados;

        if (pessoas !== undefined) {
          vm.editionEnable = false;
        }
      });
    }

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

    function GetDados() {
      serverService.Get('RetornarFormatacaoConvite', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

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

            if ($state.params.idModelo) {
              SetDefault();
            } else {
              SetStyles();
            }
          });
        });
      }).catch(function (error) {
        console.error('RetornarFormatacaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

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

    function Salvar() {
      vm.carregando = true;

      vm.dados.DadosFormatacaoConvite.alinhamento_msg1 = GetAlignId(vm.styles.bloco1['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_msg2 = GetAlignId(vm.styles.bloco2['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_msg3 = GetAlignId(vm.styles.bloco3['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_msg4 = GetAlignId(vm.styles.bloco4['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_nomecasal = GetAlignId(vm.styles.nomeCasal['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_pais_noivo = GetAlignId(vm.styles.paisNoivo['text-align']);
      vm.dados.DadosFormatacaoConvite.alinhamento_pais_noiva = GetAlignId(vm.styles.paisNoiva['text-align']);

      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg1 = $filter('removePx')(vm.styles.bloco1['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg2 = $filter('removePx')(vm.styles.bloco2['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg3 = $filter('removePx')(vm.styles.bloco3['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_msg4 = $filter('removePx')(vm.styles.bloco4['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_nomecasal = $filter('removePx')(vm.styles.nomeCasal['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_pais_noivo = $filter('removePx')(vm.styles.paisNoivo['font-size']);
      vm.dados.DadosFormatacaoConvite.tamanho_fonte_pais_noiva = $filter('removePx')(vm.styles.paisNoiva['font-size']);

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

        if (resp.ResultadoFormatacaoConvite.Result === 'true') {
          toastr.success('Alterações Salvas!');
        } else {
          toastr.error('Não foi possível salvar as alterações.', 'Erro');
        }
        vm.carregando = false;
      }).catch(function (error) {
        console.error('FormatacaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function SetDefault() {
      vm.dados.DadosFormatacaoConvite.conteudo_pais_noiva = session.user.cerimonia.ConfiguracaoConvite.Pai_noiva + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noiva;
      vm.dados.DadosFormatacaoConvite.conteudo_pais_noiva = session.user.cerimonia.ConfiguracaoConvite.Pai_noivo + '#' + session.user.cerimonia.ConfiguracaoConvite.Mae_noivo;
      vm.dados.DadosFormatacaoConvite.conteudo_msg1 = 'convidam para a cerimônia de casamento dos seus filhos';
      vm.dados.DadosFormatacaoConvite.conteudo_msg2 = 'a realizar-se às ' + session.user.cerimonia.ConfiguracaoConvite.Horario_cerimonia + ' horas, dia ' + session.user.casal.dataCasamento + ', ' + session.user.cerimonia.ConfiguracaoConvite.Local_cerimonia;
      vm.dados.DadosFormatacaoConvite.conteudo_msg3 = 'Este é um texto de referência para a mensagem do seu convite. Para editá-lo clique aqui e reescreva. Se você optar por não ter nenhuma mensagem, basta selecionar o texto e deletar.';
      vm.dados.DadosFormatacaoConvite.conteudo_nomecasal = session.user.casal.nomeNoiva + ' &amp; ' + session.user.casal.nomeNoivo;

      vm.dados.DadosFormatacaoConvite.id_modelo = vm.idConvite;

      vm.styles = vm.convites['convite' + vm.idConvite];

      vm.styles.bloco1['font-size'] = $filter('sufixPx')(vm.styles.bloco1['font-size']);
      vm.styles.bloco2['font-size'] = $filter('sufixPx')(vm.styles.bloco2['font-size']);
      vm.styles.bloco3['font-size'] = $filter('sufixPx')(vm.styles.bloco3['font-size']);
      vm.styles.bloco4['font-size'] = $filter('sufixPx')(vm.styles.bloco4['font-size']);
      vm.styles.nomeCasal['font-size'] = $filter('sufixPx')(vm.styles.nomeCasal['font-size']);
      vm.styles.paisNoivo['font-size'] = $filter('sufixPx')(vm.styles.paisNoivo['font-size']);
      vm.styles.paisNoiva['font-size'] = $filter('sufixPx')(vm.styles.paisNoiva['font-size']);

      vm.carregando = false; //escode o load
    }

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
       * O servidor armazena o alinhamento em valor inteiro
       * O filtro alinhamento converte para string
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