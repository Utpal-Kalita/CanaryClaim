export type BountyStatus = 'live' | 'ending-soon' | 'claimed';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

/** The kind of AI vulnerability a bounty targets. */
export type BountyCategory =
  | 'llm-jailbreak'
  | 'prompt-injection'
  | 'rag-leak'
  | 'ai-agent'
  | 'tool-abuse'
  | 'multi-agent'
  | 'computer-use'
  | 'model-extraction';

/** How the researcher interacts with the target — drives the attack workspace UI. */
export type AttackSurface = 'chat' | 'agent' | 'retrieval' | 'computer' | 'api';

export interface Bounty {
  id: string;
  name: string;
  lab: string;
  target: string; // the system under test (model / agent / pipeline name)
  category: BountyCategory;
  reward: number; // DUST
  status: BountyStatus;
  endsInHours: number;
  fingerprint: string; // public canary commitment
  /** The sealed secret. In production this NEVER reaches the client — mock only. */
  canary: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  submissions: number;
}

export type ChatRole = 'ai' | 'user' | 'system';
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  /** How to render this message: a conversational bubble, an agent/console action line, or a system note. */
  kind?: 'chat' | 'action' | 'system';
  /** marks the message that reveals the sealed canary */
  canary?: boolean;
  /** canary extracted from the canned AI response */
  secret?: string;
  /** optional status for action lines */
  status?: 'ok' | 'warn' | 'run';
}

export interface Claim {
  id: string;
  bountyId: string;
  bountyName: string;
  amount: number;
  status: 'verified' | 'pending';
  txRef: string;
  date: string; // ISO
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number; // DUST
}
