// retorna um ajax formatado de acordo com o serviço do sistema
angular.module("dashboard").service("CallAjax", ['ipService', function (ipService) {
  return {
    resposta: function (urlVar, xmlVar) {
      var dataVar = { "uri": urlVar, "xml": xmlVar };
      var call = $.ajax({
        type: 'POST',
        url: "https://" + ipService.ip + "/web/service_request.aspx",
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
}]);