// src/data/banners.ts

export interface BannerRule {
  condition: (video: any, index: number) => boolean;
  banner: {
    image: any; // local import or URI
    link: string;
  };
}

// Example: define multiple rules
import plutoTv from '../assets/images/PlutoTv.png';
import lenovo from '../assets/images/lenovo.png';
import comicon from '../assets/images/comicon.png';

export const bannerRules: BannerRule[] = [
  {
    condition: (video, index) => index % 3 === 0,
    banner: {
      image: plutoTv,
      link: 'https://pluto.tv',
    },
  },
  {
    condition: (video, index) => video.category === 'Gaming',
    banner: {
      image: lenovo,
      link: 'https://www.lenovo.com/dk/da/',
    },
  },
  {
    condition: (video, index) => video.title.includes('Comicon'),
    banner: {
      image: comicon,
      link: 'https://comicon.com',
    },
  },
];
