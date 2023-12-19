import React from 'react';
import { Navigate } from 'react-router-dom';
import './Setup.css';
import MostPapularSetups from '../assets/MostPapularSetups.js';

type MPS = {
  name: string;
  ImageID: string;
  youtubeID: string;
};

const Setup: React.FC = () => {
  const [setups, setSetups] = React.useState<Array<MPS>>(MostPapularSetups);

  React.useEffect(() => {
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    setSetups(shuffleArray(setups).slice(0, 6));

    return () => {};
  }, []);
  return (
    <div className="setup">
      <h3 className="titleMostpapular">Most Papular Wallpapers</h3>
      <ul className="cards">
        {setups.map((i) => (
          <li className="cards_item">
            <div
              onClick={() => {
                window.location.href = `/setup/${btoa(JSON.stringify(i))}`;
              }}
            >
              <div className="card_image">
                <span>{i.name}</span>
                <img key={i.youtubeID} loading={'lazy'} src={i.ImageID} height={150} width={250} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Setup;
