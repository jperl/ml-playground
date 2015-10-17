var co = require('co');
var Nightmare = require('nightmare');
var thunkify = require('thunkify');

var mkdirp = thunkify(require('mkdirp'));

const imageDir = './screenshots';

const nightmare = Nightmare();

co(function* () {
  yield mkdirp(imageDir);

  console.log('HEYO');

  var inputsToScreenshot = yield nightmare
    .goto('https://github.com/')
    .evaluate(function () {
      var rects = [];

      [].forEach.call(document.querySelectorAll('input'), function (input) {
        // Ignore hidden elements
        if (input.offsetParent === null) return;

        var rect = input.getBoundingClientRect();
        rects.push({
          x: parseInt(rect.left, 10),
          y: parseInt(rect.top, 10),
          width: parseInt(rect.width, 10),
          height: parseInt(rect.height, 10)
        });
      });

      return rects;
    });

  var i = 0;

  yield inputsToScreenshot.map(function (rect) {
    return nightmare.screenshot('screenshots/input-' + i++ + '.png', rect);
  });
}).then(function () {
  console.log('Sup biatches!!');
});
