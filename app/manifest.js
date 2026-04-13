export default function manifest() {
  return {
    name: 'PlayOnMeet — Video Call Games',
    short_name: 'PlayOnMeet',
    description: 'Play gesture-controlled multiplayer games directly on Google Meet & Zoom.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0b',
    theme_color: '#00f2ff',
    icons: [
      {
        src: '/feedback-icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
