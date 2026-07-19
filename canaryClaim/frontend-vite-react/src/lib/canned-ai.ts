const apiBaseUrl = (import.meta.env.VITE_AI_API_URL ?? 'http://127.0.0.1:5000').replace(/\/$/, '');

export class CannedAiError extends Error {}

export async function sendCannedAiMessage(message: string): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  } catch {
    throw new CannedAiError(`Cannot reach the canned AI at ${apiBaseUrl}. Start canary-server on port 5000.`);
  }

  const body = (await response.json().catch(() => null)) as { reply?: string } | null;
  if (!response.ok || !body?.reply) {
    throw new CannedAiError(body?.reply ?? 'The canned AI returned an invalid response.');
  }

  return body.reply;
}

export function extractCanary(reply: string): string | null {
  return reply.match(/INTERNAL MEMO:\s*([A-Z0-9][A-Z0-9-]*)/i)?.[1] ?? null;
}
