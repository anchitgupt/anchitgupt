// index.js

require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');
const fetch = require('node-fetch');

const MUSTACHE_MAIN_DIR = './main.mustache';
/**
  * DATA is the object that contains all
  * the data to be provided to Mustache
  * Notice the "name" and "date" property.
*/
let DATA = {
  name: 'Anchit Gupta',
  date: new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Asia/Kolkata',
  }),
};

// 
// Weather Information
// 

async function setWeatherInformation() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=moradabad&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  )
    .then(r => r.json())
    .then(r => {
      DATA.city_temperature = Math.round(r.main.temp);
      DATA.city_weather = r.weather[0].description;
      DATA.city_weather_icon = r.weather[0].icon;
      DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
      DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
    });
}



/**
* Function to get the Latest Instagram Posts from the Account.   
*
*/
const mediumService = require('./services/medium.service');

// ... (existing imports)

// ... (DATA definition - no change, but we will add Logic)

// ...

/**
* Function to get the Latest Instagram Posts from the Account.   
*
*/
async function setInstagramPosts() {
  const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('anchitgupt', 3);

  // Fallback images if scraping fails
  const fallbackImages = [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1561585446-7dd38f4f6a8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  ];

  DATA.img1 = instagramImages[0] || fallbackImages[0];
  DATA.img2 = instagramImages[1] || fallbackImages[1];
  DATA.img3 = instagramImages[2] || fallbackImages[2];
}

async function setMediumPosts() {
  const posts = await mediumService.getLatestPosts();
  DATA.posts = posts;
}


/**
* Function to send the DATA into the README
*/

async function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  /**
   * Fetch Weather
   */
  await setWeatherInformation();

  /**
   * Get pictures
   */
  await setInstagramPosts();

  /**
   * Get Blog Posts
   */
  await setMediumPosts();

  /**
   * Generate README
   */
  await generateReadMe();

  /**
   * Fermeture de la boutique 👋
   */
  await puppeteerService.close();

  console.log(DATA)
}

action();
