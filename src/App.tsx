import cn from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { BrowserRouter, useLocation } from 'react-router-dom';
import './App.css';
import app from '../app.json';
import { version } from '../package.json';
import Audio from './app/Audio';
import { matomoSetPage } from './app/common/matomo';

const App: React.FC = () => {
  const [getId, setGetId] = React.useState<string>('jyuFl2bZBb4');
  const location = useLocation();
  const [init, setInit] = React.useState<boolean>(false);

  React.useEffect(() => {
    init && matomoSetPage(location.pathname);
    if (location.pathname === '/') {
      document.body.classList.add('home');
    } else {
      document.body.classList.remove('home');
    }
    setInit(true);
  }, [location]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{app.title}</title>
        <meta name="app-version" content={version} />
      </Helmet>
      <div class="main">
        <label class="menu-button-wrapper" for="">
          <input type="checkbox" class="menu-button" />
          <div class="icon-wrapper">
            <label class="hamburger">
              <input class="hamburger-input" type="checkbox" />
              <span class="hamburger-line first"></span>
              <span class="hamburger-line second"></span>
              <span class="hamburger-line third"></span>
            </label>
          </div>
          <div class="item-list">
            <dd class="inputbox-content">
              <input
                id="input0"
                type="text"
                placeholder={'YouTube id'}
                onChange={(e) => setGetId(e.currentTarget.value)}
              />
              <label for="input0">YouTube ID</label>
              <span class="underline"></span>
            </dd>
          </div>
        </label>
      </div>
      <Audio className="app__content" YTID={getId} />
    </React.Fragment>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app')
);
