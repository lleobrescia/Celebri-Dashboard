angular.module("dashboard").factory('AutenticacaoNoivos', function(){
  return {
    login: function(id){
      var dataVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>'+id+'</Id_casal></IdentificaocaoCasal>';
      var urlVar  = "http://23.238.16.114/celebri/ServiceCasamento.svc/RetornarConfiguracaoConvite";

      $.ajax({
        type: 'POST',
        url: "http://23.238.16.114/celebri/web/service_request.aspx",
        contentType: 'text/xml',
        data:  dataVar,
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(msg) {
          return $.parseXML(msg);
        },
        error: function(msg) {
          console.log(msg);
        }
      });
    }
  }
});