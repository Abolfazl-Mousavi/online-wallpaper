import React from 'react';
import './wraperVolume.css';
import Icon from '../global/Icon';
import { HTMLAudioState, HTMLAudioControls } from '../hooks/useAudio';

interface Props {
  audioState: HTMLAudioState;
  audioControls: HTMLAudioControls;
}
const PlayerControls = ({ audioState, audioControls }: Props) => {
  const [isVolumeOpen, setisVolumeOpen] = React.useState(false);
  const [volume, setVolume] = React.useState(50);
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
              audioControls.setVolume(parseFloat(e.currentTarget.value) / 100);
              setVolume(parseFloat(e.currentTarget.value) );
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
