import rp from 'request-promise';

export async function topHnStories() {
  const storyIds = await rp({
    uri: 'https://hacker-news.firebaseio.com/v0/topstories.json',
    json: true,
  });

  return storyIds;
}

export async function getHnStory(storyId) {
  return await rp({
    uri: `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
    json: true,
  });
}
