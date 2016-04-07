// INIT
angular.module("dashboard", ['ngRoute', 'ngFileUpload', 'ngMask', 'rzModule', 'ngAnimate', 'ui.bootstrap']);

//Controllers
angular.module('dashboard').controller('sidebar', ['$scope', '$location', function($scope, $location) {

  //Verifica em qual pag esta
  $scope.isActive = function(viewLocation) {
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
angular.module("dashboard").controller('mainController', ['$scope', function($scope) {
  $scope.id = 15;

  $scope.foto;

  $scope.hotel_lista = [];
  $scope.hotel_local;
  $scope.hotel_cep;
  $scope.hotel_end;
  $scope.hotel_numero;
  $scope.hotel_bairro;
  $scope.hotel_cidade;
  $scope.hotel_rota;

  $scope.salao_lista = [];
  $scope.salao_local;
  $scope.salao_cep;
  $scope.salao_end;
  $scope.salao_numero;
  $scope.salao_bairro;
  $scope.salao_cidade;
  $scope.salao_rota;

  $scope.loja_lista = [];
  $scope.loja_nome;
  $scope.loja_url;

  $scope.convidado_lista = [];
  $scope.canvidado_nome;
  $scope.canvidado_acompanhantes;
  $scope.canvidado_email;
  $scope.canvidado_telefone;

  $scope.moip_aceitou;
  $scope.moip_nome;
  $scope.moip_cpf;
  $scope.moip_email;
  $scope.moip_nascimento;
  $scope.moip_rua;
  $scope.moip_cep;
  $scope.moip_numero;
  $scope.moip_complemento;
  $scope.moip_bairro;
  $scope.moip_estado;
  $scope.moip_cidade;
  $scope.moip_produtos = [];

  $scope.bandeira;
  $scope.pagamento_numero;
  $scope.pagamento_nome;
  $scope.pagamento_mes;
  $scope.pagamento_ano;
  $scope.pagamento_seguraca;

  //for ng-repeat
  $scope.getTimes = function(n) {
    return new Array(n);
  };
}]);

angular.module("dashboard").controller('dados_casal', ['$scope', 'Upload', 'DadosCasal', function($scope, Upload, DadosCasal) {

  $scope.casalGetDados = function() {
    DadosCasal.getData($scope.id).then(function(resp) {
      var respXml = $.parseXML(resp);
      $scope.nome_noivo = $(respXml).find('NomeNoivo').text();
      $scope.nome_noiva = $(respXml).find('NomeNoiva').text();

      var data = $(respXml).find('DataCasamento').text().split('/');
      $scope.data_casamento = new Date(data[2], data[1], data[0]);
    });
  };
  $scope.casalGetDados();
}]);

angular.module("dashboard").controller('configurar_convite', ['$scope', 'ConfiguracaoConvite', function($scope, ConfiguracaoConvite) {

  $scope.consultCEP = function() {
    var cep = $scope.cerimonia_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function(data) {
        $scope.cerimonia_end = data.logradouro;
        $scope.cerimonia_bairro = data.bairro;
        $scope.cerimonia_cidade = data.cidade;
      }
    });
  };

  $scope.getDadosConvite = function() {
    ConfiguracaoConvite.getData($scope.id).then(function(resp) {

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
    });
  };
  $scope.setDadosConvite = function() {
    var hora = $scope.cerimonia_hora + ":" + $scope.cerimonia_min;
    var xml = '<ConfiguracaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.cerimonia_bairro + '</Bairro><Cep>' + $scope.cerimonia_cep + '</Cep><Cidade>' + $scope.cerimonia_cidade + '</Cidade><Endereco>' + $scope.cerimonia_end + '</Endereco><Estado></Estado><Horario_cerimonia>' + hora + '</Horario_cerimonia><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Local_cerimonia>' + $scope.cerimonia_local + '</Local_cerimonia><Mae_noiva>' + $scope.noiva_mae + '</Mae_noiva><Mae_noiva_in_memoriam>' + $scope.noiva_mae_memorian + '</Mae_noiva_in_memoriam><Mae_noivo>' + $scope.noivo_mae + '</Mae_noivo><Mae_noivo_in_memoriam>' + $scope.noivo_mae_memorian + '</Mae_noivo_in_memoriam><Msg1></Msg1><Msg2></Msg2><Msg3></Msg3><Msg4></Msg4><Msg5></Msg5><Msg6></Msg6><Numero>' + $scope.cerimonia_numero + '</Numero><Obs></Obs><Pai_noiva>' + $scope.noiva_pai + '</Pai_noiva><Pai_noiva_in_memoriam>' + $scope.noiva_pai_memorian + '</Pai_noiva_in_memoriam><Pai_noivo>' + $scope.noivo_pai + '</Pai_noivo><Pai_noivo_in_memoriam>' + $scope.noivo_pai_memorian + '</Pai_noivo_in_memoriam><Pais></Pais><Tracar_rota_local>' + $scope.cerimonia_rota + '</Tracar_rota_local></ConfiguracaoConvite>';

    ConfiguracaoConvite.setData(xml);
  };

  $scope.getDadosConvite();

}]);

angular.module("dashboard").controller('configurar_convite2', ['$scope', '$http', function($scope, $http) {

  $scope.layoutSelecionado;

  //style
  $scope.bloco_pais_noiva;
  $scope.bloco_pais_noivo;
  $scope.bloco_msg_1;
  $scope.bloco_nome_dos_noivos;
  $scope.bloco_msg_2;
  $scope.bloco_msg_personalizada_style;
  $scope.bloco_cerimonia;

  $scope.bloco_msg_personalizada = "Este é um texto de referência para a mensagem do seu convite. Para editá-lo basta clicar aqui e reescrever. Se você optar por não ter nenhuma mensagem, basta deixar em branco.";

  $scope.convites = [];
  $scope.convite_individual;

  $scope.showBlocos = [
    { "ativo": true },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false }
  ];

  // Esconde o painel lateral quando chega perto do radepe
  $(window).scroll(function() {
    var elementoffset = $('#convites_layout').offset();
    if ($(this).scrollTop() < elementoffset.top - 500) {
      $('.controll').fadeIn(10);

    } else {
      $('.controll').fadeOut(10);
    }
  });

  $scope.setBlocoActive = function(index) {
    for (var i = 0; i < $scope.showBlocos.length; i++) {
      $scope.showBlocos[i]["ativo"] = false;
    };
    $scope.showBlocos[index]["ativo"] = true;
  };

  $http.get('data/convites.json')
    .then(function(res) {
      $scope.convites = res.data;

      $scope.setConvite('convite1', './image/convites/convite1.png');
    });

  $scope.setConvite = function(convite, imagem) {
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

  // $scope.priceSlide = 12;

}]);

angular.module('dashboard').controller('configurar_evento', ['$scope', 'ConfiguracaoEvento', 'ListaHoteis','ListaSaloes','LojaPresentes', function($scope, ConfiguracaoEvento, ListaHoteis,ListaSaloes,LojaPresentes) {

  $scope.getDadosEvento = function() {
    ConfiguracaoEvento.getData($scope.id).then(function(resp) {

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
  $scope.setDadosEvento = function() {
    console.log($scope.festa_local);
    var xmlVar = '<ConfiguracaoEvento xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.festa_bairro + '</Bairro><Cep>' + $scope.festa_cep + '</Cep><Cidade>' + $scope.festa_cidade + '</Cidade><Endereco>' + $scope.festa_end + '</Endereco><Estado></Estado><Horario_festa></Horario_festa><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Local_festa>' + $scope.festa_local + '</Local_festa><Mesmo_local_cerimonia>' + $scope.festa_igual_cerimonia + '</Mesmo_local_cerimonia><Numero>' + $scope.festa_numero + '</Numero><Obs></Obs><Pais></Pais><Tracar_rota_local>' + $scope.festa_rota + '</Tracar_rota_local></ConfiguracaoEvento>';
    console.log($.parseXML(xmlVar));
    ConfiguracaoEvento.setData(xmlVar);
  };
  $scope.consultCEP = function() {
    var cep = $scope.festa_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function(data) {
        $scope.festa_end = data.logradouro;
        $scope.festa_bairro = data.bairro;
        $scope.festa_cidade = data.cidade;
      }
    });
  };

  $scope.consultCEPHotel = function() {
    var cep = $scope.hotel_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function(data) {
        $scope.hotel_end = data.logradouro;
        $scope.hotel_bairro = data.bairro;
        $scope.hotel_cidade = data.cidade;
      }
    });
  };

  $scope.consultCEPSalao = function() {
    var cep = $scope.salao_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function(data) {
        $scope.salao_end = data.logradouro;
        $scope.salao_bairro = data.bairro;
        $scope.salao_cidade = data.cidade;
      }
    });
  };


  ListaHoteis.getData($scope.id).then(function(resp) {
    var respXml = $.parseXML(resp);
    $(respXml).find('ConfiguracaoGenericaEndereco').each(function() {
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

  $scope.removeHotel = function(key) {
    $scope.hotel_lista.splice(key, 1);
  };

  $scope.adicionarHotel = function() {
    if ($scope.hotel_local != "" && $scope.hotel_local != null) {
      $scope.hotel_lista.push(
        {
          'Local': $scope.hotel_local,
          'CEP': $scope.hotel_cep,
          'Endereco': $scope.hotel_end,
          'Numero': $scope.hotel_numero,
          'Bairro': $scope.hotel_bairro,
          'Cidade': $scope.hotel_cidade
        }
      );
      $scope.hotel_local = "";
      $scope.hotel_cep = "";
      $scope.hotel_end = "";
      $scope.hotel_numero = "";
      $scope.hotel_bairro = "";
      $scope.hotel_cidade = "";
    }
  };

  ListaSaloes.getData($scope.id).then(function(resp) {
    var respXml = $.parseXML(resp);
    console.log(respXml);
    $(respXml).find('ConfiguracaoGenericaEndereco').each(function() {
      console.log($(this).find('Endereco').text());
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

  $scope.removeSalao = function(key) {
    $scope.salao_lista.splice(key, 1);
  };
  $scope.adicionarSalao = function() {
    if ($scope.salao_local != "" && $scope.salao_local != null) {
      $scope.salao_lista.push(
        {
          'Local': $scope.salao_local,
          'CEP': $scope.salao_cep,
          'Endereco': $scope.salao_end,
          'Numero': $scope.salao_numero,
          'Bairro': $scope.salao_bairro,
          'Cidade': $scope.salao_cidade
        }
      );
      $scope.salao_local = "";
      $scope.salao_cep = "";
      $scope.salao_end = "";
      $scope.salao_numero = "";
      $scope.salao_bairro = "";
      $scope.salao_cidade = "";
    }
  };

  LojaPresentes.getData($scope.id).then(function(resp) {
    var respXml = $.parseXML(resp);
    console.log(resp);
    $(respXml).find('ConfiguracaoLojaPresentes').each(function() {
      $scope.loja_lista.push(
        {
          'Id': $(this).find('Id').text(),
          'Nome': $(this).find('Nome').text(),
          'URL': $(this).find('Url').text()
        }
      );
    });
  });
  $scope.removeUrl = function(key) {
    $scope.loja_lista.splice(key, 1);
  };
  $scope.adicionarUrl = function() {
    if ($scope.loja_nome != "" && $scope.loja_nome != null) {
      $scope.loja_lista.push(
        {
          'Nome': $scope.loja_nome,
          'URL': $scope.loja_url
        }
      );
      $scope.loja_nome = "";
      $scope.loja_url = "";
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

}]);

angular.module("dashboard").controller('cadastrar_convidados', ['$scope', function($scope) {
  $scope.removeConvidado = function(key) {
    $scope.convidado_lista.splice(key, 1);
  }
  $scope.adicionarConvidado = function() {
    if ($scope.canvidado_nome != "" && $scope.canvidado_nome != null) {
      $scope.convidado_lista.push(
        {
          'nome': $scope.canvidado_nome,
          'email': $scope.canvidado_email,
          'convidados': $scope.canvidado_acompanhantes,
          'telefone': $scope.canvidado_telefone
        }
      );
      $scope.canvidado_nome = "";
      $scope.canvidado_acompanhantes = "";
      $scope.canvidado_email = "";
      $scope.canvidado_telefone = "";
    }
  }
}]);

angular.module("dashboard").controller('enviar_convite', ['$scope', function($scope) { }]);

angular.module("dashboard").controller('enviar_convite2', ['$scope', function($scope) { }]);

angular.module("dashboard").controller('save_date', ['$scope', 'Upload', function($scope, Upload) { }]);

angular.module("dashboard").controller('save_date2', ['$scope', 'Upload', function($scope, Upload) {

  $scope.selectedAll = false;

  $scope.checkAll = function() {
    if ($scope.selectedAll) {
      $scope.selectedAll = true;
    } else {
      $scope.selectedAll = false;
    }
    angular.forEach($scope.convidado_lista, function(item, key) {
      $scope.item0 = $scope.selectedAll;
    });

  };
}]);
