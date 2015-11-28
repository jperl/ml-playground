import 'babel/polyfill';

import _ from 'lodash';
import crypto from 'crypto';
import Promise from 'bluebird';

import Browser from './browser';
import {getHnStory, topHnStories} from './sites';

const fs = Promise.promisifyAll(require('fs'));
const mkdirp = Promise.promisifyAll(require('mkdirp'));

// const stories = [{ // for debugging
//   url: 'http://priceonomics.com/how-to-be-a-lawyer-without-going-to-law-school',
// }];

const browser = new Browser();

async function crawl() {
  let storyIds = await topHnStories();

  // The loaded story ids are the first part of the names of the directories under img
  // we can assume they are all directories -- don't store anything else there.
  const loadedStoryIds = (await fs.readdirAsync('./img')).map(dir => {
    return Number(dir.split('-')[0]);
  });

  // Crawl the next 100 stories
  storyIds = _.difference(storyIds, loadedStoryIds);

  storyIds = _.take(storyIds, 100);

  for (let i = 0; i < storyIds.length; i++) {
    const story = await getHnStory(storyIds[i]);

    // Ignore deleted stories, ask hn and pdfs
    if (!story || !story.url || story.url.indexOf('pdf') > -1) continue;

    browser.goTo(story.url);

    console.log('crawl', story.id, story.url);

    const hash = crypto.createHash('md5').update(story.url).digest('hex');
    const imageDir = `./img/${story.id}-${hash}`;

    // Make the imageDir
    await mkdirp.mkdirpAsync(imageDir);
    await fs.writeFileAsync(imageDir + '/url.txt', story.url);

    await browser.screenshotSelector('a', imageDir);
    await browser.screenshotSelector('input', imageDir);
  }

  console.log('DONE CRAWLING');
}

crawl();
