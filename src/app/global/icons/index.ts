import React from 'react';
import ThreeZeroMinus from './30minus.svg';
import ThreeZeroPlus from './30plus.svg';
import Arrow from './arrow.svg';
import Loading from './loading.svg';
import Pause from './pause.svg';
import Play from './play.svg';
import Reload from './reload.svg';
import ReplayAll from './replay-all.svg';
import ReplayNone from './replay-none.svg';
import ReplayOne from './replay-one.svg';
import Stop from './stop.svg';
import Warning from './warning.svg';
import Youtube from './youtube.svg';
import headphones from './headphones.svg';
import share from './share.svg';
import X from './X.svg';


export type IconNamesT =
  | 'threeZeroMinus'
  | 'threeZeroPlus'
  | 'arrow'
  | 'loading'
  | 'pause'
  | 'share'
  | 'play'
  | 'reload'
  | 'replayAll'
  | 'replayNone'
  | 'replayOne'
  | 'stop'
  | 'warning'
  | 'youtube'
  | 'headphones'
  | 'X'
  ;

export default {
  threeZeroMinus: ThreeZeroMinus,
  threeZeroPlus: ThreeZeroPlus,
  arrow: Arrow,
  loading: Loading,
  pause: Pause,
  share: share,
  play: Play,
  reload: Reload,
  replayAll: ReplayAll,
  replayNone: ReplayNone,
  replayOne: ReplayOne,
  stop: Stop,
  warning: Warning,
  youtube: Youtube,
  headphones: headphones,
  X: X,
} as Record<IconNamesT, React.FC>;
