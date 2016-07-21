angular.module('dashboard').factory('consultCEP', ['CallAjax', '$q', function (CallAjax, $q) {

  var consultar = function (cepToConsult) {
    var cep = cepToConsult.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');

    if (cep.length > 7) {
      var call = $.ajax({ url: "https://api.postmon.com.br/v1/cep/" + cep });
      var deferred = $q.defer();

      call.success(function (data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject(arguments);
      });
      return deferred.promise;
    }
  };

  return {
    consultar: consultar
  };
}]);

