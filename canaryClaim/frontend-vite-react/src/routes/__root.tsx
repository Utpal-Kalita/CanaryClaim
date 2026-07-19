import { createRootRoute, Outlet } from '@tanstack/react-router';
import * as pino from "pino";
import { ThemeProvider } from "@/components/theme-provider";
import { MidnightMeshProvider } from "@/modules/midnight/wallet-widget/contexts/wallet";
import { MainLayout } from "@/layouts/layout";
import { AppProvider } from "@/app/store";

export const logger = pino.pino({
  level: "trace",
});

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="canaryclaim-theme-dark">
      <MidnightMeshProvider logger={logger}>
        <AppProvider>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </AppProvider>
      </MidnightMeshProvider>
    </ThemeProvider>
  );
}
