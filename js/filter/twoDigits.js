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