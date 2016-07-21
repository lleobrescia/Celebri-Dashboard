/**
 * Personalizar Convite Controller
 * controllerAs: 'personalizarCtrl'
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('personalizar_convite', PersonalizarConvite);

  PersonalizarConvite.$inject = ['$sce', '$filter', 'UserService', 'ServiceCasamento', 'ipService'];

  /**
   * @namespace PersonalizarConvite
   * @desc Personalização do convite
   * @memberOf Controllers
   */
  function PersonalizarConvite($sce, $filter, UserService, ServiceCasamento, ipService) {

    var self = this;
    var ID = UserService.dados.ID;
    var conviteCriado = UserService.dados.conviteCriado;
    var dataCasamento = UserService.dados.dataCasamento;
    var cerimoniaHora = UserService.dados.cerimoniaHora;
    var cerimoniaMin = UserService.dados.cerimoniaMin;
    var cerimoniaLocal = UserService.dados.cerimoniaLocal;
    var cerimoniaEnd = UserService.dados.cerimoniaEnd;
    var cerimoniaNumero = UserService.dados.cerimoniaNumero;
    var cerimoniaBairro = UserService.dados.cerimoniaBairro;
    var cerimoniaCidade = UserService.dados.cerimoniaCidade;
    var nomeNoiva = UserService.dados.nomeNoiva;
    var nomeNoivo = UserService.dados.nomeNoivo;
    var noivaPai = UserService.dados.noivaPai;
    var noivaPaiMemorian = UserService.dados.noivaPaiMemorian;
    var noivaMae = UserService.dados.noivaMae;
    var noivaMaeMemorian = UserService.dados.noivaMaeMemorian;
    var noivoPai = UserService.dados.noivoPai;
    var noivoPaiMemorian = UserService.dados.noivoPaiMemorian;
    var noivoMae = UserService.dados.noivoMae;
    var noivoMaeMemorian = UserService.dados.noivoMaeMemorian;

    self.conviteIndividual = UserService.dados.modeloConvite;
    self.layoutSelecionado = './image/convites/' + self.conviteIndividual + '.png';
    self.blocoMsgPersonalizada = 'Este é um texto de referência para a mensagem do seu convite. Para editá-lo clique aqui e reescreva. Se você optar por não ter nenhuma mensagem, basta selecionar o texto e deletar.';
    self.convites = UserService.dados.listaConvites;
    self.fonts = UserService.dados.listaFonts;
    self.styleHold = [];
    self.cerregando = true;
    self.showBlocos = [
      { 'ativo': true },
      { 'ativo': true },
      { 'ativo': true },
      { 'ativo': true },
      { 'ativo': true },
      { 'ativo': true },
      { 'ativo': true }
    ];

    self.SetFontToBloco = SetFontToBloco;
    self.SetBlocoActive = SetBlocoActive;
    self.SetConfiguracaoConvite = SetConfiguracaoConvite;

    GetConfiguracaoConvite();

    /**
     * @name ChangeBr
     * @param {String} text conteudo do bloco
     * @desc O servidor nao reconhece <br>, portanto eh preciso alterar para #
     * @returns {String}
     * @memberOf Controllers.PersonalizarConvite
     */
    function ChangeBr(text) {
      var res = text.replace(/<br>/g, '#');
      return res;
    }

    /**
     * @name GetConfiguracaoConvite
     * @desc Init
     * @memberOf Controllers.PersonalizarConvite
     */
    function GetConfiguracaoConvite() {
      self.cerregando = true;
      SetMsg();
      SetConvite();

      if (conviteCriado) {
        GetLocal();

      } else {
        self.SetConfiguracaoConvite();
      }

      self.cerregando = false;
      self.SetBlocoActive(0);
    }

    /**
     * @name GetLocal
     * @desc Carrega as configuracoes do convite salvas locamente
     * @memberOf Controllers.PersonalizarConvite
     */
    function GetLocal() {
      self.blocoMsg1['text-align'] = UserService.dados.blocoMsg1['text-align'];
      self.blocoMsg2['text-align'] = UserService.dados.blocoMsg2['text-align'];
      self.blocoMsgPersonalizadaStyle['text-align'] = UserService.dados.blocoMsgPersonalizadaStyle['text-align'];
      self.blocoCerimonia['text-align'] = UserService.dados.blocoCerimonia['text-align'];
      self.blocoNomeNoivos['text-align'] = UserService.dados.blocoNomeNoivos['text-align'];
      self.blocoPaisNoiva['text-align'] = UserService.dados.blocoPaisNoiva['text-align'];
      self.blocoPaisNoivo['text-align'] = UserService.dados.blocoPaisNoivo['text-align'];

      self.blocoMsg1.color = UserService.dados.blocoMsg1.color;
      self.blocoMsg2.color = UserService.dados.blocoMsg2.color;
      self.blocoMsgPersonalizadaStyle.color = UserService.dados.blocoMsgPersonalizadaStyle.color;
      self.blocoCerimonia.color = UserService.dados.blocoCerimonia.color;
      self.blocoNomeNoivos.color = UserService.dados.blocoNomeNoivos.color;
      self.blocoPaisNoiva.color = UserService.dados.blocoPaisNoiva.color;
      self.blocoPaisNoivo.color = UserService.dados.blocoPaisNoivo.color;

      self.blocoMsg1['font-family'] = UserService.dados.blocoMsg1['font-family'];
      self.blocoMsg2['font-family'] = UserService.dados.blocoMsg2['font-family'];
      self.blocoMsgPersonalizadaStyle['font-family'] = UserService.dados.blocoMsgPersonalizadaStyle['font-family'];
      self.blocoCerimonia['font-family'] = UserService.dados.blocoCerimonia['font-family'];
      self.blocoNomeNoivos['font-family'] = UserService.dados.blocoNomeNoivos['font-family'];
      self.blocoPaisNoiva['font-family'] = UserService.dados.blocoPaisNoiva['font-family'];
      self.blocoPaisNoivo['font-family'] = UserService.dados.blocoPaisNoivo['font-family'];

      self.blocoMsg1['font-size'] = RemovePx(UserService.dados.blocoMsg1['font-size']);
      self.blocoMsg2['font-size'] = RemovePx(UserService.dados.blocoMsg2['font-size']);
      self.blocoMsgPersonalizadaStyle['font-size'] = RemovePx(UserService.dados.blocoMsgPersonalizadaStyle['font-size']);
      self.blocoCerimonia['font-size'] = RemovePx(UserService.dados.blocoCerimonia['font-size']);
      self.blocoNomeNoivos['font-size'] = RemovePx(UserService.dados.blocoNomeNoivos['font-size']);
      self.blocoPaisNoiva['font-size'] = RemovePx(UserService.dados.blocoPaisNoiva['font-size']);
      self.blocoPaisNoivo['font-size'] = RemovePx(UserService.dados.blocoPaisNoivo['font-size']);

      self.blocoMsgPersonalizada = $sce.trustAsHtml(UserService.dados.blocoMsgPersonalizadaStyle.conteudo);
    }

    /**
     * @name GetTextAlingIndice
     * @param {String} texto alinhamento do texto(right,left,center)
     * @desc Converte o alinhamento do texto do bloco em indice, para salvar no servidor
     * @returns {Int}
     * @memberOf Controllers.PersonalizarConvite
     */
    function GetTextAlingIndice(texto) {
      var retorno = '';

      switch (texto) {
        case 'right': retorno = 2; break;
        case 'left': retorno = 0; break;
        case 'center': retorno = 1; break;
        default: retorno = 0; break;
      }
      return retorno;
    }

    /**
      * @name SalvarConvite
      * @desc Salva o convite selecionado e direciona o usuario para a edição
      * @memberOf Controllers.PersonalizarConvite
      */
    function InMemorian(itIs) {
      if (itIs === 'true') {
        return ' &#10013;';
      } else {
        return ' ';
      }
    }

    /**
     * @name RemovePx
     * @param {String} texto
     * @desc Remove o px do tamanho das fonts
     * @returns {String}
     * @memberOf Controllers.PersonalizarConvite
     */
    function RemovePx(texto) {
      return texto.toString().split('px')[0];
    }

    /**
     * @name SetBlocoActive
     * @param {int} index id do bloco
     * @desc Marca como ativo o bloco indicado pelo index
     * @memberOf Controllers.PersonalizarConvite
     */
    function SetBlocoActive(index) {
      for (var i = 0; i < self.showBlocos.length; i++) {
        self.showBlocos[i].ativo = false;
      }
      self.showBlocos[index].ativo = true;
    }

    /**
      * @name SetConfiguracaoConvite
      * @desc Salva a configuracao do convite no servidor e locamente
      * @memberOf Controllers.PersonalizarConvite
      */
    function SetConfiguracaoConvite() {

      var aux = self.conviteIndividual.split('convite');
      var modelo = aux[1];
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/FormatacaoConvite';

      var alinhamentoMsg1 =
        UserService.dados.blocoMsg1['text-align'] =
        GetTextAlingIndice(self.blocoMsg1['text-align']);
      var alinhamentoMsg2 =
        UserService.dados.blocoMsg2['text-align'] =
        GetTextAlingIndice(self.blocoMsg2['text-align']);
      var alinhamentoMsg3 =
        UserService.dados.blocoMsgPersonalizadaStyle['text-align'] =
        GetTextAlingIndice(self.blocoMsgPersonalizadaStyle['text-align']);
      var alinhamentoMsg4 =
        UserService.dados.blocoCerimonia['text-align'] =
        GetTextAlingIndice(self.blocoCerimonia['text-align']);
      var alinhamentoNomeCasal =
        UserService.dados.blocoNomeNoivos['text-align'] =
        GetTextAlingIndice(self.blocoNomeNoivos['text-align']);
      var alinhamentoPaisNoiva =
        UserService.dados.blocoPaisNoiva['text-align'] =
        GetTextAlingIndice(self.blocoPaisNoiva['text-align']);
      var alinhamentoPaisNoivo =
        UserService.dados.blocoPaisNoivo['text-align'] =
        GetTextAlingIndice(self.blocoPaisNoivo['text-align']);

      var conteudoMsg1 = ChangeBr(self.conteudoMsg1.toString());
      var conteudoMsg2 = ChangeBr(self.conteudoMsg2.toString());
      var conteudoMsg3 = ChangeBr(self.blocoMsgPersonalizada.toString());
      var conteudoMsg4 = ChangeBr(self.conteudoMsg4.toString());
      var conteudoNomeCasal = nomeNoiva + ' &#38; ' + nomeNoivo;
      var conteudoPaisNoiva = noivaPai + '#' + noivaMae;
      var conteudoPaisNoivo = noivoPai + '#' + noivoMae;

      var corMsg1 =
        UserService.dados.blocoMsg1.color =
        self.blocoMsg1.color;
      var corMsg2 =
        UserService.dados.blocoMsg2.color =
        self.blocoMsg2.color;
      var corMsg3 =
        UserService.dados.blocoMsgPersonalizadaStyle.color =
        self.blocoMsgPersonalizadaStyle.color;
      var corMsg4 =
        UserService.dados.blocoCerimonia.color =
        self.blocoCerimonia.color;
      var corNomeCasal =
        UserService.dados.blocoNomeNoivos.color =
        self.blocoNomeNoivos.color;
      var corPaisNoiva =
        UserService.dados.blocoPaisNoiva.color =
        self.blocoPaisNoiva.color;
      var corPaisNoivo =
        UserService.dados.blocoPaisNoivo.color =
        self.blocoPaisNoivo.color;

      var fonteMsg1 = UserService.dados.blocoMsg1['font-id'];
      var fonteMsg2 = UserService.dados.blocoMsg2['font-id'];
      var fonteMsg3 = UserService.dados.blocoMsgPersonalizadaStyle['font-id'];
      var fonteMsg4 = UserService.dados.blocoCerimonia['font-id'];
      var fonteNomeCasal = UserService.dados.blocoNomeNoivos['font-id'];
      var fontePaisNoiva = UserService.dados.blocoPaisNoiva['font-id'];
      var fontePaisNoivo = UserService.dados.blocoPaisNoivo['font-id'];

      var tamanhoFonteMsg1 = RemovePx(self.blocoMsg1['font-size']);
      var tamanhoFonteMsg2 = RemovePx(self.blocoMsg2['font-size']);
      var tamanhoFonteMsg3 = RemovePx(self.blocoMsgPersonalizadaStyle['font-size']);
      var tamanhoFonteMsg4 = RemovePx(self.blocoCerimonia['font-size']);
      var tamanhoFontePaisNoiva = RemovePx(self.blocoPaisNoiva['font-size']);
      var tamanhoFontePaisNoivo = RemovePx(self.blocoPaisNoivo['font-size']);
      var tamanhoNomeCasal = RemovePx(self.blocoNomeNoivos['font-size']);

      UserService.dados.blocoMsg1['font-size'] = self.blocoMsg1['font-size'];
      UserService.dados.blocoMsg2['font-size'] = self.blocoMsg2['font-size'];
      UserService.dados.blocoMsgPersonalizadaStyle['font-size'] = self.blocoMsgPersonalizadaStyle['font-size'];
      UserService.dados.blocoCerimonia['font-size'] = self.blocoCerimonia['font-size'];
      UserService.dados.blocoNomeNoivos['font-size'] = self.blocoPaisNoiva['font-size'];
      UserService.dados.blocoPaisNoiva['font-size'] = self.blocoPaisNoivo['font-size'];
      UserService.dados.blocoPaisNoivo['font-size'] = self.blocoNomeNoivos['font-size'];

      UserService.SaveState();

      var xmlVar = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>' + alinhamentoMsg1 + '</alinhamento_msg1><alinhamento_msg2>' + alinhamentoMsg2 + '</alinhamento_msg2><alinhamento_msg3>' + alinhamentoMsg3 + '</alinhamento_msg3><alinhamento_msg4>' + alinhamentoMsg4 + '</alinhamento_msg4><alinhamento_nomecasal>' + alinhamentoNomeCasal + '</alinhamento_nomecasal><alinhamento_pais_noiva>' + alinhamentoPaisNoiva + '</alinhamento_pais_noiva><alinhamento_pais_noivo>' + alinhamentoPaisNoivo + '</alinhamento_pais_noivo>';

      xmlVar += '<conteudo_msg1>' + conteudoMsg1 + '</conteudo_msg1><conteudo_msg2>' + conteudoMsg2 + '</conteudo_msg2><conteudo_msg3>' + conteudoMsg3 + '</conteudo_msg3><conteudo_msg4>' + conteudoMsg4 + '</conteudo_msg4><conteudo_nomecasal>' + conteudoNomeCasal + '</conteudo_nomecasal><conteudo_pais_noiva>' + conteudoPaisNoiva + '</conteudo_pais_noiva><conteudo_pais_noivo>' + conteudoPaisNoivo + '</conteudo_pais_noivo>';

      xmlVar += '<cor_msg1>' + corMsg1 + '</cor_msg1><cor_msg2>' + corMsg2 + '</cor_msg2><cor_msg3>' + corMsg3 + '</cor_msg3><cor_msg4>' + corMsg4 + '</cor_msg4><cor_nomecasal>' + corNomeCasal + '</cor_nomecasal><cor_pais_noiva>' + corPaisNoiva + '</cor_pais_noiva><cor_pais_noivo>' + corPaisNoivo + '</cor_pais_noivo>';

      xmlVar += '<fonte_msg1>' + fonteMsg1 + '</fonte_msg1> <fonte_msg2>' + fonteMsg2 + '</fonte_msg2> <fonte_msg3>' + fonteMsg3 + '</fonte_msg3> <fonte_msg4>' + fonteMsg4 + '</fonte_msg4> <fonte_nomecasal>' + fonteNomeCasal + '</fonte_nomecasal> <fonte_pais_noiva>' + fontePaisNoiva + '</fonte_pais_noiva> <fonte_pais_noivo>' + fontePaisNoivo + '</fonte_pais_noivo>';

      xmlVar += ' <id_casal>' + ID + '</id_casal> <id_modelo>' + modelo + '</id_modelo>';

      xmlVar += ' <tamanho_fonte_msg1>' + tamanhoFonteMsg1 + '</tamanho_fonte_msg1> <tamanho_fonte_msg2>' + tamanhoFonteMsg2 + '</tamanho_fonte_msg2> <tamanho_fonte_msg3>' + tamanhoFonteMsg3 + '</tamanho_fonte_msg3> <tamanho_fonte_msg4>' + tamanhoFonteMsg4 + '</tamanho_fonte_msg4> <tamanho_fonte_pais_noiva>' + tamanhoFontePaisNoiva + '</tamanho_fonte_pais_noiva> <tamanho_fonte_pais_noivo>' + tamanhoFontePaisNoivo + '</tamanho_fonte_pais_noivo> <tamanho_nomecasal>' + tamanhoNomeCasal + '</tamanho_nomecasal></DadosFormatacaoConvite > ';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      });
    }

    /**
    * @name SetConvite
    * @desc Carrega o posicionamento dos blocos
    * @memberOf Controllers.PersonalizarConvite
    */
    function SetConvite() {
      var bloco = self.convites[self.conviteIndividual];

      self.blocoPaisNoiva = bloco.blocoPaisNoiva;
      self.blocoPaisNoivo = bloco.blocoPaisNoivo;
      self.blocoMsg1 = bloco.blocoMsg1;
      self.blocoNomeNoivos = bloco.blocoNomeNoivos;
      self.blocoMsg2 = bloco.blocoMsg2;
      self.blocoMsgPersonalizadaStyle = bloco.blocoMsgPersonalizadaStyle;
      self.blocoCerimonia = bloco.blocoCerimonia;
    }

    /**
    * @name SetFontToBloco
    * @desc Pega a fonte da lista de fontes e aplica no bloco que esta ativado
    * @param {int} idFont id da fonte
    * @param {String} font nome da fonte
    * @memberOf Controllers.PersonalizarConvite
    */
    function SetFontToBloco(font, idFont) {
      console.log('setfont');
      //Formata o bloco atual
      $('.' + self.styleHold).css('font-family', font);

      //lista de convites -> numero do convte selecionado -> bloco -> estilo da font
      self.convites[self.conviteIndividual][self.styleHold]['font-family'] = font;

      //Salva o id para ser enviado ao servidor
      UserService.dados[self.styleHold]['font-id'] = idFont;
      UserService.SaveState();
    }

    /**
      * @name SetMsg
      * @desc Configura o conteudo de cada bloco.
      * @memberOf Controllers.PersonalizarConvite
      */
    function SetMsg() {
      var casamento = dataCasamento.split('/');
      var dataCasamentoAux = casamento[1] + '/' + casamento[0] + '/' + casamento[2];

      self.conteudoMsg1 = $sce.trustAsHtml('convidam para a cerimônia de casamento dos seus filhos');
      self.conteudoMsg2 = $sce.trustAsHtml('a realizar-se às ' + $filter('twoDigits')(cerimoniaHora) + ':' + $filter('twoDigits')(cerimoniaMin) + ' horas, dia ' + dataCasamentoAux + ', ' + cerimoniaLocal);

      self.conteudoMsg4 = $sce.trustAsHtml('Cerimônia: <br> ' + cerimoniaLocal + ' <br> ' + cerimoniaEnd + ', ' + cerimoniaNumero + ' - ' + cerimoniaBairro + ' ' + cerimoniaCidade);

      self.conteudoNomeCasal = $sce.trustAsHtml(nomeNoiva + ' &#38; ' + nomeNoivo);

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