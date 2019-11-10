const vision = require('Vision-Reloaded');
const botConfig = require('./config');
vision.init({
  config: botConfig,
  appDir: __dirname
});