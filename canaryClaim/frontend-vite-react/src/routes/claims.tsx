import { createFileRoute } from '@tanstack/react-router';
import { ClaimsPage } from '@/app/pages/claims';

export const Route = createFileRoute('/claims')({
  component: ClaimsPage,
});
