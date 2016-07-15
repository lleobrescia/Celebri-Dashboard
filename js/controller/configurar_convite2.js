angular.module("dashboard").controller('configurar_convite2', ['UserService', 'ServiceCasamento', 'ipService', '$location', '$sce', '$filter', function (UserService, ServiceCasamento, ipService, $location, $sce, $filter) {

  var self = this;
  var ID = UserService.dados.ID;
  var idConvite = UserService.dados.modeloConvite;
  var convites = UserService.dados.listaConvites;
  var fonts = UserService.dados.listaFonts;

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

  self.hasContent = UserService.dados.conviteCriado;
  self.cerregando = true;

  self.thumbNome = 'Laranja';
  self.thumbEscolhido = 'image/convites/thumb/thumb1.png';

  self.thumbs = [
    {
      ID: 1,
      url: 'image/convites/thumb/thumb1.png',
      nome: 'Laranja'
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
      ID: 6,
      url: 'image/convites/thumb/thumb6.png',
      nome: 'Gold'
    }
  ];

  //pega a font baseado no id fornecido
  var GetFonte = function (id) {

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
  };

  var GetTextAling = function (index) {
    var retorno = '';

    switch (index) {
      case '2': retorno = "right"; break;
      case '0': retorno = "left"; break;
      case '1': retorno = "center"; break;
      default: retorno = "left"; break;
    }
    return retorno;
  };

  //mensagens
  var SetMsg = function () {

    var casamento = data_casamento.split("/");
    var dataCasamento = casamento[1] + "/" + casamento[0] + "/" + casamento[2];

    self.conteudo_msg1 = $sce.trustAsHtml("convidam para a cerimônia de casamento dos seus filhos");
    self.conteudo_msg2 = $sce.trustAsHtml("a realizar-se às " + $filter("twoDigits")(cerimonia_hora) + ":" + $filter("twoDigits")(cerimonia_min) + " horas, dia " + dataCasamento + ", " + cerimonia_local);

    self.conteudo_msg4 = $sce.trustAsHtml("Cerimônia: <br> " + cerimonia_local + " <br> " + cerimonia_end + ", " + cerimonia_numero + " - " + cerimonia_bairro + " " + cerimonia_cidade);

    self.conteudo_nomecasal = $sce.trustAsHtml(nome_noiva + " &#38; " + nome_noivo);

    self.conteudo_pais_noiva = $sce.trustAsHtml(
      noiva_pai + InMemorian(noiva_pai_memorian) + " <br> " +
      noiva_mae + InMemorian(noiva_mae_memorian)
    );

    self.conteudo_pais_noivo = $sce.trustAsHtml(
      noivo_pai + InMemorian(noivo_pai_memorian) + " <br> " +
      noivo_mae + InMemorian(noivo_mae_memorian)
    );
  };

  //retorna uma cruz em html
  var InMemorian = function (itIs) {
    if (itIs == 'true') {
      return " &#10013;";
    } else {
      return " ";
    }
  };

  var GetConfiguracaoConvite = function () {

    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarFormatacaoConvite";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      resp = $.parseXML(resp);
      idConvite = $(resp).find('id_modelo').text();

      if (idConvite != '0') {
        self.hasContent = true;
        FormatConvite();
        SetMsg();
        self.layoutSelecionado = './image/convites/convite' + idConvite + '.png';

        self.bloco_msg_1["text-align"] =
          UserService.dados.bloco_msg_1["text-align"] =
          GetTextAling($(resp).find('alinhamento_msg1').text());

        self.bloco_msg_2["text-align"] =
          UserService.dados.bloco_msg_2["text-align"] =
          GetTextAling($(resp).find('alinhamento_msg2').text());

        self.bloco_msg_personalizada_style["text-align"] =
          UserService.dados.bloco_msg_personalizada_style["text-align"] =
          GetTextAling($(resp).find('alinhamento_msg3').text());

        self.bloco_cerimonia["text-align"] =
          UserService.dados.bloco_cerimonia["text-align"] =
          GetTextAling($(resp).find('alinhamento_msg4').text());

        self.bloco_nome_dos_noivos["text-align"] =
          UserService.dados.bloco_nome_dos_noivos["text-align"] =
          GetTextAling($(resp).find('alinhamento_nomecasal').text());

        self.bloco_pais_noiva["text-align"] =
          UserService.dados.bloco_pais_noiva["text-align"] =
          GetTextAling($(resp).find('alinhamento_pais_noiva').text());

        self.bloco_pais_noivo["text-align"] =
          UserService.dados.bloco_pais_noivo["text-align"] =
          GetTextAling($(resp).find('alinhamento_pais_noivo').text());


        self.bloco_msg_1.color =
          UserService.dados.bloco_msg_1.color =
          $(resp).find('cor_msg1').text();

        self.bloco_msg_2.color =
          UserService.dados.bloco_msg_2.color =
          $(resp).find('cor_msg2').text();

        self.bloco_msg_personalizada_style.color =
          UserService.dados.bloco_msg_personalizada_style.color =
          $(resp).find('cor_msg3').text();

        self.bloco_cerimonia.color =
          UserService.dados.bloco_cerimonia.color =
          $(resp).find('cor_msg4').text();

        self.bloco_nome_dos_noivos.color =
          UserService.dados.bloco_nome_dos_noivos.color =
          $(resp).find('cor_nomecasal').text();

        self.bloco_pais_noiva.color =
          UserService.dados.bloco_pais_noiva.color =
          $(resp).find('cor_pais_noiva').text();

        self.bloco_pais_noivo.color =
          UserService.dados.bloco_pais_noivo.color =
          $(resp).find('cor_pais_noivo').text();


        self.bloco_msg_1["font-family"] =
          UserService.dados.bloco_msg_1["font-family"] =
          GetFonte($(resp).find('fonte_msg1').text());

        self.bloco_msg_2["font-family"] =
          UserService.dados.bloco_msg_2["font-family"] =
          GetFonte($(resp).find('fonte_msg2').text());

        self.bloco_msg_personalizada_style["font-family"] =
          UserService.dados.bloco_msg_personalizada_style['font-family'] =
          GetFonte($(resp).find('fonte_msg3').text());

        self.bloco_cerimonia["font-family"] =
          UserService.dados.bloco_cerimonia["font-family"] =
          GetFonte($(resp).find('fonte_msg4').text());

        self.bloco_nome_dos_noivos["font-family"] =
          UserService.dados.bloco_nome_dos_noivos["font-family"] =
          GetFonte($(resp).find('fonte_nomecasal').text());

        self.bloco_pais_noiva["font-family"] =
          UserService.dados.bloco_pais_noiva["font-family"] =
          GetFonte($(resp).find('fonte_pais_noiva').text());

        self.bloco_pais_noivo["font-family"] =
          UserService.dados.bloco_pais_noivo["font-family"] =
          GetFonte($(resp).find('fonte_pais_noivo').text());


        self.bloco_msg_1["font-size"] =
          UserService.dados.bloco_msg_1["font-size"] =
          $(resp).find('tamanho_fonte_msg1').text() + 'px';

        self.bloco_msg_2["font-size"] =
          UserService.dados.bloco_msg_2["font-size"] =
          $(resp).find('tamanho_fonte_msg2').text() + 'px';

        self.bloco_msg_personalizada_style["font-size"] =
          UserService.dados.bloco_msg_personalizada_style["font-size"] =
          $(resp).find('tamanho_fonte_msg3').text() + 'px';

        self.bloco_cerimonia["font-size"] =
          UserService.dados.bloco_cerimonia["font-size"] =
          $(resp).find('tamanho_fonte_msg4').text() + 'px';

        self.bloco_nome_dos_noivos["font-size"] =
          UserService.dados.bloco_nome_dos_noivos["font-size"] =
          $(resp).find('tamanho_nomecasal').text() + 'px';

        self.bloco_pais_noiva["font-size"] =
          UserService.dados.bloco_pais_noiva["font-size"] =
          $(resp).find('tamanho_fonte_pais_noiva').text() + 'px';

        self.bloco_pais_noivo["font-size"] =
          UserService.dados.bloco_pais_noivo["font-size"] =
          $(resp).find('tamanho_fonte_pais_noivo').text() + 'px';


        self.bloco_msg_personalizada = $sce.trustAsHtml($(resp).find('conteudo_msg3').text());
        UserService.dados.bloco_msg_personalizada_style.conteudo = $(resp).find('conteudo_msg3').text();

        UserService.dados.bloco_msg_1['font-id'] = $(resp).find('fonte_msg1').text();
        UserService.dados.bloco_msg_2['font-id'] = $(resp).find('fonte_msg2').text();
        UserService.dados.bloco_msg_personalizada_style['font-id'] = $(resp).find('fonte_msg3').text();
        UserService.dados.bloco_cerimonia['font-id'] = $(resp).find('fonte_msg4').text();
        UserService.dados.bloco_nome_dos_noivos['font-id'] = $(resp).find('fonte_nomecasal').text();
        UserService.dados.bloco_pais_noiva['font-id'] = $(resp).find('fonte_pais_noiva').text();
        UserService.dados.bloco_pais_noivo['font-id'] = $(resp).find('fonte_pais_noivo').text();

        UserService.dados.modeloConvite = "convite" + idConvite;
      } else {
        self.hasContent = false;
      }
      UserService.dados.conviteCriado = self.hasContent;
      UserService.SaveState();
      self.cerregando = false;
    });
  };

  //configura a imagem do convite,pega a posicao dos blocos e aplica
  var FormatConvite = function () {
    var bloco = convites["convite" + idConvite];


    self.bloco_pais_noiva = bloco.bloco_pais_noiva;
    self.bloco_pais_noivo = bloco.bloco_pais_noivo;
    self.bloco_msg_1 = bloco.bloco_msg_1;
    self.bloco_nome_dos_noivos = bloco.bloco_nome_dos_noivos;
    self.bloco_msg_2 = bloco.bloco_msg_2;
    self.bloco_msg_personalizada_style = bloco.bloco_msg_personalizada_style;
    self.bloco_cerimonia = bloco.bloco_cerimonia;
  };

  self.AlterarConvite = function () {
    $('#confirmacao').modal('hide');
    self.cerregando = true;

    UserService.dados.modeloConvite = 0;
    UserService.dados.conviteCriado = self.hasContent = false;
    UserService.SaveState();


    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/FormatacaoConvite";
    var xmlVar = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>1</alinhamento_msg1><alinhamento_msg2>1</alinhamento_msg2><alinhamento_msg3>1</alinhamento_msg3><alinhamento_msg4>1</alinhamento_msg4><alinhamento_nomecasal>1</alinhamento_nomecasal><alinhamento_pais_noiva>1</alinhamento_pais_noiva><alinhamento_pais_noivo>1</alinhamento_pais_noivo><conteudo_msg1>String content</conteudo_msg1><conteudo_msg2>String content</conteudo_msg2><conteudo_msg3>String content</conteudo_msg3><conteudo_msg4>String content</conteudo_msg4><conteudo_nomecasal>String content</conteudo_nomecasal><conteudo_pais_noiva>String content</conteudo_pais_noiva><conteudo_pais_noivo>String content</conteudo_pais_noivo><cor_msg1>#3333</cor_msg1><cor_msg2>#3333</cor_msg2><cor_msg3>#3333</cor_msg3><cor_msg4>#3333</cor_msg4><cor_nomecasal>#3333</cor_nomecasal><cor_pais_noiva>#3333</cor_pais_noiva><cor_pais_noivo>#3333</cor_pais_noivo><fonte_msg1>1</fonte_msg1><fonte_msg2>1</fonte_msg2><fonte_msg3>1</fonte_msg3><fonte_msg4>1</fonte_msg4><fonte_nomecasal>1</fonte_nomecasal><fonte_pais_noiva>1</fonte_pais_noiva><fonte_pais_noivo>1</fonte_pais_noivo><id_casal>' + ID + '</id_casal><id_modelo>0</id_modelo><tamanho_fonte_msg1>1</tamanho_fonte_msg1><tamanho_fonte_msg2>1</tamanho_fonte_msg2><tamanho_fonte_msg3>1</tamanho_fonte_msg3><tamanho_fonte_msg4>1</tamanho_fonte_msg4><tamanho_fonte_pais_noiva>1</tamanho_fonte_pais_noiva><tamanho_fonte_pais_noivo>1</tamanho_fonte_pais_noivo><tamanho_nomecasal>1</tamanho_nomecasal></DadosFormatacaoConvite>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (res) {
      self.cerregando = false;
    });
  };

  self.SalvarConvite = function () {
    $('#myModal').modal('hide');
    UserService.dados.modeloConvite = "convite" + idConvite;
    UserService.SaveState();
    $location.path('/personalizar-convite');
  };

  self.SetConvite = function (id, nome, url) {
    self.thumbNome = nome;
    self.thumbEscolhido = url;
    idConvite = id;
  };

  GetConfiguracaoConvite();

}]);