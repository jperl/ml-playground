import _ from 'lodash';
import rp from 'request-promise';

export async function topHnStories() {
  console.log('topHnStories');

  var storyIds = await rp({
    uri: 'https://hacker-news.firebaseio.com/v0/topstories.json',
    json: true
  });

  storyIds = _.take(storyIds, 5);

  console.log(topHnStories);

  var stories = await Promise.all(storyIds.map((storyId) => {
    return rp({
      uri: `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
      json: true
    });
  }));

  // Filter out pdfs
  stories = _.filter(stories, (story) => {
    return story.url.indexOf('.pdf') < 0;
  });

  console.log('We got here', stories);

  // For debugging only return one story
  return _.take(stories, 1);
}
