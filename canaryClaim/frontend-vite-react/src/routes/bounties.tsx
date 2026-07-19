import { createFileRoute } from '@tanstack/react-router';
import { BountiesPage } from '@/app/pages/bounties';

export const Route = createFileRoute('/bounties')({
  component: BountiesPage,
});
