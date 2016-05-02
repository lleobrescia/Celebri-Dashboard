// INIT
angular.module("dashboard", ['ngRoute', 'ngFileUpload', 'ngMask', 'rzModule', 'ngAnimate', 'ui.bootstrap']);

// Variavel Global. Armazena todos os dados do usuario
angular.module("dashboard")
  .value("user", {
    id: 15,
    dadosCasal: {
      nome_noiva: '',
      nome_noivo: '',
      data_casamento: ''
    },
    convite_dados: {
      cerimonia_local: '',
      cerimonia_end: '',
      cerimonia_numero: '',
      cerimonia_bairro: '',
      cerimonia_cidade: '',
      cerimonia_rota: '',
      cerimonia_cep: '',
      cerimonia_hora: '',
      cerimonia_min: '',
      noiva_mae: '',
      noiva_pai: '',
      noivo_mae: '',
      noivo_pai: '',
      noiva_mae_memorian: '',
      noiva_pai_memorian: '',
      noivo_mae_memorian: '',
      noivo_pai_memorian: '',
    },
    convite_formatacao: {
      bloco_msg_1: {
        'font-family': 1
      },
      bloco_msg_2: {
        'font-family': 1
      },
      bloco_msg_personalizada_style: {
        'font-family': 1
      },
      bloco_cerimonia: {
        'font-family': 1
      },
      bloco_nome_dos_noivos: {
        'font-family': 1
      },
      bloco_pais_noiva: {
        'font-family': 1
      },
      bloco_pais_noivo: {
        'font-family': 1
      }
    },
    recepcao: {
      festa_igual_cerimonia: '',
      festa_local: '',
      festa_end: '',
      festa_numero: '',
      festa_bairro: '',
      festa_cidade: '',
      festa_rota: '',
      festa_cep: ''
    },
    lista_hotel: [],
    lista_salao: [],
    lista_presente: [],
    lista_convidados: [],
    lista_cardapio: []
  });

//Controllers
angular.module('dashboard').controller('sidebar', ['$scope', '$location', function ($scope, $location) {

  //Verifica em qual pag esta
  $scope.isActive = function (viewLocation) {
    var retorno = false;
    if (viewLocation === $location.path() || viewLocation + "/2" === $location.path()) {
      retorno = true
    }
    return retorno;
  };

  //Lista do menu
  $scope.menu =
    [
      {
        Id: 1,
        Name: "Dados do Casal",
        url: 'dados-do-casal'
      },
      {
        Id: 2,
        Name: 'Configurar Convite',
        url: 'configurar-convite'
      },
      {
        Id: 3,
        Name: 'Configurar Evento',
        url: 'configurar-evento'
      },
      {
        Id: 4,
        Name: 'Cadastrar Convidados',
        url: 'cadastrar-convidados'
      },
      {
        Id: 5,
        Name: 'Save the Date',
        url: 'save-the-date'
      },
      {
        Id: 6,
        Name: 'Enviar Convite',
        url: 'enviar-convite'
      },
      {
        Id: 7,
        Name: 'Estatísticas do Convite',
        url: 'convidados-confirados'
      }
    ];
}]);

angular.module("dashboard").controller('mainController', ['$scope', function ($scope) {
  $scope.id = 15;

  $scope.foto;
  $scope.arquivo;

  //for ng-repeat
  $scope.getTimes = function (n) {
    return new Array(n);
  };
}]);

