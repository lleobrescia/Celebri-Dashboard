angular.module("dashboard").factory('Convite', ['CallAjax', '$q', function (CallAjax, $q) {

  var enviarEmail = function (xmlVar) {
    var urlVar = "http://23.238.16.114/celebri_dev/ServiceCasamento.svc/EnvioEmailConvite";
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