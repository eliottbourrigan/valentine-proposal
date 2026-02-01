import React from 'react';
import { ValentineCard } from './components/ValentineCard';

const App: React.FC = () => {
  return (
    <main className="min-h-screen w-full bg-[#eaf3ff] flex flex-col items-center justify-center p-4">
      <ValentineCard />
      <footer className="mt-6 text-[10px] font-mono text-gray-400/70 select-none">
        Made with 💖 by Eliott Bourrigan
      </footer>
    </main>
  );
};

export default App;