angular.module("dashboard").controller('dados_casal', ['$scope', 'Upload', 'DadosCasal', 'user', function ($scope, Upload, DadosCasal, user) {
  // evita conflito dentro das funcoes
  var self = this;

  //salva as informações do form dentro de user
  self.setLocalDados = function () {
    var casamento = $scope.data_casamento.getMonth() + "/" + $scope.data_casamento.getDate() + "/" + $scope.data_casamento.getFullYear();

    user.dadosCasal.nome_noivo = $scope.nome_noivo;
    user.dadosCasal.nome_noiva = $scope.nome_noiva;
    user.dadosCasal.data_casamento = casamento;
  };

  //pega as informações de user e coloca no $scope
  self.getLocalDados = function () {
    var data = user.dadosCasal.data_casamento.split('/');

    $scope.nome_noivo = user.dadosCasal.nome_noivo;
    $scope.nome_noiva = user.dadosCasal.nome_noiva;
    $scope.data_casamento = new Date(data[2], data[1], data[0]);
  }

  //pega os dados do servidor
  $scope.casalGetDados = function () {
    DadosCasal.getData($scope.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.nome_noivo = $(respXml).find('NomeNoivo').text();
      $scope.nome_noiva = $(respXml).find('NomeNoiva').text();

      var data = $(respXml).find('DataCasamento').text().split('/');
      $scope.data_casamento = new Date(data[2], data[1], data[0]);

      self.setLocalDados();
    });
  };

  //salva no servidor os dados
  $scope.setDadosCasal = function () {
    var casamento = $scope.data_casamento.getMonth() + "/" + $scope.data_casamento.getDate() + "/" + $scope.data_casamento.getFullYear();
    var xml = '<DadosCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + $scope.id + '</Id_casal><AtualizarSenha>false</AtualizarSenha><DataCasamento>' + casamento + '</DataCasamento><NomeNoiva>' + $scope.nome_noiva + '</NomeNoiva><NomeNoivo>' + $scope.nome_noivo + '</NomeNoivo><Senha></Senha></DadosCasal>';

    self.setLocalDados();
    DadosCasal.setData(xml);
  };

  if (user.dadosCasal.nome_noivo === '') {
    $scope.casalGetDados();
  } else {
    self.getLocalDados();
  }
}]);

