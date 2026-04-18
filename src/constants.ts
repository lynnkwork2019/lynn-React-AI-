import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Digital Pulse',
    artist: 'Neural Engine',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: '2',
    title: 'Neon Streets',
    artist: 'Circuit Dreams',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: '3',
    title: 'Synth Horizon',
    artist: 'Bitrate Cowboy',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&h=300&q=80',
  },
];


export const GRID_SIZE = 20;
export const INITIAL_SPEED = 80;
export const MIN_SPEED = 40;
export const SPEED_INCREMENT = 3;
