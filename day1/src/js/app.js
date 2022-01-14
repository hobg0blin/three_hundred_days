import Config from './data/config';
import Detector from './utils/detector';
import * as APP from './app/main';

// Styles
import './../css/app.scss';

// Check environment and set the Config helper
if(__ENV__ === 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----');

  Config.isDev = true;
}

function init() {
  // Check for webGL capabilities
  if(!Detector.webgl) {
    Detector.addGetWebGLMessage();
  } else {
    const container = document.getElementById('appContainer');
    APP.cube(container);
    APP.render(10)
  }
}

init();
