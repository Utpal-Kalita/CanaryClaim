import { createRootRoute, Outlet } from '@tanstack/react-router';
import * as pino from "pino";
import { ThemeProvider } from "@/components/theme-provider";
import { MidnightMeshProvider } from "@/modules/midnight/wallet-widget/contexts/wallet";
import { CounterAppProvider } from "@/modules/midnight/counter-sdk/contexts";
import { MainLayout } from "@/layouts/layout";
import { AppProvider } from "@/app/store";

export const logger = pino.pino({
  level: "trace",
});

// Update this with your deployed contract address
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS!;

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="canaryclaim-theme-dark">
      <MidnightMeshProvider logger={logger}>
        <CounterAppProvider logger={logger} contractAddress={contractAddress}>
          <AppProvider>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </AppProvider>
        </CounterAppProvider>
      </MidnightMeshProvider>
    </ThemeProvider>
  );
}