angular.module("dashboard").controller('configurar_convite', ['$scope', 'ConfiguracaoConvite', 'user', function ($scope, ConfiguracaoConvite, user) {

  // evita conflito dentro das funcoes
  var self = this;

  //salva as informações do form dentro de user
  self.setLocalDados = function () {
    user.convite_dados.cerimonia_local = $scope.cerimonia_local;
    user.convite_dados.cerimonia_end = $scope.cerimonia_end;
    user.convite_dados.cerimonia_numero = $scope.cerimonia_numero;
    user.convite_dados.cerimonia_bairro = $scope.cerimonia_bairro;
    user.convite_dados.cerimonia_cidade = $scope.cerimonia_cidade;
    user.convite_dados.cerimonia_rota = $scope.cerimonia_rota;
    user.convite_dados.cerimonia_cep = $scope.cerimonia_cep;
    user.convite_dados.cerimonia_hora = $scope.cerimonia_hora;
    user.convite_dados.cerimonia_min = $scope.cerimonia_min;
    user.convite_dados.noiva_mae = $scope.noiva_mae;
    user.convite_dados.noiva_pai = $scope.noiva_pai;
    user.convite_dados.noivo_mae = $scope.noivo_mae;
    user.convite_dados.noivo_pai = $scope.noivo_pai;
    user.convite_dados.noiva_mae_memorian = $scope.noiva_mae_memorian;
    user.convite_dados.noiva_pai_memorian = $scope.noiva_pai_memorian;
    user.convite_dados.noivo_mae_memorian = $scope.noivo_mae_memorian;
    user.convite_dados.noivo_pai_memorian = $scope.noivo_pai_memorian;
  };

  //pega as informações de user e coloca no $scope
  self.getLocalDados = function () {
    $scope.cerimonia_local = user.convite_dados.cerimonia_local;
    $scope.cerimonia_end = user.convite_dados.cerimonia_end;
    $scope.cerimonia_numero = user.convite_dados.cerimonia_numero;
    $scope.cerimonia_bairro = user.convite_dados.cerimonia_bairro;
    $scope.cerimonia_cidade = user.convite_dados.cerimonia_cidade;
    $scope.cerimonia_rota = user.convite_dados.cerimonia_rota;
    $scope.cerimonia_cep = user.convite_dados.cerimonia_cep;
    $scope.cerimonia_hora = user.convite_dados.cerimonia_hora;
    $scope.cerimonia_min = user.convite_dados.cerimonia_min;
    $scope.noiva_mae = user.convite_dados.noiva_mae;
    $scope.noiva_pai = user.convite_dados.noiva_pai;
    $scope.noivo_mae = user.convite_dados.noivo_mae;
    $scope.noivo_pai = user.convite_dados.noivo_pai;
    $scope.noiva_mae_memorian = user.convite_dados.noiva_mae_memorian;
    $scope.noiva_pai_memorian = user.convite_dados.noiva_pai_memorian;
    $scope.noivo_mae_memorian = user.convite_dados.noivo_mae_memorian;
    $scope.noivo_pai_memorian = user.convite_dados.noivo_pai_memorian;
  }

  //pega o CEP, usando um servico na internet (postmon)
  $scope.consultCEP = function () {
    var cep = $scope.cerimonia_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.cerimonia_end = data.logradouro;
        $scope.cerimonia_bairro = data.bairro;
        $scope.cerimonia_cidade = data.cidade;
      }
    });
  };

  //pega os dados do servidor
  $scope.getDadosConvite = function () {
    ConfiguracaoConvite.getData($scope.id).then(function (resp) {

      var respXml = $.parseXML(resp);
      var hora = $(respXml).find('Horario_cerimonia').text().split(':');

      $scope.cerimonia_local = $(respXml).find('Local_cerimonia').text();
      $scope.cerimonia_end = $(respXml).find('Endereco').text();
      $scope.cerimonia_numero = $(respXml).find('Numero').text();
      $scope.cerimonia_bairro = $(respXml).find('Bairro').text();
      $scope.cerimonia_cidade = $(respXml).find('Cidade').text();
      $scope.cerimonia_rota = $(respXml).find('Tracar_rota_local').text();
      $scope.cerimonia_cep = $(respXml).find('Cep').text();
      $scope.cerimonia_hora = hora[0];

      if (hora[1] == "00") {
        $scope.cerimonia_min = "0";
      } else {
        $scope.cerimonia_min = hora[1];
      }

      $scope.noiva_mae = $(respXml).find('Mae_noiva').text();
      $scope.noiva_pai = $(respXml).find('Pai_noiva').text();
      $scope.noivo_mae = $(respXml).find('Mae_noivo').text();
      $scope.noivo_pai = $(respXml).find('Pai_noivo').text();
      $scope.noiva_mae_memorian = $(respXml).find('Mae_noiva_in_memoriam').text();
      $scope.noiva_pai_memorian = $(respXml).find('Pai_noiva_in_memoriam').text();
      $scope.noivo_mae_memorian = $(respXml).find('Mae_noivo_in_memoriam').text();
      $scope.noivo_pai_memorian = $(respXml).find('Pai_noivo_in_memoriam').text();

      self.setLocalDados();
    });
  };

  // salva os dados no servidor
  $scope.setDadosConvite = function () {
    var hora = $scope.cerimonia_hora + ":" + $scope.cerimonia_min;
    var xml = '<ConfiguracaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.cerimonia_bairro + '</Bairro><Cep>' + $scope.cerimonia_cep + '</Cep><Cidade>' + $scope.cerimonia_cidade + '</Cidade><Endereco>' + $scope.cerimonia_end + '</Endereco><Estado></Estado><Horario_cerimonia>' + hora + '</Horario_cerimonia><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Local_cerimonia>' + $scope.cerimonia_local + '</Local_cerimonia><Mae_noiva>' + $scope.noiva_mae + '</Mae_noiva><Mae_noiva_in_memoriam>' + $scope.noiva_mae_memorian + '</Mae_noiva_in_memoriam><Mae_noivo>' + $scope.noivo_mae + '</Mae_noivo><Mae_noivo_in_memoriam>' + $scope.noivo_mae_memorian + '</Mae_noivo_in_memoriam><Msg1></Msg1><Msg2></Msg2><Msg3></Msg3><Msg4></Msg4><Msg5></Msg5><Msg6></Msg6><Numero>' + $scope.cerimonia_numero + '</Numero><Obs></Obs><Pai_noiva>' + $scope.noiva_pai + '</Pai_noiva><Pai_noiva_in_memoriam>' + $scope.noiva_pai_memorian + '</Pai_noiva_in_memoriam><Pai_noivo>' + $scope.noivo_pai + '</Pai_noivo><Pai_noivo_in_memoriam>' + $scope.noivo_pai_memorian + '</Pai_noivo_in_memoriam><Pais></Pais><Tracar_rota_local>' + $scope.cerimonia_rota + '</Tracar_rota_local></ConfiguracaoConvite>';

    ConfiguracaoConvite.setData(xml);
    self.setLocalDados();
  };

  if (user.convite_dados.cerimonia_local === '') {
    $scope.getDadosConvite();
  } else {
    self.getLocalDados();
  }

}]);

