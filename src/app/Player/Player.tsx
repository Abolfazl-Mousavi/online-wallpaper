import React from 'react';
import { Audio } from '@common/types';
import './Player.css';
import useAudio from '../hooks/useAudio';
import useMediaSession from '../hooks/useMediaSession';
import { videosDB, settingsDB } from '../store';
import BufferInfo from './BufferInfo';
import PlayerControls from './PlayerControls';
import PlayerReplay from './PlayerReplay';
import PlayerVolume from './PlayerVolume';


interface Props {
  source: Audio;
  className?: string;
}

const Player = ({ source, className = '' }: Props) => {
  const [startTime, setStartTime] = React.useState<number>(0);
  const [useProxy, setUseProxy] = React.useState<boolean>(false);
  const [showBufferInfo, setShowBufferInfo] = React.useState<boolean>(null);
  const [bufferTime, setBufferTime] = React.useState<number>(0);
  const [timer, setTimer] = React.useState<any>(null);

  const setError = (e) => console.log(e);

  const audio = useAudio({
    src: useProxy
      ? `https://yt-source.nico.dev/play/${encodeURIComponent(source.url)}`
      : source.url,
    setError: (error) => {
      if (useProxy) {
        setError(error);
      } else {
        setUseProxy(true);
      }
    },
    formats: Object.keys(source.formats).map((mimeType) => {
      return {
        mimeType,
        src: useProxy
          ? `https://yt-source.nico.dev/play/${encodeURIComponent(
              source.formats[mimeType]
            )}`
          : source.formats[mimeType],
      };
    }),
  });

  React.useEffect(() => {
    if (audio.state.waiting) {
      const bufferTimer = setInterval(() => {
        setBufferTime((prevBufferTime) => prevBufferTime + 200);
      }, 200);
      setTimer(bufferTimer);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [audio.state.waiting]);

  React.useEffect(() => {
    if (bufferTime >= 5000 && showBufferInfo === null) {
      setShowBufferInfo(true);
    }
  }, [bufferTime]);

  useMediaSession({
    element: audio.element,
    mediaMetadata: {
      title: source.title,
      artist: source.author,
      album: 'YouTube Audio Player',
      artwork: source.images.map((e) => ({
        src: e.url,
        sizes: `${e.height}x${e.width}`,
      })),
    },
    controls: {
      play: audio.controls.play,
      pause: audio.controls.pause,
    },
  });

  React.useEffect(() => {
    videosDB.get(source.id).then((v) => setStartTime(v.time));
    settingsDB
      .get('playbackRate')
      .then((rate) => audio.controls.setPlaybackRate(rate ? Number(rate) : 1));
  }, [source.id]);

  React.useEffect(() => {
    if (startTime !== 0 && audio.state.duration !== 0) {
      audio.controls.seek(startTime >= 5 ? startTime - 5 : startTime);
    }
  }, [startTime, audio.state.duration]);

  React.useEffect(
    () => () => {
      videosDB.updateObject(source.id, {
        time: audio.state.time,
      });
    },
    [audio.state.time]
  );

  return (
    <div className={`player ${className}`}>
      {audio.elementNode}
      <div className="player__controls">
        <PlayerControls
          audioState={audio.state}
          audioControls={audio.controls}
        />
        <PlayerReplay
          audioState={audio.state}
          audioControls={audio.controls}
          className="player__replay"
        />
        <PlayerVolume
          audioState={audio.state}
          audioControls={audio.controls}
      
        />
      </div>
      {showBufferInfo && (
        <BufferInfo onClose={() => setShowBufferInfo(false)} />
      )}
    </div>
  );
};

export default Player;
