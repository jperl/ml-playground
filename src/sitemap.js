import _ from 'lodash';
import rp from 'request-promise';

export default async function topHnStories() {
  let storyIds = await rp({
    uri: 'https://hacker-news.firebaseio.com/v0/topstories.json',
    json: true,
  });

  storyIds = _.take(storyIds, 5);

  let stories = await Promise.all(storyIds.map((storyId) => {
    return rp({
      uri: `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
      json: true,
    });
  }));

  // Filter out pdfs
  stories = _.filter(stories, (story) => {
    return story.url.indexOf('.pdf') < 0;
  });

  return stories;
}
