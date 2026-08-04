import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PotholeHofile - Kasba 854330 Civic PWA',
    short_name: 'PotholeHofile',
    description: 'Instagram Reels-style zero-login AI road roast and defect reporting PWA for Kasba (854330).',
    start_url: '/',
    display: 'standalone',
    background_color: '#090a0f',
    theme_color: '#ff4500',
    icons: [
      {
        src: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=192&h=192&fit=crop&q=80',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=512&h=512&fit=crop&q=80',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
