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