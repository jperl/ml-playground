var co = require('co');
var fs = require('fs');
var Nightmare = require('nightmare');
var Url = require('url');

var thunkify = require('thunkify');
var mkdirp = thunkify(require('mkdirp'));
var shortid = require('shortid');
var stat = thunkify(fs.stat);

const imageDir = './screenshots';

var nightmare;

exports.screenshotElements = function (url, selector) {
  if (!nightmare) nightmare = Nightmare();

  return co(function* () {
    // Make the screenshot directory
    var pageImagesDir = `${imageDir}/${shortid.generate()}-${Url.parse(url).hostname}`;
    yield mkdirp(pageImagesDir);

    // Screenshot the visible elements 
    var page = nightmare.goto(url);

    var inputsToScreenshot = yield page.evaluate(function (qs) {
      var rects = [];
      var elements = document.querySelectorAll(qs);
      [].forEach.call(elements, function (element) {
        // ignore non-visible elements
        if (element.offsetWidth < 1 || element.offsetHeight < 1) return;

        var rect = element.getBoundingClientRect();

        rect = {
          x: parseInt(rect.left, 10),
          y: parseInt(rect.top, 10),
          width: parseInt(rect.width, 10),
          height: parseInt(rect.height, 10)
        };

        rects.push(rect);
      });

      return rects;
    }, selector);

    var i = 0;

    var imagePaths = [];

    yield inputsToScreenshot.map(function (rect) {
      var imagePath = pageImagesDir + '/' + selector + '-' + i++ + '.png';
      imagePaths.push(imagePath);
      return nightmare.screenshot(imagePath, rect);
    });

    // Delete the 0kb screenshots
    var stats = yield imagePaths.map(function (fpath) {
      return stat(fpath);
    });

    for (var p = 0; p < imagePaths.length; p++) {
      if (!stats[p].size) {
        fs.unlink(imagePaths[p]);
      }
    }
  });
};
