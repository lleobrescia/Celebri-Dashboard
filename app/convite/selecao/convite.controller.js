(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ConviteController', ConviteController);

  ConviteController.$inject = ['serverService', 'conversorService', 'session', '$http', '$filter', '$state', '$window'];

  function ConviteController(serverService, conversorService, session, $http, $filter, $state, $window) {
    const ID = session.user.id;
    var vm = this;

    vm.altura = $window.innerHeight;
    vm.largura = $window.innerWidth;
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
    vm.dialogUp = false;
    vm.editionEnable = true;
    vm.fonts = [];
    vm.hasConfig = false;
    vm.idConvite = 0;
    vm.imageSelected = '';
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
    vm.styles = {
      'bloco1': {},
      'bloco2': {},
      'bloco3': {},
      'bloco4': {},
      'nomeCasal': {},
      'paisNoivo': {},
      'paisNoiva': {}
    };
    vm.styleDialog = {
      'max-width': (vm.largura - 100) + 'px',
      'max-height': (vm.altura - 100) + 'px'
    };

    vm.SelectConvite = SelectConvite;
    vm.Sim = Sim;

    Activate();

    ////////////////

    function Activate() {
      console.log(vm.altura);
      console.log(vm.largura);
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

    function SelectConvite(id, url) {
      vm.imageSelected = url;
      vm.idConvite = id;
      vm.dialogUp = true;
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

      vm.carregando = false; //escode o load
      vm.hasConfig = true; //Mostra o convite configurado
    }

    function Sim() {
      console.log(vm.idConvite);
      $state.go('personalizar', {
        idModelo: vm.idConvite
      });
    }
  }
})();