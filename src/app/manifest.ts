import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bank App',
    short_name: 'Bank App',
    description: 'Bank App',
    start_url: '/',
    display: 'standalone',
    background_color: 'rgb(30 41 59)',
    theme_color: 'rgb(30 41 59)'
  };
}
