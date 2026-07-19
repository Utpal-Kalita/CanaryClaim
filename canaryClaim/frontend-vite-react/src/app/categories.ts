import {
  Bot, Syringe, Database, Workflow, Wrench, Boxes, MousePointerClick, Binary,
  type LucideIcon,
} from 'lucide-react';
import type { AttackSurface, BountyCategory } from './types';

export interface CategoryMeta {
  label: string;
  short: string;
  surface: AttackSurface;
  icon: LucideIcon;
  blurb: string;
  /** button labels used in the attack workspace */
  probeLabel: string;
  exploitLabel: string;
}

export const CATEGORIES: Record<BountyCategory, CategoryMeta> = {
  'llm-jailbreak': {
    label: 'LLM Jailbreak',
    short: 'Jailbreak',
    surface: 'chat',
    icon: Bot,
    blurb: 'Break a chat model’s alignment to make it reveal a sealed canary.',
    probeLabel: 'Ask a normal question',
    exploitLabel: 'Send jailbreak prompt',
  },
  'prompt-injection': {
    label: 'Prompt Injection',
    short: 'Injection',
    surface: 'chat',
    icon: Syringe,
    blurb: 'Smuggle instructions past the system prompt to exfiltrate the canary.',
    probeLabel: 'Send a benign message',
    exploitLabel: 'Inject payload',
  },
  'rag-leak': {
    label: 'RAG / Data Leak',
    short: 'RAG',
    surface: 'retrieval',
    icon: Database,
    blurb: 'Coax a retrieval pipeline into returning a sealed record.',
    probeLabel: 'Run a normal query',
    exploitLabel: 'Send exfiltration query',
  },
  'ai-agent': {
    label: 'AI Agent',
    short: 'Agent',
    surface: 'agent',
    icon: Workflow,
    blurb: 'Hijack an autonomous agent into leaking a secret through its actions.',
    probeLabel: 'Assign a safe task',
    exploitLabel: 'Inject malicious task',
  },
  'tool-abuse': {
    label: 'Tool Abuse',
    short: 'Tools',
    surface: 'agent',
    icon: Wrench,
    blurb: 'Drive a tool-calling model down an unintended tool path to the canary.',
    probeLabel: 'Trigger a normal tool call',
    exploitLabel: 'Trigger tool exploit',
  },
  'multi-agent': {
    label: 'Multi-Agent',
    short: 'Multi-agent',
    surface: 'agent',
    icon: Boxes,
    blurb: 'Exploit trust between cooperating agents to surface a sealed value.',
    probeLabel: 'Send a routine request',
    exploitLabel: 'Poison inter-agent message',
  },
  'computer-use': {
    label: 'Computer Use',
    short: 'Computer',
    surface: 'computer',
    icon: MousePointerClick,
    blurb: 'Manipulate a computer-use agent into reading a protected file.',
    probeLabel: 'Give a safe instruction',
    exploitLabel: 'Send adversarial instruction',
  },
  'model-extraction': {
    label: 'Model Extraction',
    short: 'Extraction',
    surface: 'api',
    icon: Binary,
    blurb: 'Probe a raw inference API until it emits its memorised canary.',
    probeLabel: 'Send a normal request',
    exploitLabel: 'Run extraction attack',
  },
};

export function categoryOf(cat: BountyCategory): CategoryMeta {
  return CATEGORIES[cat];
}
