(function () {
  'use strict';

  angular
    .module('dashboard')
    .factory('PageService', PageService);

  function PageService() {
    var self = this;
    var title = '';

    var service = {
      SetTitle: SetTitle,
      title: title
    };

    return service;

    function SetTitle(titulo) {
      this.title = titulo;
    }
  }
})();
