angular.module("dashboard").controller('personalizar_convite', ['$http', '$sce', '$route', '$filter', 'UserService', 'ServiceCasamento', 'ipService', function ($http, $sce, $route, $filter, UserService, ServiceCasamento, ipService) {

  var self = this;
  var ID = UserService.dados.ID;

  var data_casamento = UserService.dados.dataCasamento;
  var cerimonia_hora = UserService.dados.cerimonia_hora;
  var cerimonia_min = UserService.dados.cerimonia_min;
  var cerimonia_local = UserService.dados.cerimonia_local;
  var cerimonia_end = UserService.dados.cerimonia_end;
  var cerimonia_numero = UserService.dados.cerimonia_numero;
  var cerimonia_bairro = UserService.dados.cerimonia_bairro;
  var cerimonia_cidade = UserService.dados.cerimonia_cidade;
  var nome_noiva = UserService.dados.nomeNoiva;
  var nome_noivo = UserService.dados.nomeNoivo;
  var noiva_pai = UserService.dados.noiva_pai;
  var noiva_pai_memorian = UserService.dados.noiva_pai_memorian;
  var noiva_mae = UserService.dados.noiva_mae;
  var noiva_mae_memorian = UserService.dados.noiva_mae_memorian;
  var noivo_pai = UserService.dados.noivo_pai;
  var noivo_pai_memorian = UserService.dados.noivo_pai_memorian;
  var noivo_mae = UserService.dados.noivo_mae;
  var noivo_mae_memorian = UserService.dados.noivo_mae_memorian;

  self.layoutSelecionado = './image/convites/convite1.png';
  self.bloco_msg_personalizada = "Este é um texto de referência para a mensagem do seu convite. Para editá-lo clique aqui e reescreva. Se você optar por não ter nenhuma mensagem, basta selecionar o texto e deletar.";
  self.convites = UserService.dados.listaConvites;
  self.fonts = UserService.dados.listaFonts;
  self.styleHold = [];
  self.cerregando = true;

  /**
   * troca <br> por #
   * O servico nao reconhece <br>
  */
  self.changeBr = function (text) {
    var res = text.replace(/<br>/g, "#");

    return res;
  };

  // Esconde o painel lateral quando chega perto do radepe
  $(window).scroll(function () {
    try {
      var elementoffset = $('#convites_layout').offset();
      if ($(this).scrollTop() < elementoffset.top - 200) {
        $('.controll').fadeIn(10);

      } else {
        $('.controll').fadeOut(10);
      }
    }
    catch (error) { }
  });

  //retorna uma cruz em html
  self.inMemorian = function (itIs) {
    if (itIs == 'true') {
      return " &#10013;";
    } else {
      return " ";
    }
  };

  //O servico so aceita numero para o alinhamento. Essa funcao faz a conversao
  self.getTextAlingIndice = function (texto) {
    var retorno = '';

    switch (texto) {
      case "right": retorno = 2; break;
      case "left": retorno = 0; break;
      case "center": retorno = 1; break;
      default: retorno = 0; break;
    }
    return retorno;
  };

  self.getTextAling = function (index) {
    var retorno = '';

    switch (index) {
      case '2': retorno = "right"; break;
      case '0': retorno = "left"; break;
      case '1': retorno = "center"; break;
      default: retorno = "left"; break;
    }

    return retorno;
  };

  //pega a font baseado no id fornecido
  self.getFonte = function (id) {

    try {
      var serif = self.fonts['SERIF'][id]['font-name'];
      return serif;
    } catch (e) {
      try {
        var sansserif = self.fonts['SANSSERIF'][id]['font-name'];
        return sansserif;
      } catch (e) {
        try {
          var display = self.fonts['DISPLAY'][id]['font-name'];
          return display;
        } catch (e) {
          try {
            var handwriting = self.fonts['HANDWRITING'][id]['font-name'];
            return handwriting;
          } catch (e) {
            return null;
          }
        }
      }
    }
  };
  // set font family do bloco
  self.setFontToBloco = function (font, idFont) {
    //Formata o bloco atual
    $('.' + self.styleHold).css('font-family', font);

    //lista de convites -> numero do convte selecionado -> bloco -> estilo da font
    self.convites[self.convite_individual][self.styleHold]['font-family'] = font;

    //Salva o id para ser enviado ao servidor
    UserService.dados[self.styleHold]['font-family'] = idFont;
  };

  //O servico nao reconhece px. Essa funcao retira o px, para poder enviar ao servidor
  self.removePx = function (texto) {
    var retorno = '';

    retorno = texto.toString().split('px');

    return retorno[0];
  };

  // gerencia qual bloco esta ativo para edicao
  self.showBlocos = [
    { "ativo": true },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false }
  ];

  // ativa o bloco quando clicado
  self.setBlocoActive = function (index) {
    for (var i = 0; i < self.showBlocos.length; i++) {
      self.showBlocos[i]['ativo'] = false;
    }
    self.showBlocos[index]["ativo"] = true;
  };

  //recebe o style dos blocos;
  self.bloco_pais_noiva;
  self.bloco_pais_noivo;
  self.bloco_msg_1;
  self.bloco_nome_dos_noivos;
  self.bloco_msg_2;
  self.bloco_msg_personalizada_style;
  self.bloco_cerimonia;

  //mensagens
  self.setMsg = function () {

    var casamento = data_casamento.split("/");
    var dataCasamento = casamento[1] + "/" + casamento[0] + "/" + casamento[2];

    self.conteudo_msg1 = $sce.trustAsHtml("convidam para a cerimônia de casamento dos seus filhos");
    self.conteudo_msg2 = $sce.trustAsHtml("a realizar-se às " + $filter("twoDigits")(cerimonia_hora) + ":" + $filter("twoDigits")(cerimonia_min) + " horas, dia " + dataCasamento + ", " + cerimonia_local);

    self.conteudo_msg4 = $sce.trustAsHtml("Cerimônia: <br> " + cerimonia_local + " <br> " + cerimonia_end + ", " + cerimonia_numero + " - " + cerimonia_bairro + " " + cerimonia_cidade);

    self.conteudo_nomecasal = $sce.trustAsHtml(nome_noiva + " &#38; " + nome_noivo);

    self.conteudo_pais_noiva = $sce.trustAsHtml(
      noiva_pai + self.inMemorian(noiva_pai_memorian)
      + " <br> " +
      noiva_mae + self.inMemorian(noiva_mae_memorian)
    );

    self.conteudo_pais_noivo = $sce.trustAsHtml(
      noivo_pai + self.inMemorian(noivo_pai_memorian)
      + " <br> " +
      noivo_mae + self.inMemorian(noivo_mae_memorian)
    );
  };


  /*indice da lista de convites.
  * Define qual convite o sistema vai pegar as informacoes dos blocos
  */
  self.convite_individual;

  //configura a imagem do convite,pega a posicao dos blocos e aplica
  self.setConvite = function (convite, imagem) {
    self.layoutSelecionado = imagem;
    self.convite_individual = convite;
    var bloco = self.convites[convite];

    self.bloco_pais_noiva = bloco.bloco_pais_noiva;
    self.bloco_pais_noivo = bloco.bloco_pais_noivo;
    self.bloco_msg_1 = bloco.bloco_msg_1;
    self.bloco_nome_dos_noivos = bloco.bloco_nome_dos_noivos;
    self.bloco_msg_2 = bloco.bloco_msg_2;
    self.bloco_msg_personalizada_style = bloco.bloco_msg_personalizada_style;
    self.bloco_cerimonia = bloco.bloco_cerimonia;

  };

  // pega os dados do servidor
  self.getConfiguracaoConvite = function () {
    self.cerregando = true;
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarFormatacaoConvite";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      resp = $.parseXML(resp);
      var modelo = $(resp).find('id_modelo').text();

      self.setMsg();

      if (modelo == '0') {
        self.setConvite('convite1', './image/convites/convite1.png');
        self.setConfiguracaoConvite();
      } else {
        self.setConvite('convite' + modelo + '', './image/convites/convite' + modelo + '.png');

        self.bloco_msg_1["text-align"] = self.getTextAling($(resp).find('alinhamento_msg1').text());
        self.bloco_msg_2["text-align"] = self.getTextAling($(resp).find('alinhamento_msg2').text());
        self.bloco_msg_personalizada_style["text-align"] = self.getTextAling($(resp).find('alinhamento_msg3').text());
        self.bloco_cerimonia["text-align"] = self.getTextAling($(resp).find('alinhamento_msg4').text());
        self.bloco_nome_dos_noivos["text-align"] = self.getTextAling($(resp).find('alinhamento_nomecasal').text());
        self.bloco_pais_noiva["text-align"] = self.getTextAling($(resp).find('alinhamento_pais_noiva').text());
        self.bloco_pais_noivo["text-align"] = self.getTextAling($(resp).find('alinhamento_pais_noivo').text());
        self.bloco_msg_1["color"] = $(resp).find('cor_msg1').text();
        self.bloco_msg_2["color"] = $(resp).find('cor_msg2').text();
        self.bloco_msg_personalizada_style["color"] = $(resp).find('cor_msg3').text();
        self.bloco_cerimonia["color"] = $(resp).find('cor_msg4').text();
        self.bloco_nome_dos_noivos["color"] = $(resp).find('cor_nomecasal').text();
        self.bloco_pais_noiva["color"] = $(resp).find('cor_pais_noiva').text();
        self.bloco_pais_noivo["color"] = $(resp).find('cor_pais_noivo').text();
        self.bloco_msg_1["font-family"] = self.getFonte($(resp).find('fonte_msg1').text());
        self.bloco_msg_2["font-family"] = self.getFonte($(resp).find('fonte_msg2').text());
        self.bloco_msg_personalizada_style["font-family"] = self.getFonte($(resp).find('fonte_msg3').text());
        self.bloco_cerimonia["font-family"] = self.getFonte($(resp).find('fonte_msg4').text());
        self.bloco_nome_dos_noivos["font-family"] = self.getFonte($(resp).find('fonte_nomecasal').text());
        self.bloco_pais_noiva["font-family"] = self.getFonte($(resp).find('fonte_pais_noiva').text());
        self.bloco_pais_noivo["font-family"] = self.getFonte($(resp).find('fonte_pais_noivo').text());
        self.bloco_msg_1["font-size"] = $(resp).find('tamanho_fonte_msg1').text();
        self.bloco_msg_2["font-size"] = $(resp).find('tamanho_fonte_msg2').text();
        self.bloco_msg_personalizada_style["font-size"] = $(resp).find('tamanho_fonte_msg3').text();
        self.bloco_cerimonia["font-size"] = $(resp).find('tamanho_fonte_msg4').text();
        self.bloco_nome_dos_noivos["font-size"] = $(resp).find('tamanho_nomecasal').text();
        self.bloco_pais_noiva["font-size"] = $(resp).find('tamanho_fonte_pais_noiva').text();
        self.bloco_pais_noivo["font-size"] = $(resp).find('tamanho_fonte_pais_noivo').text();

        self.bloco_msg_personalizada = $(resp).find('conteudo_msg3').text();

        UserService.dados.bloco_msg_1['font-family'] = $(resp).find('fonte_msg1').text();
        UserService.dados.bloco_msg_2['font-family'] = $(resp).find('fonte_msg2').text();
        UserService.dados.bloco_msg_personalizada_style['font-family'] = $(resp).find('fonte_msg3').text();
        UserService.dados.bloco_cerimonia['font-family'] = $(resp).find('fonte_msg4').text();
        UserService.dados.bloco_nome_dos_noivos['font-family'] = $(resp).find('fonte_nomecasal').text();
        UserService.dados.bloco_pais_noiva['font-family'] = $(resp).find('fonte_pais_noiva').text();
        UserService.dados.bloco_pais_noivo['font-family'] = $(resp).find('fonte_pais_noivo').text();
      }
      self.cerregando = false;
    });
  };

  self.setConfiguracaoConvite = function () {
    var aux = self.convite_individual.split("convite");
    var modelo = aux[1];
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/FormatacaoConvite";

    var alinhamento_msg1 = self.getTextAlingIndice(self.bloco_msg_1["text-align"]);
    var alinhamento_msg2 = self.getTextAlingIndice(self.bloco_msg_2["text-align"]);
    var alinhamento_msg3 = self.getTextAlingIndice(self.bloco_msg_personalizada_style["text-align"]);
    var alinhamento_msg4 = self.getTextAlingIndice(self.bloco_cerimonia["text-align"]);
    var alinhamento_nomecasal = self.getTextAlingIndice(self.bloco_nome_dos_noivos["text-align"]);
    var alinhamento_pais_noiva = self.getTextAlingIndice(self.bloco_pais_noiva["text-align"]);
    var alinhamento_pais_noivo = self.getTextAlingIndice(self.bloco_pais_noivo["text-align"]);

    var conteudo_msg1 = self.changeBr(self.conteudo_msg1.toString());
    var conteudo_msg2 = self.changeBr(self.conteudo_msg2.toString());
    var conteudo_msg3 = self.changeBr(self.bloco_msg_personalizada.toString());
    var conteudo_msg4 = self.changeBr(self.conteudo_msg4.toString());
    var conteudo_nomecasal = nome_noiva + ' &#38; ' + nome_noivo;
    var conteudo_pais_noiva = noiva_pai + '#' + noiva_mae;
    var conteudo_pais_noivo = noivo_pai + '#' + noivo_mae;

    var cor_msg1 = self.bloco_msg_1["color"];
    var cor_msg2 = self.bloco_msg_2["color"];
    var cor_msg3 = self.bloco_msg_personalizada_style["color"];
    var cor_msg4 = self.bloco_cerimonia["color"];
    var cor_nomecasal = self.bloco_nome_dos_noivos["color"];
    var cor_pais_noiva = self.bloco_pais_noiva["color"];
    var cor_pais_noivo = self.bloco_pais_noivo["color"];

    var fonte_msg1 = UserService.dados.bloco_msg_1['font-family'];
    var fonte_msg2 = UserService.dados.bloco_msg_2['font-family'];
    var fonte_msg3 = UserService.dados.bloco_msg_personalizada_style['font-family'];
    var fonte_msg4 = UserService.dados.bloco_cerimonia['font-family'];
    var fonte_nomecasal = UserService.dados.bloco_nome_dos_noivos['font-family'];
    var fonte_pais_noiva = UserService.dados.bloco_pais_noiva['font-family'];
    var fonte_pais_noivo = UserService.dados.bloco_pais_noivo['font-family'];

    var tamanho_fonte_msg1 = self.removePx(self.bloco_msg_1["font-size"]);
    var tamanho_fonte_msg2 = self.removePx(self.bloco_msg_2["font-size"]);
    var tamanho_fonte_msg3 = self.removePx(self.bloco_msg_personalizada_style["font-size"]);
    var tamanho_fonte_msg4 = self.removePx(self.bloco_cerimonia["font-size"]);
    var tamanho_fonte_pais_noiva = self.removePx(self.bloco_pais_noiva["font-size"]);
    var tamanho_fonte_pais_noivo = self.removePx(self.bloco_pais_noivo["font-size"]);
    var tamanho_nomecasal = self.removePx(self.bloco_nome_dos_noivos["font-size"]);

    var xmlVar = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>' + alinhamento_msg1 + '</alinhamento_msg1><alinhamento_msg2>' + alinhamento_msg2 + '</alinhamento_msg2><alinhamento_msg3>' + alinhamento_msg3 + '</alinhamento_msg3><alinhamento_msg4>' + alinhamento_msg4 + '</alinhamento_msg4><alinhamento_nomecasal>' + alinhamento_nomecasal + '</alinhamento_nomecasal><alinhamento_pais_noiva>' + alinhamento_pais_noiva + '</alinhamento_pais_noiva><alinhamento_pais_noivo>' + alinhamento_pais_noivo + '</alinhamento_pais_noivo>';

    xmlVar += '<conteudo_msg1>' + conteudo_msg1 + '</conteudo_msg1><conteudo_msg2>' + conteudo_msg2 + '</conteudo_msg2><conteudo_msg3>' + conteudo_msg3 + '</conteudo_msg3><conteudo_msg4>' + conteudo_msg4 + '</conteudo_msg4><conteudo_nomecasal>' + conteudo_nomecasal + '</conteudo_nomecasal><conteudo_pais_noiva>' + conteudo_pais_noiva + '</conteudo_pais_noiva><conteudo_pais_noivo>' + conteudo_pais_noivo + '</conteudo_pais_noivo>';

    xmlVar += '<cor_msg1>' + cor_msg1 + '</cor_msg1><cor_msg2>' + cor_msg2 + '</cor_msg2><cor_msg3>' + cor_msg3 + '</cor_msg3><cor_msg4>' + cor_msg4 + '</cor_msg4><cor_nomecasal>' + cor_nomecasal + '</cor_nomecasal><cor_pais_noiva>' + cor_pais_noiva + '</cor_pais_noiva><cor_pais_noivo>' + cor_pais_noivo + '</cor_pais_noivo>';

    xmlVar += '<fonte_msg1>' + fonte_msg1 + '</fonte_msg1> <fonte_msg2>' + fonte_msg2 + '</fonte_msg2> <fonte_msg3>' + fonte_msg3 + '</fonte_msg3> <fonte_msg4>' + fonte_msg4 + '</fonte_msg4> <fonte_nomecasal>' + fonte_nomecasal + '</fonte_nomecasal> <fonte_pais_noiva>' + fonte_pais_noiva + '</fonte_pais_noiva> <fonte_pais_noivo>' + fonte_pais_noivo + '</fonte_pais_noivo>';

    xmlVar += ' <id_casal>' + ID + '</id_casal> <id_modelo>' + modelo + '</id_modelo>';

    xmlVar += ' <tamanho_fonte_msg1>' + tamanho_fonte_msg1 + '</tamanho_fonte_msg1> <tamanho_fonte_msg2>' + tamanho_fonte_msg2 + '</tamanho_fonte_msg2> <tamanho_fonte_msg3>' + tamanho_fonte_msg3 + '</tamanho_fonte_msg3> <tamanho_fonte_msg4>' + tamanho_fonte_msg4 + '</tamanho_fonte_msg4> <tamanho_fonte_pais_noiva>' + tamanho_fonte_pais_noiva + '</tamanho_fonte_pais_noiva> <tamanho_fonte_pais_noivo>' + tamanho_fonte_pais_noivo + '</tamanho_fonte_pais_noivo> <tamanho_nomecasal>' + tamanho_nomecasal + '</tamanho_nomecasal></DadosFormatacaoConvite > ';

    ServiceCasamento.SendData(urlVar, xmlVar);
  };
  self.getConfiguracaoConvite();

}]);