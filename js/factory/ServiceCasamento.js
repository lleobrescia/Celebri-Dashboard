angular.module("dashboard").factory('ServiceCasamento', ['CallAjax', '$q', function (CallAjax, $q) {

  var SendData = function (urlVar, xmlVar) {
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
    SendData: SendData
  };
}]);
