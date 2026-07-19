import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Bare shell. The landing page owns its own navbar/footer chrome so the
 * marketing experience is edge-to-edge. Internal routes (counter, wallet-ui)
 * render inside their own containers.
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
};
