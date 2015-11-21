import Nightmare from 'nightmare';
import Promise from 'bluebird';

const fs = Promise.promisifyAll(require('fs'));
const mkdirp = Promise.promisifyAll(require('mkdirp'));

export default class Browser {
  constructor() {
    this.nightmare = Nightmare(); // eslint-disable-line new-cap
  }

  goTo(url) {
    console.log('go to', url);
    this.page = this.nightmare.goto(url);
  }

  // Get the dimensions of the elements that match a selector
  getBoundingClientRects(selector) {
    const self = this;
    return Promise.coroutine(function* () {
      /* eslint-disable */
      return yield self.page.evaluate(function (qs) {
        // this gets evaluated in the browser, avoid complexity
        var rects = [];

        var elements = document.querySelectorAll(qs);
        [].forEach.call(elements, function (element) {
          // ignore non-visible elements
          if (element.offsetWidth < 1 || element.offsetHeight < 1) return;

          var rect = element.getBoundingClientRect();

          rect = {
            x: parseInt(rect.left, 10),
            y: parseInt(rect.top, 10),
            width: parseInt(rect.width, 10),
            height: parseInt(rect.height, 10),
          };

          rects.push(rect);
        });

        return rects;
      }, selector);
      /* eslint-enable */
    })();
  }

  async screenshot(element) {
    const self = this;
    return Promise.coroutine(function* () {
      return yield self.nightmare.screenshot(element.path, element.clip);
    })();
  }

  async screenshotSelector(selector, path) {
    const self = this;

    // Make the directory
    await mkdirp.mkdirpAsync(path);

    // Get the dimensions of the elements to screenshot
    const rects = await self.getBoundingClientRects(selector);

    const elements = rects.map((rect, index) => {
      return {
        path: `${path}/${selector}-${index}.png`,
        clip: rect,
      };
    });

    // Screenshot the elements in parallel
    await Promise.all(elements.map(element => {
      return self.screenshot(element);
    }));

    // Delete the 0kb (bad) screenshot
    const stats = await Promise.all(elements.map(element => {
      return fs.statAsync(element.path);
    }));

    // Delete the 0kb screenshots
    stats.forEach((stat, index) => {
      if (!stat.size) {
        fs.unlink(elements[index].path);
      }
    });

    console.log('finished screenshots for', selector);
  }
}
