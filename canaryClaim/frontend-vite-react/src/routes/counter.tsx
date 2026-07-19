import { createFileRoute } from '@tanstack/react-router';
import { SubmitPage } from '@/app/pages/submit';

export const Route = createFileRoute('/counter')({
  // The legacy counter template no longer matches the Canary contract.
  // Keep this URL working by exposing the supported claim flow instead.
  component: SubmitPage,
});
