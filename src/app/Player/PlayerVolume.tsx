import React from 'react';
import './wraperVolume.css';
import Icon from '../global/Icon';
import { HTMLAudioState, HTMLAudioControls } from '../hooks/useAudio';

interface Props {
  audioState: HTMLAudioState;
  audioControls: HTMLAudioControls;
  volume: string;
  setVolume: any;
}
const PlayerControls = ({
  audioState,
  audioControls,
  volume,
  setVolume,
}: Props) => {
  const [isVolumeOpen, setisVolumeOpen] = React.useState(false);

  function volumeSetter(e: any) {
    audioControls.setVolume(volume);
    setVolume(e.currentTarget.value);
    localStorage.setItem('VOLUME', e.currentTarget.value);
  }
  return (
    <React.Fragment>
      {isVolumeOpen && (
        <div class="wrapper">
          <input
            value={volume}
            type="range"
            min="0"
            max="100"
            onChange={(e) => {
              volumeSetter(e);
            }}
          />
        </div>
      )}
      <button
        disabled={audioState.waiting}
        onClick={() => setisVolumeOpen(!isVolumeOpen)}
        className="player__stepforward"
      >
        <Icon icon="headphones" />
      </button>
    </React.Fragment>
  );
};

export default PlayerControls;