angular.module("dashboard").controller('configurar_convite2', ['$scope', '$http', 'ConfiguracaoTemplateConvite', 'user', '$sce', function ($scope, $http, ConfiguracaoTemplateConvite, user, $sce) {

  var self = this;

  // Esconde o painel lateral quando chega perto do radepe
  $(window).scroll(function () {
    var elementoffset = $('#convites_layout').offset();
    if ($(this).scrollTop() < elementoffset.top - 500) {
      $('.controll').fadeIn(10);

    } else {
      $('.controll').fadeOut(10);
    }
  });

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
      $scope.showBlocos[i]["ativo"] = false;
    };
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

  $scope.bloco_msg_personalizada = "Este é um texto de referência para a mensagem do seu convite. Para editá-lo basta clicar aqui e reescrever. Se você optar por não ter nenhuma mensagem, basta deixar em branco.";

  self.setMsg = function () {
    $scope.conteudo_msg1 = $sce.trustAsHtml("convidam para a cerimônia de casamento dos seus filhos");
    $scope.conteudo_msg2 = $sce.trustAsHtml("à realizar-se às " + user.convite_dados.cerimonia_hora + " : " + user.convite_dados.cerimonia_min + " horas no dia " + user.dadosCasal.data_casamento + ", " + user.convite_dados.cerimonia_local);

    $scope.conteudo_msg4 = $sce.trustAsHtml(user.convite_dados.cerimonia_local + " " + user.convite_dados.cerimonia_end + ", " + user.convite_dados.cerimonia_numero + " - " + user.convite_dados.cerimonia_bairro + " " + user.convite_dados.cerimonia_cidade);

    $scope.conteudo_nomecasal = $sce.trustAsHtml(user.dadosCasal.nome_noiva + " &#38; " + user.dadosCasal.nome_noivo);
    $scope.conteudo_pais_noiva = $sce.trustAsHtml(user.convite_dados.noiva_pai + "<br>" + user.convite_dados.noiva_mae);
    $scope.conteudo_pais_noivo = $sce.trustAsHtml(user.convite_dados.noivo_pai + "<br>" + user.convite_dados.noivo_mae);
  }

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
  }

  //O servico nao reconhece px. Essa funcao retira o px, para poder enviar ao servidor
  self.removePx = function (texto) {
    var retorno = '';

    retorno = texto.toString().split('px');

    return retorno[0];
  }

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
    ConfiguracaoTemplateConvite.getData($scope.id).then(function (resp) {
      var modelo = $(resp).find('id_modelo').text();

      self.setMsg();

      if (modelo == '' || modelo == null || modelo == ' ') {
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
        $scope.bloco_msg_1["font-size"] = $(resp).find('tamanho_fonte_msg1').text() + "px";
        $scope.bloco_msg_2["font-size"] = $(resp).find('tamanho_fonte_msg2').text() + "px";
        $scope.bloco_msg_personalizada_style["font-size"] = $(resp).find('tamanho_fonte_msg3').text() + "px";
        $scope.bloco_cerimonia["font-size"] = $(resp).find('tamanho_fonte_msg4').text() + "px";
        $scope.bloco_nome_dos_noivos["font-size"] = $(resp).find('tamanho_fonte_pais_noiva').text() + "px";
        $scope.bloco_pais_noiva["font-size"] = $(resp).find('tamanho_fonte_pais_noivo').text() + "px";
        $scope.bloco_pais_noivo["font-size"] = $(resp).find('tamanho_nomecasal').text() + "px";

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

    var xml = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>' + self.getTextAlingIndice($scope.bloco_msg_1["text-align"]) + '</alinhamento_msg1><alinhamento_msg2>' + self.getTextAlingIndice($scope.bloco_msg_2["text-align"]) + '</alinhamento_msg2><alinhamento_msg3>' + self.getTextAlingIndice($scope.bloco_msg_personalizada_style["text-align"]) + '</alinhamento_msg3><alinhamento_msg4>' + self.getTextAlingIndice($scope.bloco_cerimonia["text-align"]) + '</alinhamento_msg4><alinhamento_nomecasal>' + self.getTextAlingIndice($scope.bloco_nome_dos_noivos["text-align"]) + '</alinhamento_nomecasal><alinhamento_pais_noiva>' + self.getTextAlingIndice($scope.bloco_pais_noiva["text-align"]) + '</alinhamento_pais_noiva><alinhamento_pais_noivo>' + self.getTextAlingIndice($scope.bloco_pais_noivo["text-align"]) + '</alinhamento_pais_noivo><conteudo_msg1>' + $scope.conteudo_msg1 + '</conteudo_msg1><conteudo_msg2>' + $scope.conteudo_msg2 + '</conteudo_msg2><conteudo_msg3>' + $scope.bloco_msg_personalizada + '</conteudo_msg3><conteudo_msg4>' + $scope.conteudo_msg4 + '</conteudo_msg4><conteudo_nomecasal>' + user.dadosCasal.nome_noiva + ' &#38; ' + user.dadosCasal.nome_noivo + '</conteudo_nomecasal><conteudo_pais_noiva>' + user.convite_dados.noiva_pai + '#' + user.convite_dados.noiva_mae + '</conteudo_pais_noiva><conteudo_pais_noivo>' + user.convite_dados.noivo_pai + '#' + user.convite_dados.noivo_mae + '</conteudo_pais_noivo><cor_msg1>' + $scope.bloco_msg_1["color"] + '</cor_msg1><cor_msg2>' + $scope.bloco_msg_2["color"] + '</cor_msg2><cor_msg3>' + $scope.bloco_msg_personalizada_style["color"] + '</cor_msg3><cor_msg4>' + $scope.bloco_cerimonia["color"] + '</cor_msg4><cor_nomecasal>' + $scope.bloco_nome_dos_noivos["color"] + '</cor_nomecasal><cor_pais_noiva>' + $scope.bloco_pais_noiva["color"] + '</cor_pais_noiva><cor_pais_noivo>' + $scope.bloco_pais_noivo["color"] + '</cor_pais_noivo><fonte_msg1>' + user.convite_formatacao.bloco_msg_1['font-family'] + '</fonte_msg1><fonte_msg2>' + user.convite_formatacao.bloco_msg_2['font-family'] + '</fonte_msg2><fonte_msg3>' + user.convite_formatacao.bloco_msg_personalizada_style['font-family'] + '</fonte_msg3><fonte_msg4>' + user.convite_formatacao.bloco_cerimonia['font-family'] + '</fonte_msg4><fonte_nomecasal>' + user.convite_formatacao.bloco_nome_dos_noivos['font-family'] + '</fonte_nomecasal><fonte_pais_noiva>' + user.convite_formatacao.bloco_pais_noiva['font-family'] + '</fonte_pais_noiva><fonte_pais_noivo>' + user.convite_formatacao.bloco_pais_noivo['font-family'] + '</fonte_pais_noivo><id_casal>' + user.id + '</id_casal><id_modelo>' + modelo + '</id_modelo><tamanho_fonte_msg1>' + self.removePx($scope.bloco_msg_1["font-size"]) + '</tamanho_fonte_msg1><tamanho_fonte_msg2>' + self.removePx($scope.bloco_msg_2["font-size"]) + '</tamanho_fonte_msg2><tamanho_fonte_msg3>' + self.removePx($scope.bloco_msg_personalizada_style["font-size"]) + '</tamanho_fonte_msg3><tamanho_fonte_msg4>' + self.removePx($scope.bloco_cerimonia["font-size"]) + '</tamanho_fonte_msg4><tamanho_fonte_pais_noiva>' + self.removePx($scope.bloco_nome_dos_noivos["font-size"]) + '</tamanho_fonte_pais_noiva><tamanho_fonte_pais_noivo>' + self.removePx($scope.bloco_pais_noiva["font-size"]) + '</tamanho_fonte_pais_noivo><tamanho_nomecasal>' + self.removePx($scope.bloco_pais_noivo["font-size"]) + '</tamanho_nomecasal></DadosFormatacaoConvite>';

    ConfiguracaoTemplateConvite.setData(xml);
  };

  $scope.getConfiguracaoConvite();

  // $scope.priceSlide = 12;
}]);

