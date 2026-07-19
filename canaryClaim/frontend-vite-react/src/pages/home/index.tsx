import { Navbar } from '@/components/site/navbar';
import { Hero } from '@/components/sections/hero';

/**
 * Product entry. The hero acts as the branded gate — its buttons drop straight
 * into the app (Bounties / Submit). All product surfaces live under the app
 * routes (/bounties, /attack, /submit, /claims).
 */
export function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0208]">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
