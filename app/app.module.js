(function () {
  'use strict';

  /**
   * @ngdoc config
   * @scope {}
   * @name startup
   * @memberof dashboard
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Modulo principal do dshboard.<br>
   * @param {module} ngMaterial    - Material Design para Angular {@link https://material.angularjs.org/latest/}
   * @param {module} ngAria        - Necessario para o ngMaterial {@link https://docs.angularjs.org/api/ngAria}
   * @param {module} ngMessages    - Necessario para o ngMaterial {@link https://docs.angularjs.org/api/ngMessages/directive/ngMessages}
   * @param {module} ui.router     - Rotas do Angular(troca de view) {@link https://github.com/angular-ui/ui-router}
   * @param {module} toastr        - Notificações {@link https://github.com/CodeSeven/toastr}
   * @param {module} ngMask        - Mascara para os inputs {@link https://github.com/candreoliveira/ngMask}
   * @param {module} ngImageEditor - Usado para recortar a foto do casal {@link https://github.com/SparrowJang/ngImageEditor}
   * @param {module} ngMdIcons     - Icones para o ngMaterial {@link https://klarsys.github.io/angular-material-icons/}
   * @param {module} chart.js      - Cria graficos {@link http://jtblin.github.io/angular-chart.js/}
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/module} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#startup-logic} Para melhores praticas
   */
  angular.module('dashboard', [
    'ngMaterial',
    'ngAria',
    'ngMessages',
    'ui.router',
    'toastr',
    'ngMask',
    'ngImageEditor',
    'ngMdIcons',
    'ngSanitize',
    'chart.js'
  ]);
})();