angular.module('dashboard').controller('configurar_evento', ['$scope', 'ConfiguracaoEvento', 'ListaHoteis', 'ListaSaloes', 'LojaPresentes', 'user', 'Cardapio', function ($scope, ConfiguracaoEvento, ListaHoteis, ListaSaloes, LojaPresentes, user, Cardapio) {

  $scope.getDadosEvento = function () {
    ConfiguracaoEvento.getData($scope.id).then(function (resp) {

      var respXml = $.parseXML(resp);
      $scope.festa_igual_cerimonia = $(respXml).find('Mesmo_local_cerimonia').text();
      $scope.festa_local = $(respXml).find('Local_festa').text();
      $scope.festa_end = $(respXml).find('Endereco').text();
      $scope.festa_numero = $(respXml).find('Numero').text();
      $scope.festa_bairro = $(respXml).find('Bairro').text();
      $scope.festa_cidade = $(respXml).find('Cidade').text();
      $scope.festa_rota = $(respXml).find('Tracar_rota_local').text();
      $scope.festa_cep = $(respXml).find('Cep').text();
    });
  };
  $scope.setDadosEvento = function () {

    var xmlVar = '<ConfiguracaoEvento xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.festa_bairro + '</Bairro><Cep>' + $scope.festa_cep + '</Cep><Cidade>' + $scope.festa_cidade + '</Cidade><Endereco>' + $scope.festa_end + '</Endereco><Estado></Estado><Horario_festa></Horario_festa><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Local_festa>' + $scope.festa_local + '</Local_festa><Mesmo_local_cerimonia>' + $scope.festa_igual_cerimonia + '</Mesmo_local_cerimonia><Numero>' + $scope.festa_numero + '</Numero><Obs></Obs><Pais></Pais><Tracar_rota_local>' + $scope.festa_rota + '</Tracar_rota_local></ConfiguracaoEvento>';

    ConfiguracaoEvento.setData(xmlVar);
  };

  $scope.consultCEP = function () {
    var cep = $scope.festa_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.festa_end = data.logradouro;
        $scope.festa_bairro = data.bairro;
        $scope.festa_cidade = data.cidade;
      }
    });
  };


  //HOTEL
  $scope.consultCEPHotel = function () {
    $scope.hotel_cep;
    var cep = $scope.hotel_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.hotel_end = data.logradouro;
        $scope.hotel_bairro = data.bairro;
        $scope.hotel_cidade = data.cidade;
      }
    });
  };
  $scope.getHoteis = function () {
    ListaHoteis.getData($scope.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.hotel_lista = [];
      $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {
        $scope.hotel_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Local': $(this).find('Nome').text(),
            'Endereco': $(this).find('Endereco').text(),
            'Numero': $(this).find('Numero').text(),
            'Bairro': $(this).find('Bairro').text(),
            'Cidade': $(this).find('Cidade').text()
          }
        );
      });
    });
  };
  $scope.getHoteis();
  $scope.removeHotel = function (id, key) {

    ListaHoteis.remove($scope.id, id).then(function (resp) {
      $scope.hotel_lista.splice(key, 1);
    });

  };
  $scope.adicionarHotel = function () {
    if ($scope.hotel_local != "" && $scope.hotel_local != null) {

      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.hotel_bairro + '</Bairro><Cidade>' + $scope.hotel_cidade + '</Cidade><CodigoArea></CodigoArea><Email></Email><Endereco>' + $scope.hotel_end + '</Endereco><Estado></Estado><Id>0</Id><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Nome>' + $scope.hotel_local + '</Nome><Numero>' + $scope.hotel_numero + '</Numero><Obs></Obs><Pais></Pais><Site></Site><Telefone></Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + $scope.hotel_rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

      ListaHoteis.setData(xmlVar).then(function (resp) {
        $scope.getHoteis();
        $scope.hotel_local = "";
        $scope.hotel_cep = "";
        $scope.hotel_end = "";
        $scope.hotel_numero = "";
        $scope.hotel_bairro = "";
        $scope.hotel_cidade = "";
      });
    }
  };


  //SALAO
  $scope.consultCEPSalao = function () {
    var cep = $scope.salao_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.salao_end = data.logradouro;
        $scope.salao_bairro = data.bairro;
        $scope.salao_cidade = data.cidade;
      }
    });
  };
  $scope.getSaloes = function () {
    ListaSaloes.getData($scope.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.salao_lista = [];
      $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {

        $scope.salao_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Local': $(this).find('Nome').text(),
            'Endereco': $(this).find('Endereco').text(),
            'Numero': $(this).find('Numero').text(),
            'Bairro': $(this).find('Bairro').text(),
            'Cidade': $(this).find('Cidade').text()
          }
        );
      });
    });
  };
  $scope.getSaloes();
  $scope.removeSalao = function (id, key) {
    ListaSaloes.remove($scope.id, id).then(function (resp) {
      $scope.salao_lista.splice(key, 1);
    });
  };
  $scope.adicionarSalao = function () {
    if ($scope.salao_local != "" && $scope.salao_local != null) {
      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.salao_bairro + '</Bairro><Cidade>' + $scope.salao_cidade + '</Cidade><CodigoArea>String content</CodigoArea><Email>String content</Email><Endereco>' + $scope.salao_end + '</Endereco><Estado>String content</Estado><Id>0</Id><Id_usuario_logado>15</Id_usuario_logado><Nome>' + $scope.salao_local + '</Nome><Numero>' + $scope.salao_numero + '</Numero><Obs>String content</Obs><Pais>String content</Pais><Site>String content</Site><Telefone>String content</Telefone><TipoLogradouro>String content</TipoLogradouro><Tracar_rota_local>' + $scope.salao_rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

      ListaSaloes.setData(xmlVar).then(function (resp) {
        $scope.getSaloes();
        $scope.getSaloes();
        $scope.salao_local = "";
        $scope.salao_cep = "";
        $scope.salao_end = "";
        $scope.salao_numero = "";
        $scope.salao_bairro = "";
        $scope.salao_cidade = "";
      });

    }
  };

  //PRESENTE
  $scope.getPresentes = function () {
    LojaPresentes.getData($scope.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.loja_lista = [];
      $(respXml).find('ConfiguracaoLojaPresentes').each(function () {
        $scope.loja_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Nome': $(this).find('Nome').text(),
            'URL': $(this).find('Url').text()
          }
        );
      });
    });
  };
  $scope.getPresentes();
  $scope.removeUrl = function (id, key) {
    LojaPresentes.remove($scope.id, id).then(function (resp) {
      $scope.loja_lista.splice(key, 1);
    });
  };
  $scope.adicionarUrl = function () {
    if ($scope.loja_nome != "" && $scope.loja_nome != null) {
      var xmlVar = '<ConfiguracaoLojaPresentes xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id>0</Id><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Nome>' + $scope.loja_nome + '</Nome><Url>' + $scope.loja_url + '</Url></ConfiguracaoLojaPresentes>';

      LojaPresentes.setData(xmlVar).then(function (resp) {
        $scope.getPresentes();
        $scope.loja_nome = "";
        $scope.loja_url = "";
      });
    }
  };

  $scope.produtos = [
    {
      nome: 'Cappucino em um café bacana',
      urlImage: './image/produtos/cappucino.png',
      valor: 'R$50'
    },
    {
      nome: 'Visita a um museu descolado',
      urlImage: './image/produtos/museu.png',
      valor: 'R$80'
    },
    {
      nome: 'Massagem',
      urlImage: './image/produtos/massagem.png',
      valor: 'R$100'
    },
    {
      nome: 'Passeio de bike',
      urlImage: './image/produtos/bike.png',
      valor: 'R$150'
    },
    {
      nome: 'Aluguel de carro',
      urlImage: './image/produtos/carro.png',
      valor: 'R$200'
    },
    {
      nome: 'Jantar à luz de velas',
      urlImage: './image/produtos/jantar.png',
      valor: 'R$250'
    },
    {
      nome: 'Passeio inebriente por vinícula',
      urlImage: './image/produtos/vinicula.png',
      valor: 'R$300'
    },
    {
      nome: 'Quarto de hotel ',
      urlImage: './image/produtos/quarto.png',
      valor: 'R$350'
    },
    {
      nome: 'Passeio de balão',
      urlImage: './image/produtos/balao.png',
      valor: 'R$400'
    },
    {
      nome: 'Passeio de barco',
      urlImage: './image/produtos/barco.png',
      valor: 'R$450'
    },
    {
      nome: 'Mergulho nos corais',
      urlImage: './image/produtos/corais.png',
      valor: 'R$500'
    },
    {
      nome: 'Valor livre para o convidado',
      urlImage: './image/produtos/livre.png',
      valor: 'R$'
    }
  ];


  // CARDAPIO
  $scope.getListaCardapio = function () {
    Cardapio.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      user.lista_cardapio = [];
      $(respXml).find('Cardapio').each(function () {

        user.lista_cardapio.push(
          {
            'Id': $(this).find('Id').text(),
            'Nome': $(this).find('Nome').text(),
            'Descricao': $(this).find('Descricao').text()
          }
        );
      });
      $scope.lista_cardapio = user.lista_cardapio;
    });
  };

  $scope.setCardapio = function () {

    if ($scope.cardapio_descricao != "" && $scope.cardapio_descricao != null) {
      var xmlVar = '<Cardapio xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Descricao>' + $scope.cardapio_descricao + '</Descricao><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + $scope.cardapio_title + '</Nome></Cardapio>';

      Cardapio.setData(xmlVar).then(function (resp) {
        $scope.getListaCardapio();
        $scope.cardapio_title = "";
        $scope.cardapio_descricao = "";
      });
    }
  };

  $scope.removerCardapio = function (id, key) {
    Cardapio.remove(user.id, id).then(function (resp) {
      user.lista_cardapio.splice(key, 1);

      $scope.lista_cardapio = user.lista_cardapio;
    });
  };

  if (user.lista_cardapio.length == 0) {
    $scope.getListaCardapio();
  } else {
    $scope.lista_cardapio = null;
    $scope.lista_cardapio = user.lista_cardapio;
  }

}]);

