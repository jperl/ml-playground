import 'babel/polyfill';

import crypto from 'crypto';
import Promise from 'bluebird';

import Browser from './browser';
import topHnStories from './sites';

const fs = Promise.promisifyAll(require('fs'));
const mkdirp = Promise.promisifyAll(require('mkdirp'));

// const stories = [{ // for debugging
//   url: 'http://www.google.com',
// }];

async function crawl() {
  const stories = await topHnStories();

  const browser = new Browser();

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];

    await browser.goTo(story.url);

    const hash = crypto.createHash('md5').update(story.url).digest('hex');
    const path = `./img/${hash}`;

    // Make the path
    await mkdirp.mkdirpAsync(path);
    await fs.writeFileAsync(path + '/url.txt', story.url);

    await browser.screenshotSelector('a', path);
    await browser.screenshotSelector('input', path);
  }
}

crawl();
