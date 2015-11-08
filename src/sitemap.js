import _ from 'lodash';
import rp from 'request-promise';

async function getTopHnStories() {
  var storyIds = await rp('https://hacker-news.firebaseio.com/v0/topstories.json');
  storyIds = JSON.parse(storyIds);
  storyIds = _.take(storyIds, 20);

  console.log(storyIds);

  // var stories = storyIds.map(function (storyId) {
  // 	return rp(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
  // });

  // var urls = stories.map(function (story) {
  //   return JSON.parse(story.body).url;
  // });

  return urls;
}

getTopHnStories();
