angular.module("dashboard").factory('SaveTheDate', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/RetornarFormatacaoSaveTheDate";
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
    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/FormatacaoSaveTheDate";
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
    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/EnvioEmailSaveTheDate";
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