// TODO need to fix everything
// "nightmare": "^2.0.7",

let _ = require('lodash');
let co = require('co');
let request = require('co-request');

let webpage = require('./webpage');

function* topHnStories() {
  var storyIds = yield request('https://hacker-news.firebaseio.com/v0/topstories.json');
  storyIds = JSON.parse(storyIds.body);

  storyIds = _.take(storyIds, 20);

  var stories = yield storyIds.map(function (storyId) {
    return co(function () {
      return request(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    }).catch(onerror);
  });

  var urls = stories.map(function (story) {
    return JSON.parse(story.body).url;
  });

  return urls;
}

co(function* () {
  var urls = yield topHnStories();

  for (var u = 0; u < urls.length; u++) {
    var url = urls[u];
    if (url.indexOf('.pdf') < 0) {
      console.log('Crawling', url);
      yield webpage.screenshotElements(url, 'a');
      var folder = yield webpage.screenshotElements(url, 'input');
      // TODO if nothing in folder, delete it
    }
  }
}).catch(onerror);

function onerror(err) {
  console.error(err.stack);
}
