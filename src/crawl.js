import 'babel/polyfill';

import topHnStories from './sitemap';

async function crawl() {
  const stories = await topHnStories();

  stories.forEach(story => {
    console.log('crawl', story.url);
    // await webpage.screenshotElements(story.url, ['a', 'input']);
  });
}

crawl();
