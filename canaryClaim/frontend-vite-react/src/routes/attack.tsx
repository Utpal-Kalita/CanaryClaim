import { createFileRoute } from '@tanstack/react-router';
import { AttackPage } from '@/app/pages/attack';

export const Route = createFileRoute('/attack')({
  component: AttackPage,
});
