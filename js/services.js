//faz requisicao ajax e espera a resposta antes de retornar
angular.module("dashboard").service("PromiseUtils", function ($q) {
  return {
    getPromiseHttpResult: function (httpPromise) {
      var deferred = $q.defer();
      httpPromise.success(function (data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject(arguments);
      });
      return deferred.promise;
    }
  };
});

// retorna um ajax formatado de acordo com o serviço do sistema
angular.module("dashboard").service("CallAjax", function () {
  return {
    resposta: function (urlVar, xmlVar) {
      var dataVar = { "uri": urlVar, "xml": xmlVar };
      var call = $.ajax({
        type: 'POST',
        url: "http://23.238.16.114/celebri/web/service_request.aspx",
        contentType: 'text/xml; charset=utf-8',
        data: dataVar,
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      });
      return call;
    }
  };
});

angular.module("dashboard").factory('DadosCasal', ['CallAjax', '$q', function (CallAjax, $q) {
  var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarDadosCadastroNoivos";

  var getData = function (id) {
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/AtualizarDadosCadastroNoivos";

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  return {
    getData: getData,
    setData: setData
  };
}]);

angular.module("dashboard").factory('ConfiguracaoConvite', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarConfiguracaoConvite";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ConfiguracaoConvite";

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };


  return {
    getData: getData,
    setData: setData
  };
}]);

angular.module("dashboard").factory('ConfiguracaoTemplateConvite', ['CallAjax', '$q', function (CallAjax, $q) {

  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarFormatacaoConvite";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/FormatacaoConvite";

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  return {
    getData: getData,
    setData: setData
  };

}]);

angular.module("dashboard").factory('ConfiguracaoEvento', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarConfiguracaoEvento";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ConfiguracaoEvento";

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };


  return {
    getData: getData,
    setData: setData
  };
}]);

angular.module("dashboard").factory('ListaHoteis', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarConfiguracaoListaHoteis";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var remove = function (id, dataId) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ExcluirHoteis";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ConfigAdicionalEvento_ListaHoteis";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  return {
    getData: getData,
    remove: remove,
    setData: setData
  };
}]);

angular.module("dashboard").factory('ListaSaloes', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarConfiguracaoListaSaloes";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var remove = function (id, dataId) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ExcluirSaloes";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ConfigAdicionalEvento_ListaSaloes";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  return {
    getData: getData,
    remove: remove,
    setData: setData
  };
}]);

angular.module("dashboard").factory('LojaPresentes', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarConfiguracaoLojaPresentes";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var remove = function (id, dataId) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ExcluirLojasPresentes";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {

    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ConfigAdicionalEvento_LojaPresentes";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  return {
    getData: getData,
    remove: remove,
    setData: setData
  };
}]);


angular.module("dashboard").factory('Cardapio', ['CallAjax', '$q', function (CallAjax, $q) {

  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarCardapio";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  var remove = function (id, dataId) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ExcluirCardapio";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/CadastrarCardapio";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  return {
    getData: getData,
    remove: remove,
    setData: setData
  };
}]);

angular.module("dashboard").factory('Convidados', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarConvidados";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var remove = function (id, dataId) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ExcluirConvidados";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/CadastroConvidados";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  return {
    getData: getData,
    remove: remove,
    setData: setData
  };
}]);

angular.module("dashboard").factory('EstatisticaServ', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarEstatisticaCasamento";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  return {
    getData: getData,
  };
}]);

angular.module("dashboard").factory('AutenticacaoNoivos', ['CallAjax', '$q', function (CallAjax, $q) {
  var autenticar = function (email, senha) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/AutenticacaoNoivos";
    var xmlVar = '<Autenticacao xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + email + '</Email><Senha>' + senha + '</Senha></Autenticacao>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  var recuperarSenha = function (email) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/EnviarEmailRecuperacaoSenha";
    var xmlVar = '<EmailCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + email + '</Email></EmailCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };

  return {
    autenticar: autenticar,
    recuperarSenha: recuperarSenha
  };
}]);

angular.module("dashboard").factory('PresentesLuaDeMel', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarTodosProdutosLuaDeMel";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/ConfigurarPresentesEscolhidos";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  return {
    getData: getData,
    setData: setData
  };
}]);

angular.module("dashboard").factory('SaveTheDate', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarFormatacaoSaveTheDate";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var setData = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/FormatacaoSaveTheDate";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  var enviarEmail = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/EnvioEmailSaveTheDate";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  return {
    getData: getData,
    setData: setData,
    enviarEmail: enviarEmail
  };
}]);

angular.module("dashboard").factory('Convite', ['CallAjax', '$q', function (CallAjax, $q) {

  var enviarEmail = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri/ServiceCasamento.svc/EnvioEmailConvite";
    var call = CallAjax.resposta(urlVar, xmlVar);
    var deferred = $q.defer();

    call.success(function (data) {
      deferred.resolve(data);
    }).error(function () {
      deferred.reject(arguments);
    });
    return deferred.promise;
  };
  return {
    enviarEmail: enviarEmail
  };
}]);