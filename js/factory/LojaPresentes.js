angular.module("dashboard").factory('LojaPresentes', ['CallAjax', '$q', function (CallAjax, $q) {
  var getData = function (id) {
    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/RetornarConfiguracaoLojaPresentes";
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
    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/ExcluirLojasPresentes";
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

    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/ConfigAdicionalEvento_LojaPresentes";
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