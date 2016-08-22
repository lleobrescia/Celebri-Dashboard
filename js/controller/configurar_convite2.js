/**
 * Configurar Convite Controller2
 * controllerAs: 'configConvite2Ctrl'
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('configurar_convite2', ConfigurarConvite2);

  /**
   * $filter - Usado para filtrar a hora
   * $location - Usado para direcionar o usuario para personalizar-convite
   * $sce - Usado para bind do conteudo do servidor no tamplate
   * ipService - IP do servidor
   * UserService - Armazena os dados do usuario
   * ServiceCasamento - Servido para enviar e pegar dados do servidor
   */
  ConfigurarConvite2.$inject = ['$filter', '$location', '$sce', 'ipService', 'UserService', 'ServiceCasamento'];

  /**
   * @namespace ConfigurarConvite2
   * @desc Lista os convites disponiveis. Se o usuario ja configurou o convite, mostra ele configurado com as opções de editar e refazer.
   * @memberOf Controllers
   */
  function ConfigurarConvite2($filter, $location, $sce, ipService, UserService, ServiceCasamento) {
    var cerimoniaBairro = UserService.dados.cerimoniaBairro;
    var cerimoniaCidade = UserService.dados.cerimoniaCidade;
    var cerimoniaEnd = UserService.dados.cerimoniaEnd;
    var cerimoniaHora = UserService.dados.cerimoniaHora;
    var cerimoniaLocal = UserService.dados.cerimoniaLocal;
    var cerimoniaNumero = UserService.dados.cerimoniaNumero;
    var cerimoniaMin = UserService.dados.cerimoniaMin;
    var convites = UserService.dados.listaConvites;
    var dataCasamento = UserService.dados.dataCasamento;
    var fonts = UserService.dados.listaFonts;
    var ID = UserService.dados.ID; //ID do usuario logado
    var idConvite = UserService.dados.modeloConvite; //ID do convite(0 -> nenhum convite selecionado)
    var noivaMae = UserService.dados.noivaMae;
    var noivaMaeMemorian = UserService.dados.noivaMaeMemorian;
    var noivaPai = UserService.dados.noivaPai;
    var noivaPaiMemorian = UserService.dados.noivaPaiMemorian;
    var noivoMae = UserService.dados.noivoMae;
    var noivoMaeMemorian = UserService.dados.noivoMaeMemorian;
    var noivoPai = UserService.dados.noivoPai;
    var noivoPaiMemorian = UserService.dados.noivoPaiMemorian;
    var nomeNoiva = UserService.dados.nomeNoiva;
    var nomeNoivo = UserService.dados.nomeNoivo;
    var self = this;

    self.AlterarConvite = AlterarConvite;
    self.cerregando = true; //Controlado o display do gif de carregar
    self.hasContent = UserService.dados.conviteCriado; //O convite ja foi criado?
    self.thumbEscolhido = 'image/convites/thumb/thumb1.png'; //Inicializa um thumb
    //thumb disponiveis
    self.thumbs = [
      {
        ID: 1,
        url: 'image/convites/thumb/thumb1.png',
        nome: 'Laranja'
      },
      {
        ID: 2,
        url: 'image/convites/thumb/thumb2.png',
        nome: 'Arabescos'
      },
      {
        ID: 3,
        url: 'image/convites/thumb/thumb3.png',
        nome: 'Ramos'
      },
      {
        ID: 4,
        url: 'image/convites/thumb/thumb4.png',
        nome: 'Plain'
      },
      {
        ID: 5,
        url: 'image/convites/thumb/thumb5.png',
        nome: 'Orquidea'
      },
      {
        ID: 6,
        url: 'image/convites/thumb/thumb6.png',
        nome: 'Gold'
      },
      {
        ID: 7,
        url: 'image/convites/thumb/thumb7.png',
        nome: 'Floral'
      },
      {
        ID: 9,
        url: 'image/convites/thumb/thumb9.png',
        nome: 'Árvore'
      }
    ];
    self.thumbNome = 'Laranja'; //Inicializa o nome do convite
    self.SalvarConvite = SalvarConvite;
    self.SetConvite = SetConvite;
    self.enableEditor = true;

    GetConfiguracaoConvite(); //Init

    /**
     * @name AlterarConvite
     * @desc Apaga o conteudo do convite salvo.
     * @memberOf Controllers.ConfigurarConvite2
     */
    function AlterarConvite() {
      $('#confirmacao').modal('hide'); //Esconde o modal
      self.cerregando = true; //mostra o gif de carregando

      UserService.dados.modeloConvite = 0; //Informa que nao ha convite selecionado
      UserService.dados.conviteCriado = self.hasContent = false; //Informa que nao ha conteudo de convite
      UserService.SaveState(); //Salva localmente

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/FormatacaoConvite';
      var xmlVar = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>1</alinhamento_msg1><alinhamento_msg2>1</alinhamento_msg2><alinhamento_msg3>1</alinhamento_msg3><alinhamento_msg4>1</alinhamento_msg4><alinhamento_nomecasal>1</alinhamento_nomecasal><alinhamento_pais_noiva>1</alinhamento_pais_noiva><alinhamento_pais_noivo>1</alinhamento_pais_noivo><conteudo_msg1>String content</conteudo_msg1><conteudo_msg2>String content</conteudo_msg2><conteudo_msg3>String content</conteudo_msg3><conteudo_msg4>String content</conteudo_msg4><conteudo_nomecasal>String content</conteudo_nomecasal><conteudo_pais_noiva>String content</conteudo_pais_noiva><conteudo_pais_noivo>String content</conteudo_pais_noivo><cor_msg1>#3333</cor_msg1><cor_msg2>#3333</cor_msg2><cor_msg3>#3333</cor_msg3><cor_msg4>#3333</cor_msg4><cor_nomecasal>#3333</cor_nomecasal><cor_pais_noiva>#3333</cor_pais_noiva><cor_pais_noivo>#3333</cor_pais_noivo><fonte_msg1>1</fonte_msg1><fonte_msg2>1</fonte_msg2><fonte_msg3>1</fonte_msg3><fonte_msg4>1</fonte_msg4><fonte_nomecasal>1</fonte_nomecasal><fonte_pais_noiva>1</fonte_pais_noiva><fonte_pais_noivo>1</fonte_pais_noivo><id_casal>' + ID + '</id_casal><id_modelo>0</id_modelo><tamanho_fonte_msg1>1</tamanho_fonte_msg1><tamanho_fonte_msg2>1</tamanho_fonte_msg2><tamanho_fonte_msg3>1</tamanho_fonte_msg3><tamanho_fonte_msg4>1</tamanho_fonte_msg4><tamanho_fonte_pais_noiva>1</tamanho_fonte_pais_noiva><tamanho_fonte_pais_noivo>1</tamanho_fonte_pais_noivo><tamanho_nomecasal>1</tamanho_nomecasal></DadosFormatacaoConvite>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (res) {
        self.cerregando = false;
      }).catch(function (error) {
        console.error('AlterarConvite -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

    /**
      * @name FormatConvite
      * @desc Coloca os blocos de texto no lugar, de acordo com cada convite.
      * @memberOf Controllers.ConfigurarConvite2
      */
    function FormatConvite() {
      var bloco = convites['convite' + idConvite]; //pega o convite selecionado

      self.blocoPaisNoiva = bloco.blocoPaisNoiva;
      self.blocoPaisNoivo = bloco.blocoPaisNoivo;
      self.blocoMsg1 = bloco.blocoMsg1;
      self.blocoNomeNoivos = bloco.blocoNomeNoivos;
      self.blocoMsg2 = bloco.blocoMsg2;
      self.blocoMsgPersonalizadaStyle = bloco.blocoMsgPersonalizadaStyle;
      self.blocoCerimonia = bloco.blocoCerimonia;
    }

    /**
      * @name GetConfiguracaoConvite
      * @desc Pega o estilo de cada bloco no servidor, se existir.
      * @memberOf Controllers.ConfigurarConvite2
      */
    function GetConfiguracaoConvite() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarFormatacaoConvite';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      HasSend();

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        resp = $.parseXML(resp);
        idConvite = $(resp).find('id_modelo').text();

        if (idConvite !== '0') {
          self.hasContent = true;
          FormatConvite();
          SetMsg();
          self.layoutSelecionado = './image/convites/convite' + idConvite + '.png';

          self.blocoMsg1['text-align'] =
            UserService.dados.blocoMsg1['text-align'] =
            GetTextAling($(resp).find('alinhamento_msg1').text());

          self.blocoMsg2['text-align'] =
            UserService.dados.blocoMsg2['text-align'] =
            GetTextAling($(resp).find('alinhamento_msg2').text());

          self.blocoMsgPersonalizadaStyle['text-align'] =
            UserService.dados.blocoMsgPersonalizadaStyle['text-align'] =
            GetTextAling($(resp).find('alinhamento_msg3').text());

          self.blocoCerimonia['text-align'] =
            UserService.dados.blocoCerimonia['text-align'] =
            GetTextAling($(resp).find('alinhamento_msg4').text());

          self.blocoNomeNoivos['text-align'] =
            UserService.dados.blocoNomeNoivos['text-align'] =
            GetTextAling($(resp).find('alinhamento_nomecasal').text());

          self.blocoPaisNoiva['text-align'] =
            UserService.dados.blocoPaisNoiva['text-align'] =
            GetTextAling($(resp).find('alinhamento_pais_noiva').text());

          self.blocoPaisNoivo['text-align'] =
            UserService.dados.blocoPaisNoivo['text-align'] =
            GetTextAling($(resp).find('alinhamento_pais_noivo').text());


          self.blocoMsg1.color =
            UserService.dados.blocoMsg1.color =
            $(resp).find('cor_msg1').text();

          self.blocoMsg2.color =
            UserService.dados.blocoMsg2.color =
            $(resp).find('cor_msg2').text();

          self.blocoMsgPersonalizadaStyle.color =
            UserService.dados.blocoMsgPersonalizadaStyle.color =
            $(resp).find('cor_msg3').text();

          self.blocoCerimonia.color =
            UserService.dados.blocoCerimonia.color =
            $(resp).find('cor_msg4').text();

          self.blocoNomeNoivos.color =
            UserService.dados.blocoNomeNoivos.color =
            $(resp).find('cor_nomecasal').text();

          self.blocoPaisNoiva.color =
            UserService.dados.blocoPaisNoiva.color =
            $(resp).find('cor_pais_noiva').text();

          self.blocoPaisNoivo.color =
            UserService.dados.blocoPaisNoivo.color =
            $(resp).find('cor_pais_noivo').text();


          self.blocoMsg1['font-family'] =
            UserService.dados.blocoMsg1['font-family'] =
            GetFonte($(resp).find('fonte_msg1').text());

          self.blocoMsg2['font-family'] =
            UserService.dados.blocoMsg2['font-family'] =
            GetFonte($(resp).find('fonte_msg2').text());

          self.blocoMsgPersonalizadaStyle['font-family'] =
            UserService.dados.blocoMsgPersonalizadaStyle['font-family'] =
            GetFonte($(resp).find('fonte_msg3').text());

          self.blocoCerimonia['font-family'] =
            UserService.dados.blocoCerimonia['font-family'] =
            GetFonte($(resp).find('fonte_msg4').text());

          self.blocoNomeNoivos['font-family'] =
            UserService.dados.blocoNomeNoivos['font-family'] =
            GetFonte($(resp).find('fonte_nomecasal').text());

          self.blocoPaisNoiva['font-family'] =
            UserService.dados.blocoPaisNoiva['font-family'] =
            GetFonte($(resp).find('fonte_pais_noiva').text());

          self.blocoPaisNoivo['font-family'] =
            UserService.dados.blocoPaisNoivo['font-family'] =
            GetFonte($(resp).find('fonte_pais_noivo').text());


          self.blocoMsg1['font-size'] =
            UserService.dados.blocoMsg1['font-size'] =
            $(resp).find('tamanho_fonte_msg1').text() + 'px';

          self.blocoMsg2['font-size'] =
            UserService.dados.blocoMsg2['font-size'] =
            $(resp).find('tamanho_fonte_msg2').text() + 'px';

          self.blocoMsgPersonalizadaStyle['font-size'] =
            UserService.dados.blocoMsgPersonalizadaStyle['font-size'] =
            $(resp).find('tamanho_fonte_msg3').text() + 'px';

          self.blocoCerimonia['font-size'] =
            UserService.dados.blocoCerimonia['font-size'] =
            $(resp).find('tamanho_fonte_msg4').text() + 'px';

          self.blocoNomeNoivos['font-size'] =
            UserService.dados.blocoNomeNoivos['font-size'] =
            $(resp).find('tamanho_nomecasal').text() + 'px';

          self.blocoPaisNoiva['font-size'] =
            UserService.dados.blocoPaisNoiva['font-size'] =
            $(resp).find('tamanho_fonte_pais_noiva').text() + 'px';

          self.blocoPaisNoivo['font-size'] =
            UserService.dados.blocoPaisNoivo['font-size'] =
            $(resp).find('tamanho_fonte_pais_noivo').text() + 'px';

          self.blocoMsgPersonalizada = $sce.trustAsHtml($(resp).find('conteudo_msg3').text());
          UserService.dados.blocoMsgPersonalizadaStyle.conteudo = $(resp).find('conteudo_msg3').text();

          UserService.dados.blocoMsg1['font-id'] = $(resp).find('fonte_msg1').text();
          UserService.dados.blocoMsg2['font-id'] = $(resp).find('fonte_msg2').text();
          UserService.dados.blocoMsgPersonalizadaStyle['font-id'] = $(resp).find('fonte_msg3').text();
          UserService.dados.blocoCerimonia['font-id'] = $(resp).find('fonte_msg4').text();
          UserService.dados.blocoNomeNoivos['font-id'] = $(resp).find('fonte_nomecasal').text();
          UserService.dados.blocoPaisNoiva['font-id'] = $(resp).find('fonte_pais_noiva').text();
          UserService.dados.blocoPaisNoivo['font-id'] = $(resp).find('fonte_pais_noivo').text();

          UserService.dados.modeloConvite = 'convite' + idConvite;
        } else {
          self.hasContent = false;
        }
        UserService.dados.conviteCriado = self.hasContent;
        UserService.SaveState();
        self.cerregando = false;
      }).catch(function (error) {
        console.error('GetConfiguracaoConvite -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

    /**
      * @name GetFonte
      * @param {Int} Id da font para buscar
      * @desc Busca a font na lista a partir do ID fornecido
      * @returns {String} nome da font
      * @memberOf Controllers.ConfigurarConvite2
      */
    function GetFonte(id) {
      try {
        var serif = fonts.SERIF[id]['font-name'];
        return serif;
      } catch (e) {
        try {
          var sansserif = fonts.SANSSERIF[id]['font-name'];
          return sansserif;
        } catch (e) {
          try {
            var display = fonts.DISPLAY[id]['font-name'];
            return display;
          } catch (e) {
            try {
              var handwriting = fonts.HANDWRITING[id]['font-name'];
              return handwriting;
            } catch (e) {
              return null;
            }
          }
        }
      }
    }

    /**
     * @name GetTextAling
     * @param {Int} valor entre 0 e 2
     * @desc Retorna o alinhamento de acordo com o numero
     * @returns {String} right, left, center ou left
     * @memberOf Controllers.ConfigurarConvite2
     */
    function GetTextAling(index) {
      var retorno = '';
      switch (index) {
        case '2': retorno = 'right'; break;
        case '0': retorno = 'left'; break;
        case '1': retorno = 'center'; break;
        default: retorno = 'left'; break;
      }
      return retorno;
    }

    /**
     * @name HasSend
     * @desc Verifica se um dos noivos ja enviou os convites.
     * @memberOf Controllers.ConfigurarConvite2
     */
    function HasSend() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarEstatisticaCasamento';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var numConvites = parseInt($(respXml).find('total_convites_enviados_apenas_cerimonia').text());

        if (numConvites > 0) {
          self.enableEditor = false;
        }
      }).catch(function (error) {
        console.error('HasSend -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

    /**
     * @name InMemorian
     * @param {String} itIs true ou false
     * @desc Force uma cruz em html
     * @returns {String} retorna o codigo html para a cruz
     * @memberOf Controllers.ConfigurarConvite2
     */
    function InMemorian(itIs) {
      if (itIs === 'true') {
        return ' &#10013;';
      } else {
        return ' ';
      }
    }

    /**
    * @name SalvarConvite
    * @desc Salva o convite selecionado e direciona o usuario para a edição
    * @memberOf Controllers.ConfigurarConvite2
    */
    function SalvarConvite() {
      $('#myModal').modal('hide');
      UserService.dados.modeloConvite = 'convite' + idConvite;
      UserService.SaveState();
      $location.path('/personalizar-convite');
    }

    /**
    * @name SetConvite
    * @param {Int} id ID do convite
    * @param {String} nome nome do convite
    * @param {String} url caminho da imagem do convite
    * @desc Armazena os dados do convite quando o usuario clica do thumb, para ser mostrado no modal
    * @memberOf Controllers.ConfigurarConvite2
    */
    function SetConvite(id, nome, url) {
      self.thumbNome = nome;
      self.thumbEscolhido = url;
      idConvite = id;
    }

    /**
      * @name SetMsg
      * @desc Configura o conteudo de cada bloco.
      * @memberOf Controllers.ConfigurarConvite2
      */
    function SetMsg() {
      var casamento = dataCasamento.split('/');
      var dataCasamentoAux = casamento[1] + '/' + casamento[0] + '/' + casamento[2];

      self.conteudoMsg1 = $sce.trustAsHtml('convidam para a cerimônia de casamento dos seus filhos');
      self.conteudoMsg2 = $sce.trustAsHtml('a realizar-se às ' + $filter('twoDigits')(cerimoniaHora) + ':' + $filter('twoDigits')(cerimoniaMin) + ' horas, dia ' + dataCasamentoAux + ', ' + cerimoniaLocal);

      self.conteudoMsg4 = $sce.trustAsHtml('Cerimônia: <br> ' + cerimoniaLocal + ' <br> ' + cerimoniaEnd + ', ' + cerimoniaNumero + ' - ' + cerimoniaBairro + ' ' + cerimoniaCidade);

      self.conteudoNomecasal = $sce.trustAsHtml(nomeNoiva + ' &#38; ' + nomeNoivo);

      self.conteudoPaisNoiva = $sce.trustAsHtml(
        noivaPai + InMemorian(noivaPaiMemorian) + ' <br> ' +
        noivaMae + InMemorian(noivaMaeMemorian)
      );

      self.conteudoPaisNoivo = $sce.trustAsHtml(
        noivoPai + InMemorian(noivoPaiMemorian) + ' <br> ' +
        noivoMae + InMemorian(noivoMaeMemorian)
      );
    }
  }
})();