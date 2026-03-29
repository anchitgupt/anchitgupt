require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');
const mediumService = require('./services/medium.service');
const fetch = require('node-fetch');

const MUSTACHE_MAIN_DIR = './main.mustache';

const DATA = {
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

async function setWeatherInformation() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=moradabad&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  );
  const r = await response.json();

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
}

async function setInstagramPosts() {
  const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('anchitgupt', 3);

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

async function generateReadMe() {
  const data = await fs.promises.readFile(MUSTACHE_MAIN_DIR, 'utf-8');
  const output = Mustache.render(data, DATA);
  await fs.promises.writeFile('README.md', output);
}

async function action() {
  await setWeatherInformation();
  await setInstagramPosts();
  await setMediumPosts();
  await generateReadMe();
  await puppeteerService.close();
  console.log(DATA);
}

action();
