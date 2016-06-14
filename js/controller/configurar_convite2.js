angular.module("dashboard").controller('configurar_convite2', ['$scope', '$http', 'ConfiguracaoTemplateConvite', 'user', '$sce', '$cookies', '$route', '$filter', function ($scope, $http, ConfiguracaoTemplateConvite, user, $sce, $cookies, $route, $filter) {

  var self = this;

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

  // gerencia qual bloco esta ativo para edicao
  $scope.showBlocos = [
    { "ativo": true },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false }
  ];

  // ativa o bloco quando clicado
  $scope.setBlocoActive = function (index) {
    for (var i = 0; i < $scope.showBlocos.length; i++) {
      $scope.showBlocos[i]['ativo'] = false;
    }
    $scope.showBlocos[index]["ativo"] = true;
  };

  //iniciliza o vetor dos convites
  $scope.convites = [];

  //carrega as informações dos blocos(altura,largura, posicao) de cada convite
  $http.get('data/convites.json')
    .then(function (res) {
      $scope.convites = res.data;
    });

  //carrega as fonts
  $http.get('data/fonts.json')
    .then(function (res) {
      $scope.fonts = res.data;
    });

  //imagem do convite
  $scope.layoutSelecionado;

  //recebe o style dos blocos;
  $scope.bloco_pais_noiva;
  $scope.bloco_pais_noivo;
  $scope.bloco_msg_1;
  $scope.bloco_nome_dos_noivos;
  $scope.bloco_msg_2;
  $scope.bloco_msg_personalizada_style;
  $scope.bloco_cerimonia;

  //mensagens

  $scope.bloco_msg_personalizada = "Este é um texto de referência para a mensagem do seu convite. Para editá-lo clique aqui e reescreva. Se você optar por não ter nenhuma mensagem, basta selecionar o texto e deletar.";

  self.setMsg = function () {

    user = $cookies.getObject('user');

    var casamento = user.dadosCasal.data_casamento.split("/");
    var dataCasamento = casamento[1] + "/" + casamento[0] + "/" + casamento[2];

    $scope.conteudo_msg1 = $sce.trustAsHtml("convidam para a cerimônia de casamento dos seus filhos");
    $scope.conteudo_msg2 = $sce.trustAsHtml("a realizar-se às " + $filter("twoDigits")(user.convite_dados.cerimonia_hora) + ":" + $filter("twoDigits")(user.convite_dados.cerimonia_min) + " horas, dia " + dataCasamento + ", " + user.convite_dados.cerimonia_local);

    $scope.conteudo_msg4 = $sce.trustAsHtml("Cerimônia: <br> " + user.convite_dados.cerimonia_local + " <br> " + user.convite_dados.cerimonia_end + ", " + user.convite_dados.cerimonia_numero + " - " + user.convite_dados.cerimonia_bairro + " " + user.convite_dados.cerimonia_cidade);

    $scope.conteudo_nomecasal = $sce.trustAsHtml(user.dadosCasal.nome_noiva + " &#38; " + user.dadosCasal.nome_noivo);

    $scope.conteudo_pais_noiva = $sce.trustAsHtml(
      user.convite_dados.noiva_pai + self.inMemorian(user.convite_dados.noiva_pai_memorian)
      + " <br> " +
      user.convite_dados.noiva_mae + self.inMemorian(user.convite_dados.noiva_mae_memorian)
    );

    $scope.conteudo_pais_noivo = $sce.trustAsHtml(
      user.convite_dados.noivo_pai + self.inMemorian(user.convite_dados.noivo_pai_memorian)
      + " <br> " +
      user.convite_dados.noivo_mae + self.inMemorian(user.convite_dados.noivo_mae_memorian)
    );
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
      var serif = $scope.fonts['SERIF'][id]['font-name'];
      return serif;
    } catch (e) {
      try {
        var sansserif = $scope.fonts['SANSSERIF'][id]['font-name'];
        return sansserif;
      } catch (e) {
        try {
          var display = $scope.fonts['DISPLAY'][id]['font-name'];
          return display;
        } catch (e) {
          try {
            var handwriting = $scope.fonts['HANDWRITING'][id]['font-name'];
            return handwriting;
          } catch (e) {
            return null;
          }
        }
      }
    }
  };

  $scope.styleHold = [];

  // set font family do bloco
  $scope.setFontToBloco = function (font, idFont) {
    $('.' + $scope.styleHold).css('font-family', font);
    user.convite_formatacao[$scope.styleHold]['font-family'] = idFont;
  };

  //O servico nao reconhece px. Essa funcao retira o px, para poder enviar ao servidor
  self.removePx = function (texto) {
    var retorno = '';

    retorno = texto.toString().split('px');

    return retorno[0];
  };

  /*indice da lista de convites.
  * Define qual convite o sistema vai pegar as informacoes dos blocos
  */
  $scope.convite_individual;

  //configura a imagem do convite,pega a posicao dos blocos e aplica
  $scope.setConvite = function (convite, imagem) {
    $scope.layoutSelecionado = imagem;
    $scope.convite_individual = convite;
    var bloco = $scope.convites[convite];

    $scope.bloco_pais_noiva = bloco.bloco_pais_noiva;
    $scope.bloco_pais_noivo = bloco.bloco_pais_noivo;
    $scope.bloco_msg_1 = bloco.bloco_msg_1;
    $scope.bloco_nome_dos_noivos = bloco.bloco_nome_dos_noivos;
    $scope.bloco_msg_2 = bloco.bloco_msg_2;
    $scope.bloco_msg_personalizada_style = bloco.bloco_msg_personalizada_style;
    $scope.bloco_cerimonia = bloco.bloco_cerimonia;

  };

  // pega os dados do servidor
  $scope.getConfiguracaoConvite = function () {
    if (user.id == null) {
      user = $cookies.getObject('user');
    }

    ConfiguracaoTemplateConvite.getData(user.id).then(function (resp) {
      try {
        resp = $.parseXML(resp);
      } catch (error) {
        $route.reload();
      }
      var modelo = $(resp).find('id_modelo').text();

      self.setMsg();

      if (modelo == '0') {
        $scope.setConvite('convite1', './image/convites/convite1.png');
        $scope.setConfiguracaoConvite();
      } else {
        $scope.setConvite('convite' + modelo + '', './image/convites/convite' + modelo + '.png');

        $scope.bloco_msg_1["text-align"] = self.getTextAling($(resp).find('alinhamento_msg1').text());
        $scope.bloco_msg_2["text-align"] = self.getTextAling($(resp).find('alinhamento_msg2').text());
        $scope.bloco_msg_personalizada_style["text-align"] = self.getTextAling($(resp).find('alinhamento_msg3').text());
        $scope.bloco_cerimonia["text-align"] = self.getTextAling($(resp).find('alinhamento_msg4').text());
        $scope.bloco_nome_dos_noivos["text-align"] = self.getTextAling($(resp).find('alinhamento_nomecasal').text());
        $scope.bloco_pais_noiva["text-align"] = self.getTextAling($(resp).find('alinhamento_pais_noiva').text());
        $scope.bloco_pais_noivo["text-align"] = self.getTextAling($(resp).find('alinhamento_pais_noivo').text());
        $scope.bloco_msg_1["color"] = $(resp).find('cor_msg1').text();
        $scope.bloco_msg_2["color"] = $(resp).find('cor_msg2').text();
        $scope.bloco_msg_personalizada_style["color"] = $(resp).find('cor_msg3').text();
        $scope.bloco_cerimonia["color"] = $(resp).find('cor_msg4').text();
        $scope.bloco_nome_dos_noivos["color"] = $(resp).find('cor_nomecasal').text();
        $scope.bloco_pais_noiva["color"] = $(resp).find('cor_pais_noiva').text();
        $scope.bloco_pais_noivo["color"] = $(resp).find('cor_pais_noivo').text();
        $scope.bloco_msg_1["font-family"] = self.getFonte($(resp).find('fonte_msg1').text());
        $scope.bloco_msg_2["font-family"] = self.getFonte($(resp).find('fonte_msg2').text());
        $scope.bloco_msg_personalizada_style["font-family"] = self.getFonte($(resp).find('fonte_msg3').text());
        $scope.bloco_cerimonia["font-family"] = self.getFonte($(resp).find('fonte_msg4').text());
        $scope.bloco_nome_dos_noivos["font-family"] = self.getFonte($(resp).find('fonte_nomecasal').text());
        $scope.bloco_pais_noiva["font-family"] = self.getFonte($(resp).find('fonte_pais_noiva').text());
        $scope.bloco_pais_noivo["font-family"] = self.getFonte($(resp).find('fonte_pais_noivo').text());
        $scope.bloco_msg_1["font-size"] = $(resp).find('tamanho_fonte_msg1').text();
        $scope.bloco_msg_2["font-size"] = $(resp).find('tamanho_fonte_msg2').text();
        $scope.bloco_msg_personalizada_style["font-size"] = $(resp).find('tamanho_fonte_msg3').text();
        $scope.bloco_cerimonia["font-size"] = $(resp).find('tamanho_fonte_msg4').text();
        $scope.bloco_nome_dos_noivos["font-size"] = $(resp).find('tamanho_nomecasal').text();
        $scope.bloco_pais_noiva["font-size"] = $(resp).find('tamanho_fonte_pais_noiva').text();
        $scope.bloco_pais_noivo["font-size"] = $(resp).find('tamanho_fonte_pais_noiva').text();

        $scope.bloco_msg_personalizada = $(resp).find('conteudo_msg3').text();

        user.convite_formatacao.bloco_msg_1['font-family'] = $(resp).find('fonte_msg1').text();
        user.convite_formatacao.bloco_msg_2['font-family'] = $(resp).find('fonte_msg2').text();
        user.convite_formatacao.bloco_msg_personalizada_style['font-family'] = $(resp).find('fonte_msg3').text();
        user.convite_formatacao.bloco_cerimonia['font-family'] = $(resp).find('fonte_msg4').text();
        user.convite_formatacao.bloco_nome_dos_noivos['font-family'] = $(resp).find('fonte_nomecasal').text();
        user.convite_formatacao.bloco_pais_noiva['font-family'] = $(resp).find('fonte_pais_noiva').text();
        user.convite_formatacao.bloco_pais_noivo['font-family'] = $(resp).find('fonte_pais_noivo').text();
      }
    });
  };

  $scope.setConfiguracaoConvite = function () {
    var aux = $scope.convite_individual.split("convite");
    var modelo = aux[1];

    var xml = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>' + self.getTextAlingIndice($scope.bloco_msg_1["text-align"]) + '</alinhamento_msg1><alinhamento_msg2>' + self.getTextAlingIndice($scope.bloco_msg_2["text-align"]) + '</alinhamento_msg2><alinhamento_msg3>' + self.getTextAlingIndice($scope.bloco_msg_personalizada_style["text-align"]) + '</alinhamento_msg3><alinhamento_msg4>' + self.getTextAlingIndice($scope.bloco_cerimonia["text-align"]) + '</alinhamento_msg4><alinhamento_nomecasal>' + self.getTextAlingIndice($scope.bloco_nome_dos_noivos["text-align"]) + '</alinhamento_nomecasal><alinhamento_pais_noiva>' + self.getTextAlingIndice($scope.bloco_pais_noiva["text-align"]) + '</alinhamento_pais_noiva><alinhamento_pais_noivo>' + self.getTextAlingIndice($scope.bloco_pais_noivo["text-align"]) + '</alinhamento_pais_noivo><conteudo_msg1>' + self.changeBr($scope.conteudo_msg1.toString()) + '</conteudo_msg1><conteudo_msg2>' + self.changeBr($scope.conteudo_msg2.toString()) + '</conteudo_msg2><conteudo_msg3>' + self.changeBr($scope.bloco_msg_personalizada.toString()) + '</conteudo_msg3><conteudo_msg4>' + self.changeBr($scope.conteudo_msg4.toString()) + '</conteudo_msg4><conteudo_nomecasal>' + user.dadosCasal.nome_noiva + ' &#38; ' + user.dadosCasal.nome_noivo + '</conteudo_nomecasal><conteudo_pais_noiva>' + user.convite_dados.noiva_pai + '#' + user.convite_dados.noiva_mae + '</conteudo_pais_noiva><conteudo_pais_noivo>' + user.convite_dados.noivo_pai + '#' + user.convite_dados.noivo_mae + '</conteudo_pais_noivo><cor_msg1>' + $scope.bloco_msg_1["color"] + '</cor_msg1><cor_msg2>' + $scope.bloco_msg_2["color"] + '</cor_msg2><cor_msg3>' + $scope.bloco_msg_personalizada_style["color"] + '</cor_msg3><cor_msg4>' + $scope.bloco_cerimonia["color"] + '</cor_msg4><cor_nomecasal>' + $scope.bloco_nome_dos_noivos["color"] + '</cor_nomecasal><cor_pais_noiva>' + $scope.bloco_pais_noiva["color"] + '</cor_pais_noiva><cor_pais_noivo>' + $scope.bloco_pais_noivo["color"] + '</cor_pais_noivo><fonte_msg1>' + user.convite_formatacao.bloco_msg_1['font-family'] + '</fonte_msg1><fonte_msg2>' + user.convite_formatacao.bloco_msg_2['font-family'] + '</fonte_msg2><fonte_msg3>' + user.convite_formatacao.bloco_msg_personalizada_style['font-family'] + '</fonte_msg3><fonte_msg4>' + user.convite_formatacao.bloco_cerimonia['font-family'] + '</fonte_msg4><fonte_nomecasal>' + user.convite_formatacao.bloco_nome_dos_noivos['font-family'] + '</fonte_nomecasal><fonte_pais_noiva>' + user.convite_formatacao.bloco_pais_noiva['font-family'] + '</fonte_pais_noiva><fonte_pais_noivo>' + user.convite_formatacao.bloco_pais_noivo['font-family'] + '</fonte_pais_noivo><id_casal>' + user.id + '</id_casal><id_modelo>' + modelo + '</id_modelo><tamanho_fonte_msg1>' + self.removePx($scope.bloco_msg_1["font-size"]) + '</tamanho_fonte_msg1><tamanho_fonte_msg2>' + self.removePx($scope.bloco_msg_2["font-size"]) + '</tamanho_fonte_msg2><tamanho_fonte_msg3>' + self.removePx($scope.bloco_msg_personalizada_style["font-size"]) + '</tamanho_fonte_msg3><tamanho_fonte_msg4>' + self.removePx($scope.bloco_cerimonia["font-size"]) + '</tamanho_fonte_msg4><tamanho_fonte_pais_noiva>' + self.removePx($scope.bloco_pais_noiva["font-size"]) + '</tamanho_fonte_pais_noiva><tamanho_fonte_pais_noivo>' + self.removePx($scope.bloco_pais_noivo["font-size"]) + '</tamanho_fonte_pais_noivo><tamanho_nomecasal>' + self.removePx($scope.bloco_nome_dos_noivos["font-size"]) + '</tamanho_nomecasal></DadosFormatacaoConvite>';

    ConfiguracaoTemplateConvite.setData(xml);
  };
  $scope.getConfiguracaoConvite();

}]);