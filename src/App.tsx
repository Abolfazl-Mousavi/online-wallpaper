import cn from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { BrowserRouter, useLocation, useParams } from 'react-router-dom';
import Icon from '@global/Icon';
import './App.css';
import app from '../app.json';
import { version } from '../package.json';
import Audio from './app/Audio';
import Setup from './app/Setup';
import { matomoSetPage } from './app/common/matomo';
import MostPapularSetups from './assets/MostPapularSetups';
import { youtubeParser } from '@common/helpers';

const App: React.FC = () => {
  const [getId, setGetId] = React.useState<string>(
    localStorage.getItem('CURRENT_YTID')
  );
  const [getBGImage, setGetBGImage] = React.useState<string>(
    localStorage.getItem('CURRENT_BGIMAGE')
  );
  const location = useLocation();
  const [init, setInit] = React.useState<boolean>(false);

  const [isOpenShare, setIsOpenShare] = React.useState(false);
  React.useEffect(() => {
    init && matomoSetPage(location.pathname);
    if (location.pathname.includes('setup')) {
      try {
        let decryptedSetup = atob(location.pathname.replace('/setup/', ''));
        let validatedSetup = JSON.parse(decryptedSetup);
        setGetBGImage(validatedSetup.ImageID);
        setGetId(validatedSetup.youtubeID);
      } catch (err) {
        console.log(err);
      }
    } else if (location.pathname.includes('play')) {
      setGetId(location.pathname.replace('/play/', ''));
    }

    setInit(true);
  }, [location]);

  React.useEffect(() => {
    document.body.style.backgroundImage = `url(${getBGImage})`;
    localStorage.setItem('CURRENT_BGIMAGE', `${getBGImage}`);
  }, [getBGImage]);
  React.useEffect(() => {
    localStorage.setItem('CURRENT_YTID', `${getId}`);
  }, [getId]);
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
                id="input"
                type="text"
                placeholder={'YouTube id'}
                onChange={(e) => setGetId(e.currentTarget.value)}
              />
              <label for="input0">YouTube ID</label>
              <span class="underline"></span>
            </dd>
            <dd class="inputbox-content">
              <input
                id="input"
                type="text"
                placeholder={'Background URL'}
                onChange={(e) => setGetBGImage(youtubeParser(e.currentTarget.value))}
              />
              <label for="input0">Background Image</label>
              <span class="underline"></span>
            </dd>
            <dd class="inputbox-content">
              <button
                id="export"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://${app.website}/setup/${btoa(
                      JSON.stringify({
                        ImageID: getBGImage,
                        youtubeID: getId,
                      })
                    )}`
                  )
                }
              >
                export
              </button>
            </dd>
          </div>
        </label>
        {isOpenShare && <Setup />}
      </div>
      <div
        onClick={() => {
          setIsOpenShare(!isOpenShare);
        }}
        className={'share'}
      >
        <Icon
          className="player__play-icon "
          icon={isOpenShare ? 'X' : 'share'}
        />
      </div>
      <Audio key={getId} className="app__content" YTID={getId} />
    </React.Fragment>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app')
);
