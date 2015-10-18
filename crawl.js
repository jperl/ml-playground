'use strict';

let _ = require('lodash');
let co = require('co');
let request = require('co-request');

let webpage = require('./webpage');

function* topHnStories() {
  var storyIds = yield request('https://hacker-news.firebaseio.com/v0/topstories.json');
  storyIds = JSON.parse(storyIds.body);

  storyIds = _.take(storyIds, 10);

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
    yield webpage.screenshotElements(url, 'a');
    yield webpage.screenshotElements(url, 'input');
  }
}).catch(onerror);

function onerror(err) {
  console.error(err.stack);
}
