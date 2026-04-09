import AirCanvas from '@/components/AirCanvas';

export const metadata = {
  title: 'Air Draw SOS',
  description: 'Control the game using hand gestures in the air.',
}

export default function Home() {
  return (
    <main>
      <AirCanvas />
    </main>
  );
}
