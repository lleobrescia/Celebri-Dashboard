angular.module('dashboard').directive("navigation", [function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      menu: '='
    },
    templateUrl: '/dashboard/templates/navigation.html'
  };
}]);
angular.module('dashboard').directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  };
});
angular.module('dashboard').directive('httpPrefix', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, controller) {
      function ensureHttpPrefix(value) {
        // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
        if (value && !/^(https?):\/\//i.test(value)
          && 'http://'.indexOf(value) !== 0 && 'https://'.indexOf(value) !== 0) {
          controller.$setViewValue('http://' + value);
          controller.$render();
          return 'http://' + value;
        }
        else
          return value;
      }
      controller.$formatters.push(ensureHttpPrefix);
      controller.$parsers.splice(0, 0, ensureHttpPrefix);
    }
  };
});
angular.module('dashboard').filter('twoDigits', function () {
  return function (n) {
    var num = parseInt(n, 10);

    if (isNaN(num)) {
      return n;
    }

    if (num / 10 < 1) {
      num = '0' + num;
    }

    return num;
  };
});