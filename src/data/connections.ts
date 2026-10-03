export interface LiveProduct {
  id: string;
  name: string;
  blurb: string;
  url?: string;
  repo: string;
  kind: 'app' | 'game' | 'site' | 'tool';
}

/** Canonical YouNeeK products. Repo list is filled live from GitHub. */
export const liveProducts: LiveProduct[] = [
  {
    id: 'radar',
    name: 'YouNeeK Pro Radar',
    blurb: 'NEXRAD mosaics, NWS alerts, NOAA radio, shelter ping.',
    url: 'https://youneekproradar.com',
    repo: 'youneek-pro-radar',
    kind: 'app',
  },
  {
    id: 'time',
    name: 'YouNeeK Time',
    blurb: 'Hundred-seconds clock. 100s / 100min / 100hr.',
    url: 'https://youneektime.com',
    repo: 'youneek-time',
    kind: 'app',
  },
  {
    id: 'care',
    name: 'YouNeeK Care',
    blurb: 'YouNeeK Care site.',
    url: 'https://youneekcare.com',
    repo: 'youneek',
    kind: 'app',
  },
  {
    id: 'xyz',
    name: 'YouNeeK.xyz',
    blurb: 'Home base.',
    url: 'https://youneek.xyz',
    repo: 'youneek.xyz',
    kind: 'site',
  },
  {
    id: 'sats',
    name: 'Satellite Tracker',
    blurb: 'YouNeeK satellite tracker.',
    repo: 'youneek-satellite-tracker',
    kind: 'app',
  },
  {
    id: 'remnant',
    name: 'REMNANT',
    blurb: 'Play as the ancient AI that crashed at Roswell.',
    repo: 'remnant',
    kind: 'game',
  },
  {
    id: 'atlas',
    name: '3I/ATLAS',
    blurb: 'Silent Passage. The comet game.',
    repo: '3i-atlas-the-gameYNK',
    kind: 'game',
  },
  {
    id: 'atc',
    name: 'Air Traffic',
    blurb: 'Air traffic controller game.',
    repo: 'YNKAIRTRAFFICGAME',
    kind: 'game',
  },
  {
    id: 'architects',
    name: 'The Architects',
    blurb: 'Private Godot project. Needs a GitHub token to show.',
    repo: 'the-architects',
    kind: 'game',
  },
  {
    id: 'agent-world',
    name: 'Agent World',
    blurb: 'Private. Needs a GitHub token to show.',
    repo: 'agent-world',
    kind: 'tool',
  },
  {
    id: 'cloudripper',
    name: 'Cloudripper',
    blurb: 'Multi-cloud orchestration.',
    repo: 'Cloudripper',
    kind: 'tool',
  },
  {
    id: 'forge',
    name: 'Real Neural Forge',
    blurb: 'Neural forge experiments.',
    repo: 'Real-Neural-Forge',
    kind: 'tool',
  },
];

export const TOKEN_KEY = 'youneek.githubToken';
