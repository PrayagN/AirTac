import AirCanvas from '@/components/AirCanvas';

export const metadata = {
  title: 'Obsidian Gaming',
  description: 'Control the game using hand gestures in the air.',
}

export default function Home() {
  return (
    <main>
      <AirCanvas />
    </main>
  );
}
