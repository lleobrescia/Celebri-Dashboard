angular.module("dashboard").controller('personalizar_convite', ['$sce', '$filter', 'UserService', 'ServiceCasamento', 'ipService', function ($sce, $filter, UserService, ServiceCasamento, ipService) {

  var self = this;
  var ID = UserService.dados.ID;
  var conviteCriado = UserService.dados.conviteCriado;

  /*indice da lista de convites.
  * Define qual convite o sistema vai pegar as informacoes dos blocos
  */
  self.convite_individual = UserService.dados.modeloConvite;

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

  self.layoutSelecionado = './image/convites/' + self.convite_individual + '.png';
  self.bloco_msg_personalizada = "Este é um texto de referência para a mensagem do seu convite. Para editá-lo clique aqui e reescreva. Se você optar por não ter nenhuma mensagem, basta selecionar o texto e deletar.";
  self.convites = UserService.dados.listaConvites;
  self.fonts = UserService.dados.listaFonts;
  self.styleHold = [];
  self.cerregando = true;

  function GetLocal() {
    self.bloco_msg_1["text-align"] = UserService.dados.bloco_msg_1["text-align"];
    self.bloco_msg_2["text-align"] = UserService.dados.bloco_msg_2["text-align"];
    self.bloco_msg_personalizada_style["text-align"] = UserService.dados.bloco_msg_personalizada_style["text-align"];
    self.bloco_cerimonia["text-align"] = UserService.dados.bloco_cerimonia["text-align"];
    self.bloco_nome_dos_noivos["text-align"] = UserService.dados.bloco_nome_dos_noivos["text-align"];
    self.bloco_pais_noiva["text-align"] = UserService.dados.bloco_pais_noiva["text-align"];
    self.bloco_pais_noivo["text-align"] = UserService.dados.bloco_pais_noivo["text-align"];

    self.bloco_msg_1.color = UserService.dados.bloco_msg_1.color;
    self.bloco_msg_2.color = UserService.dados.bloco_msg_2.color;
    self.bloco_msg_personalizada_style.color = UserService.dados.bloco_msg_personalizada_style.color;
    self.bloco_cerimonia.color = UserService.dados.bloco_cerimonia.color;
    self.bloco_nome_dos_noivos.color = UserService.dados.bloco_nome_dos_noivos.color;
    self.bloco_pais_noiva.color = UserService.dados.bloco_pais_noiva.color;
    self.bloco_pais_noivo.color = UserService.dados.bloco_pais_noivo.color;

    self.bloco_msg_1["font-family"] = UserService.dados.bloco_msg_1["font-family"];
    self.bloco_msg_2["font-family"] = UserService.dados.bloco_msg_2["font-family"];
    self.bloco_msg_personalizada_style["font-family"] = UserService.dados.bloco_msg_personalizada_style['font-family'];
    self.bloco_cerimonia["font-family"] = UserService.dados.bloco_cerimonia["font-family"];
    self.bloco_nome_dos_noivos["font-family"] = UserService.dados.bloco_nome_dos_noivos["font-family"];
    self.bloco_pais_noiva["font-family"] = UserService.dados.bloco_pais_noiva["font-family"];
    self.bloco_pais_noivo["font-family"] = UserService.dados.bloco_pais_noivo["font-family"];

    self.bloco_msg_1["font-size"] = self.removePx(UserService.dados.bloco_msg_1["font-size"]);
    self.bloco_msg_2["font-size"] = self.removePx(UserService.dados.bloco_msg_2["font-size"]);
    self.bloco_msg_personalizada_style["font-size"] = self.removePx(UserService.dados.bloco_msg_personalizada_style["font-size"]);
    self.bloco_cerimonia["font-size"] = self.removePx(UserService.dados.bloco_cerimonia["font-size"]);
    self.bloco_nome_dos_noivos["font-size"] = self.removePx(UserService.dados.bloco_nome_dos_noivos["font-size"]);
    self.bloco_pais_noiva["font-size"] = self.removePx(UserService.dados.bloco_pais_noiva["font-size"]);
    self.bloco_pais_noivo["font-size"] = self.removePx(UserService.dados.bloco_pais_noivo["font-size"]);

    self.bloco_msg_personalizada = $sce.trustAsHtml(UserService.dados.bloco_msg_personalizada_style.conteudo);
  }

  /**
   * troca <br> por #
   * O servico nao reconhece <br>
  */
  self.changeBr = function (text) {
    var res = text.replace(/<br>/g, "#");

    return res;
  };

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

  // set font family do bloco
  self.setFontToBloco = function (font, idFont) {
    //Formata o bloco atual
    $('.' + self.styleHold).css('font-family', font);

    //lista de convites -> numero do convte selecionado -> bloco -> estilo da font
    self.convites[self.convite_individual][self.styleHold]['font-family'] = font;

    //Salva o id para ser enviado ao servidor
    UserService.dados[self.styleHold]['font-id'] = idFont;
    UserService.SaveState();
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
    { "ativo": true },
    { "ativo": true },
    { "ativo": true },
    { "ativo": true },
    { "ativo": true },
    { "ativo": true }
  ];

  // ativa o bloco quando clicado
  self.setBlocoActive = function (index) {
    for (var i = 0; i < self.showBlocos.length; i++) {
      self.showBlocos[i].ativo = false;
    }
    self.showBlocos[index].ativo = true;
  };

  //mensagens
  self.setMsg = function () {

    var casamento = data_casamento.split("/");
    var dataCasamento = casamento[1] + "/" + casamento[0] + "/" + casamento[2];

    self.conteudo_msg1 = $sce.trustAsHtml("convidam para a cerimônia de casamento dos seus filhos");
    self.conteudo_msg2 = $sce.trustAsHtml("a realizar-se às " + $filter("twoDigits")(cerimonia_hora) + ":" + $filter("twoDigits")(cerimonia_min) + " horas, dia " + dataCasamento + ", " + cerimonia_local);

    self.conteudo_msg4 = $sce.trustAsHtml("Cerimônia: <br> " + cerimonia_local + " <br> " + cerimonia_end + ", " + cerimonia_numero + " - " + cerimonia_bairro + " " + cerimonia_cidade);

    self.conteudo_nomecasal = $sce.trustAsHtml(nome_noiva + " &#38; " + nome_noivo);

    self.conteudo_pais_noiva = $sce.trustAsHtml(
      noiva_pai + self.inMemorian(noiva_pai_memorian) + " <br> " +
      noiva_mae + self.inMemorian(noiva_mae_memorian)
    );

    self.conteudo_pais_noivo = $sce.trustAsHtml(
      noivo_pai + self.inMemorian(noivo_pai_memorian) + " <br> " +
      noivo_mae + self.inMemorian(noivo_mae_memorian)
    );
  };


  //Aplica a posicao dos blocos de acordo com o convite escolhido
  self.setConvite = function () {
    var bloco = self.convites[self.convite_individual];

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
    self.setMsg();
    self.setConvite();

    if (conviteCriado) {
      GetLocal();
    } else {
      self.setConfiguracaoConvite();
    }

    self.cerregando = false;
    self.setBlocoActive(0);
  };

  self.setConfiguracaoConvite = function () {
    var aux = self.convite_individual.split("convite");
    var modelo = aux[1];
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/FormatacaoConvite";

    var alinhamento_msg1 =
      UserService.dados.bloco_msg_1["text-align"] =
      self.getTextAlingIndice(self.bloco_msg_1["text-align"]);
    var alinhamento_msg2 =
      UserService.dados.bloco_msg_2["text-align"] =
      self.getTextAlingIndice(self.bloco_msg_2["text-align"]);
    var alinhamento_msg3 =
      UserService.dados.bloco_msg_personalizada_style["text-align"] =
      self.getTextAlingIndice(self.bloco_msg_personalizada_style["text-align"]);
    var alinhamento_msg4 =
      UserService.dados.bloco_cerimonia["text-align"] =
      self.getTextAlingIndice(self.bloco_cerimonia["text-align"]);
    var alinhamento_nomecasal =
      UserService.dados.bloco_nome_dos_noivos["text-align"] =
      self.getTextAlingIndice(self.bloco_nome_dos_noivos["text-align"]);
    var alinhamento_pais_noiva =
      UserService.dados.bloco_pais_noiva["text-align"] =
      self.getTextAlingIndice(self.bloco_pais_noiva["text-align"]);
    var alinhamento_pais_noivo =
      UserService.dados.bloco_pais_noivo["text-align"] =
      self.getTextAlingIndice(self.bloco_pais_noivo["text-align"]);

    var conteudo_msg1 = self.changeBr(self.conteudo_msg1.toString());
    var conteudo_msg2 = self.changeBr(self.conteudo_msg2.toString());
    var conteudo_msg3 = self.changeBr(self.bloco_msg_personalizada.toString());
    var conteudo_msg4 = self.changeBr(self.conteudo_msg4.toString());
    var conteudo_nomecasal = nome_noiva + ' &#38; ' + nome_noivo;
    var conteudo_pais_noiva = noiva_pai + '#' + noiva_mae;
    var conteudo_pais_noivo = noivo_pai + '#' + noivo_mae;

    var cor_msg1 =
      UserService.dados.bloco_msg_1.color =
      self.bloco_msg_1.color;
    var cor_msg2 =
      UserService.dados.bloco_msg_2.color =
      self.bloco_msg_2.color;
    var cor_msg3 =
      UserService.dados.bloco_msg_personalizada_style.color =
      self.bloco_msg_personalizada_style.color;
    var cor_msg4 =
      UserService.dados.bloco_cerimonia.color =
      self.bloco_cerimonia.color;
    var cor_nomecasal =
      UserService.dados.bloco_nome_dos_noivos.color =
      self.bloco_nome_dos_noivos.color;
    var cor_pais_noiva =
      UserService.dados.bloco_pais_noiva.color =
      self.bloco_pais_noiva.color;
    var cor_pais_noivo =
      UserService.dados.bloco_pais_noivo.color =
      self.bloco_pais_noivo.color;

    var fonte_msg1 = UserService.dados.bloco_msg_1['font-id'];
    var fonte_msg2 = UserService.dados.bloco_msg_2['font-id'];
    var fonte_msg3 = UserService.dados.bloco_msg_personalizada_style['font-id'];
    var fonte_msg4 = UserService.dados.bloco_cerimonia['font-id'];
    var fonte_nomecasal = UserService.dados.bloco_nome_dos_noivos['font-id'];
    var fonte_pais_noiva = UserService.dados.bloco_pais_noiva['font-id'];
    var fonte_pais_noivo = UserService.dados.bloco_pais_noivo['font-id'];

    var tamanho_fonte_msg1 = self.removePx(self.bloco_msg_1["font-size"]);
    var tamanho_fonte_msg2 = self.removePx(self.bloco_msg_2["font-size"]);
    var tamanho_fonte_msg3 = self.removePx(self.bloco_msg_personalizada_style["font-size"]);
    var tamanho_fonte_msg4 = self.removePx(self.bloco_cerimonia["font-size"]);
    var tamanho_fonte_pais_noiva = self.removePx(self.bloco_pais_noiva["font-size"]);
    var tamanho_fonte_pais_noivo = self.removePx(self.bloco_pais_noivo["font-size"]);
    var tamanho_nomecasal = self.removePx(self.bloco_nome_dos_noivos["font-size"]);

    UserService.dados.bloco_msg_1["font-size"] = self.bloco_msg_1["font-size"];
    UserService.dados.bloco_msg_2["font-size"] = self.bloco_msg_2["font-size"];
    UserService.dados.bloco_msg_personalizada_style["font-size"] = self.bloco_msg_personalizada_style["font-size"];
    UserService.dados.bloco_cerimonia["font-size"] = self.bloco_cerimonia["font-size"];
    UserService.dados.bloco_nome_dos_noivos["font-size"] = self.bloco_pais_noiva["font-size"];
    UserService.dados.bloco_pais_noiva["font-size"] = self.bloco_pais_noivo["font-size"];
    UserService.dados.bloco_pais_noivo["font-size"] = self.bloco_nome_dos_noivos["font-size"];

    UserService.SaveState();

    var xmlVar = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>' + alinhamento_msg1 + '</alinhamento_msg1><alinhamento_msg2>' + alinhamento_msg2 + '</alinhamento_msg2><alinhamento_msg3>' + alinhamento_msg3 + '</alinhamento_msg3><alinhamento_msg4>' + alinhamento_msg4 + '</alinhamento_msg4><alinhamento_nomecasal>' + alinhamento_nomecasal + '</alinhamento_nomecasal><alinhamento_pais_noiva>' + alinhamento_pais_noiva + '</alinhamento_pais_noiva><alinhamento_pais_noivo>' + alinhamento_pais_noivo + '</alinhamento_pais_noivo>';

    xmlVar += '<conteudo_msg1>' + conteudo_msg1 + '</conteudo_msg1><conteudo_msg2>' + conteudo_msg2 + '</conteudo_msg2><conteudo_msg3>' + conteudo_msg3 + '</conteudo_msg3><conteudo_msg4>' + conteudo_msg4 + '</conteudo_msg4><conteudo_nomecasal>' + conteudo_nomecasal + '</conteudo_nomecasal><conteudo_pais_noiva>' + conteudo_pais_noiva + '</conteudo_pais_noiva><conteudo_pais_noivo>' + conteudo_pais_noivo + '</conteudo_pais_noivo>';

    xmlVar += '<cor_msg1>' + cor_msg1 + '</cor_msg1><cor_msg2>' + cor_msg2 + '</cor_msg2><cor_msg3>' + cor_msg3 + '</cor_msg3><cor_msg4>' + cor_msg4 + '</cor_msg4><cor_nomecasal>' + cor_nomecasal + '</cor_nomecasal><cor_pais_noiva>' + cor_pais_noiva + '</cor_pais_noiva><cor_pais_noivo>' + cor_pais_noivo + '</cor_pais_noivo>';

    xmlVar += '<fonte_msg1>' + fonte_msg1 + '</fonte_msg1> <fonte_msg2>' + fonte_msg2 + '</fonte_msg2> <fonte_msg3>' + fonte_msg3 + '</fonte_msg3> <fonte_msg4>' + fonte_msg4 + '</fonte_msg4> <fonte_nomecasal>' + fonte_nomecasal + '</fonte_nomecasal> <fonte_pais_noiva>' + fonte_pais_noiva + '</fonte_pais_noiva> <fonte_pais_noivo>' + fonte_pais_noivo + '</fonte_pais_noivo>';

    xmlVar += ' <id_casal>' + ID + '</id_casal> <id_modelo>' + modelo + '</id_modelo>';

    xmlVar += ' <tamanho_fonte_msg1>' + tamanho_fonte_msg1 + '</tamanho_fonte_msg1> <tamanho_fonte_msg2>' + tamanho_fonte_msg2 + '</tamanho_fonte_msg2> <tamanho_fonte_msg3>' + tamanho_fonte_msg3 + '</tamanho_fonte_msg3> <tamanho_fonte_msg4>' + tamanho_fonte_msg4 + '</tamanho_fonte_msg4> <tamanho_fonte_pais_noiva>' + tamanho_fonte_pais_noiva + '</tamanho_fonte_pais_noiva> <tamanho_fonte_pais_noivo>' + tamanho_fonte_pais_noivo + '</tamanho_fonte_pais_noivo> <tamanho_nomecasal>' + tamanho_nomecasal + '</tamanho_nomecasal></DadosFormatacaoConvite > ';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
    });
  };
  self.getConfiguracaoConvite();

}]);