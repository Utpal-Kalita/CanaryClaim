import { createFileRoute } from '@tanstack/react-router';
import { SubmitPage } from '@/app/pages/submit';

export const Route = createFileRoute('/submit')({
  component: SubmitPage,
});