angular.module("dashboard").controller('cadastrar_convidados', ['$scope', 'Convidados', 'Upload', function ($scope, Convidados, Upload) {

  $scope.uploadFile = function () {

  };
  $scope.getConvidados = function () {
    Convidados.getData($scope.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.convidado_lista = [];
      $(respXml).find('Convidado').each(function () {
        $scope.convidado_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'nome': $(this).find('Nome').text(),
            'email': $(this).find('Email').text(),
            'convidados': $(this).find('Qtde_Acompanhantes').text(),
            'telefone': $(this).find('Bairro').text()
          }
        );
      });
    });
  };
  $scope.getConvidados();
  $scope.removeConvidado = function (id, key) {
    Convidados.remove($scope.id, id).then(function () {
      $scope.convidado_lista.splice(key, 1);
    });
  }

  $scope.adicionarConvidado = function () {
    if ($scope.convidado_nome != "" && $scope.convidado_nome != null) {
      var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + $scope.convidado_email + '</Email><Id>0</Id><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Nome>' + $scope.convidado_nome + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + $scope.convidado_acompanhantes + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';

      Convidados.setData(xmlVar).then(function (resp) {
        $scope.getConvidados();
        $scope.convidado_nome = "";
        $scope.convidado_acompanhantes = "";
        $scope.convidado_email = "";
        $scope.convidado_telefone = "";
      });
    }
  }
}]);

angular.module("dashboard").controller('enviar_convite', ['$scope', function ($scope) { }]);

angular.module("dashboard").controller('enviar_convite2', ['$scope', function ($scope) { }]);

angular.module("dashboard").controller('save_date', ['$scope', 'Upload', function ($scope, Upload) { }]);

angular.module("dashboard").controller('save_date2', ['$scope', 'Upload', function ($scope, Upload) {

  $scope.selectedAll = false;

  $scope.checkAll = function () {
    if ($scope.selectedAll) {
      $scope.selectedAll = true;
    } else {
      $scope.selectedAll = false;
    }
    angular.forEach($scope.convidado_lista, function (item, key) {
      $scope.item0 = $scope.selectedAll;
    });

  };
}]);
