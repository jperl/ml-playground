// import Nightmare from 'nightmare';
// import Url from 'url';
// import thunkify from 'thunkify';

// import fs = Promise.promisify(require 'fs');

// // import mkdirp = thunkify(require('mkdirp';

// const imageDir = './screenshots';

// let nightmare;

// async function rectsForSelector(selector) {
//   return await page.evaluate(function (qs) {
//     var rects = [];
//     var elements = document.querySelectorAll(qs);
//     [].forEach.call(elements, function (element) {
//       // ignore non-visible elements
//       if (element.offsetWidth < 1 || element.offsetHeight < 1) return;

//       var rect = element.getBoundingClientRect();

//       rect = {
//         x: parseInt(rect.left, 10),
//         y: parseInt(rect.top, 10),
//         width: parseInt(rect.width, 10),
//         height: parseInt(rect.height, 10)
//       };

//       rects.push(rect);
//     });

//     return rects;
//   }, selector);
// };

// async function screenshotElements(id, url, selectors) {
//   if (!nightmare) nightmare = Nightmare();

//   // Make the screenshot directory
//   var pageDir = `${imageDir}/${id}`;
//   await fs.mkdirAsync(pageDir);

//   // Screenshot the visible elements 
//   var page = nightmare.goto(url);

//   var i = 0;

//   var imagePaths = [];

//   yield inputsToScreenshot.map(function (rect) {
//     var imagePath = pageImagesDir + '/' + selector + '-' + i++ + '.png';
//     imagePaths.push(imagePath);
//     return nightmare.screenshot(imagePath, rect);
//   });

//   // Delete the 0kb screenshots
//   var stats = yield imagePaths.map(function (fpath) {
//     return stat(fpath);
//   });

//   for (var p = 0; p < imagePaths.length; p++) {
//     if (!stats[p].size) {
//       fs.unlink(imagePaths[p]);
//     }
//   }
// };
