import React, { useEffect, useState } from 'react';
import { settingsDB } from '../store';
import Icon from './../global/Icon';
import { HTMLAudioControls, HTMLAudioState } from './types';

interface Props {
  audioState: HTMLAudioState;
  audioControls: HTMLAudioControls;
  className?: string;
}

const PlayerReplay = ({ audioState, audioControls, className = '' }: Props) => {
  const states = ['none', 'one', 'all'];
  const [replayState, setReplayState] = useState(0);
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (audioState.duration !== 0 && !init) {
      settingsDB.get('replay').then(v => {
        setReplayState(v ? Number(v) : 0);
      });
      setInit(true);
    }
  }, [audioState.duration]);

  useEffect(() => {
    if (init) {
      settingsDB.set('replay', replayState);
    }
    if (replayState !== 0) {
      audioControls.setEndedCallback(() => {
        audioControls.seek(0);
        audioControls.play();
        if (replayState === 1) {
          setReplayState(0);
        }
      });
    }
  }, [replayState]);

  return (
    <button
      onClick={() =>
        setReplayState(replayState >= states.length - 1 ? 0 : replayState + 1)
      }
      className={className}
    >
      <Icon
        icon={
          replayState === 0
            ? 'replayNone'
            : replayState === 1
            ? 'replayOne'
            : replayState === 2
            ? 'replayAll'
            : null
        }
      />
    </button>
  );
};

export default PlayerReplay;
