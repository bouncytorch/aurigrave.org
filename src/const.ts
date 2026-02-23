import { faApple, faBandcamp, faGithub, faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AlbumType } from './components/layout/audio/AlbumList';

export const LINKTREE_LINKS = [
  { name: 'mail', link: 'mailto:contact@aurigrave.org', icon: faEnvelope },
  { name: 'camp', link: 'https://bouncytorch.bandcamp.com', icon: faBandcamp },
  { name: 'cloud', link: 'https://soundcloud.com/bouncytorch', icon: faSoundcloud },
  { name: 'youtube', link: 'https://youtube.com/@bouncytorch', icon: faYoutube },
  { name: 'spotify', link: 'https://open.spotify.com/artist/41ryjxYFqikzeC3wzKfSkS', icon: faSpotify },
  { name: 'apple', link: 'https://music.apple.com/us/artist/bouncytorch/1614632135', icon: faApple },
  { name: 'github', link: 'https://github.com/bouncytorch', icon: faGithub },
]

// TODO: REPLACE THESE SHITTY DESCRIPTIONS
export const GAME_MUSIC: AlbumType[] = [
  {
    id: 'pixkartz',
    shortname: 'Pixkartz',
    fullname: 'Pixkartz',
    description: 'This soundtrack is work-in-progress! Currently am the sole composer of the soundtrack for this top-down pixel racing game. The soundtrack is making use of simple instruments, samplers and chip emulators to portray the vibe of a retro game without the burden of limitation. The intention is not to make something accurate to a specific game or audio chip but to create a fusion between modern and old, which would represent the game quite accurately. Directly inspired by the music of Mario Kart, old and new.',
    cover: 'https://files.aurigrave.org/bouncytorch/Projects/previews/pixkartz/cover.webp',
    genre: 'EDM, Funk, Chipfusion',
    samples: [
      'https://files.aurigrave.org/bouncytorch/Projects/previews/pixkartz/2_drivers_test.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/pixkartz/3_segway.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/pixkartz/4_skid_tire.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/pixkartz/5_dead_motor.mp3'
    ],
    links: {
      soundcloud: 'https://soundcloud.com/bouncytorch/sets/pixkartz-original-soundtrack'
    }
  },
  {
    id: 'spring-escape-ddd',
    shortname: 'Spring Escape DEMO',
    fullname: 'Spring Escape: Deep Down Demo',
    description: 'Was the sole composer of the soundtrack for this puzzle platformer\'s DEMO. Directly inspired by Minecraft and Portal soundtracks, crafted the DEMO\'s OST as a sort of fusion between both. The OST features a combination of edm, electronica and orchestral sounds.',
    cover: 'https://files.aurigrave.org/bouncytorch/Projects/previews/spring-escape-ddd/cover.webp',
    genre: 'Electronica, EDM, Industrial',
    samples: [
      'https://files.aurigrave.org/bouncytorch/Projects/previews/spring-escape-ddd/1_patch.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/spring-escape-ddd/2_escaping_the_spring.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/spring-escape-ddd/3_evaluation.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/spring-escape-ddd/5_ground_breaking_research.mp3',
    ],
    links: {
      bandcamp: 'https://bouncytorch.bandcamp.com/album/spring-escape-deep-down-demo-original-game-soundtrack',
      spotify: 'https://open.spotify.com/album/1JhrWFNUxCpG7fgasU5zCm',
      soundcloud: 'https://soundcloud.com/bouncytorch/sets/spring-escape-deep-down-demo-sountrack',
      apple: 'https://music.apple.com/us/album/spring-escape-deep-down-demo-original-game-soundtrack/1832806229',
      youtube: 'https://music.youtube.com/playlist?list=OLAK5uy_moEY5PdJi7ZGfgCoExZ5qrvqoW3gZXTpI'
    }
  },
  {
    id: 'tails',
    shortname: 'Tails Of A Cat',
    fullname: 'Tails Of A Cat',
    description: 'Was the sole composer of the soundtrack for this puzzle platformer. Directly inspired by Minecraft and Ori soundtracks, the intention was to go beyond the simplicity of the former while trying to keep the same instrument set.',
    cover: 'https://files.aurigrave.org/bouncytorch/Projects/previews/tails/cover.webp',
    genre: 'Orchestral, Piano, Ambient',
    samples: [
      'https://files.aurigrave.org/bouncytorch/Projects/previews/tails/1_tails_of_a_cat.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/tails/3_home_in_the_hills.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/tails/5_snow_wonder.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/tails/6_flanking_the_fire.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/tails/8_end_of_a_tail.mp3',
    ],
    links: {
      bandcamp: 'https://bouncytorch.bandcamp.com/album/tails-of-a-cat-original-game-soundtrack',
      spotify: 'https://open.spotify.com/album/5Nu3Ds0pLiCAEUJdZxtomr',
      soundcloud: 'https://soundcloud.com/bouncytorch/sets/tails-of-a-cat-original-game-soundtrack',
      apple: 'https://music.apple.com/us/album/tails-of-a-cat-original-game-soundtrack/1678346417',
      youtube: 'https://music.youtube.com/playlist?list=OLAK5uy_m-9-M9pT1IPIrQbrvSP8LQF6MbP_wdAlc'
    }
  },
  {
    id: 'downsouth',
    shortname: 'Downsouth',
    fullname: 'Downsouth',
    description: 'Composed parts of the soundtrack. Was responsible for capturing a dystopian vibe of the Lovebox Slums. Crafted warm ambient tracks with orchestral and choir elements.',
    cover: 'https://files.aurigrave.org/bouncytorch/Projects/previews/downsouth/cover.webp',
    genre: 'Dark Ambient, EDM, Industrial',
    samples: [
      'https://files.aurigrave.org/bouncytorch/Projects/previews/downsouth/intro.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/downsouth/unnamed1.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/downsouth/unnamed2.mp3',
      'https://files.aurigrave.org/bouncytorch/Projects/previews/downsouth/elevator.mp3',
    ],
    links: {
      soundcloud: 'https://soundcloud.com/bouncytorch/sets/downsouth-dump',
    }
  }
]
