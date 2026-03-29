const puppeteer = require('puppeteer');

class PuppeteerService {
  browser;
  page;

  async init() {
    this.browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--incognito',
      ],
    });
  }

  async goToPage(url) {
    if (!this.browser) {
      await this.init();
    }
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US',
    });

    await this.page.goto(url, {
      waitUntil: 'networkidle0',
    });
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }

  async getLatestInstagramPostsFromAccount(acc, n) {
    const page = `https://www.picuki.com/profile/${acc}`;
    await this.goToPage(page);

    try {
      await this.page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const nodes = await this.page.evaluate(() => {
        const images = document.querySelectorAll('.post-image');
        return [].map.call(images, img => img.src);
      });

      return nodes.slice(0, n);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return [];
    }
  }
}

module.exports = new PuppeteerService();
