angular.module("dashboard").factory('ServiceCasamento', ['CallAjax', '$q', '$http', function (CallAjax, $q, $http) {

  var SendData = function (urlVar, xmlVar) {
    var call;
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: 'php/dados.php'
    }).then(function (dados) {
      var autorizacao = JSON.parse(dados.data);
      var appid = autorizacao.appid;
      var token = autorizacao.token;

      call = CallAjax.resposta(urlVar, xmlVar, appid, token);

      call.success(function (data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject(arguments);
      });
    });

    return deferred.promise;
  };

  return {
    SendData: SendData
  };
}]);
