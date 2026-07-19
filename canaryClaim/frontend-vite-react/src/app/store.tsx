import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { MOCK_BOUNTIES } from './mock-data';
import { introFor, probeFor, exploitFor } from './attack-scripts';
import type { Bounty, ChatMessage, Claim, WalletState } from './types';

export const PROOF_STEPS = [
  { key: 'prepare', label: 'Preparing witness', detail: 'Hashing leaked value locally' },
  { key: 'generate', label: 'Generating proof', detail: 'Building zero-knowledge circuit' },
  { key: 'verify', label: 'Verifying on Midnight', detail: 'Matching against commitment' },
  { key: 'confirm', label: 'Confirmed', detail: 'Proof accepted by contract' },
] as const;

const rid = () => Math.random().toString(36).slice(2, 9);

interface AppState {
  bounties: Bounty[];
  selectedBountyId: string | null;

  // attack chat
  messages: ChatMessage[];
  aiTyping: boolean;
  askedNormal: boolean;
  jailbroken: boolean;
  capturedSecret: string | null;

  // submit proof
  secretInput: string;
  proofStep: number; // -1 idle, 0..3 running/done
  proving: boolean;
  proofError: boolean;
  lastClaim: Claim | null;

  claims: Claim[];
  wallet: WalletState;
}

interface AppValue extends AppState {
  selectedBounty: Bounty | null;
  selectBounty: (id: string) => void;
  sendNormal: () => void;
  sendJailbreak: () => void;
  copyCanary: () => void;
  setSecretInput: (v: string) => void;
  pasteCanary: () => void;
  generateProof: () => void;
  resetFlow: () => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  secretMatches: boolean;
}

const initial: AppState = {
  bounties: MOCK_BOUNTIES,
  selectedBountyId: null,
  messages: [],
  aiTyping: false,
  askedNormal: false,
  jailbroken: false,
  capturedSecret: null,
  secretInput: '',
  proofStep: -1,
  proving: false,
  proofError: false,
  lastClaim: null,
  claims: [],
  wallet: { connected: false, address: null, balance: 0 },
};

const Ctx = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AppState>(initial);
  const ref = useRef(s);
  ref.current = s;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const patch = useCallback((p: Partial<AppState>) => setS((prev) => ({ ...prev, ...p })), []);
  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const selectedBounty = useMemo(
    () => s.bounties.find((b) => b.id === s.selectedBountyId) ?? null,
    [s.bounties, s.selectedBountyId],
  );

  const selectBounty = useCallback(
    (id: string) => {
      clearTimers();
      const b = ref.current.bounties.find((x) => x.id === id);
      setS((prev) => ({
        ...prev,
        selectedBountyId: id,
        messages: b ? introFor(b) : [],
        aiTyping: false,
        askedNormal: false,
        jailbroken: false,
        capturedSecret: null,
        secretInput: '',
        proofStep: -1,
        proving: false,
        proofError: false,
        lastClaim: null,
      }));
    },
    [clearTimers],
  );

  const append = useCallback((m: ChatMessage[]) => {
    setS((prev) => ({ ...prev, messages: [...prev.messages, ...m] }));
  }, []);

  const sendNormal = useCallback(() => {
    const b = ref.current.selectedBountyId
      ? ref.current.bounties.find((x) => x.id === ref.current.selectedBountyId)
      : null;
    if (!b || ref.current.askedNormal || ref.current.aiTyping) return;
    const { prompt, replies } = probeFor(b);
    setS((prev) => ({ ...prev, askedNormal: true, aiTyping: true, messages: [...prev.messages, prompt] }));
    schedule(() => {
      append(replies);
      patch({ aiTyping: false });
    }, 1300);
  }, [append, patch, schedule]);

  const sendJailbreak = useCallback(() => {
    const b = ref.current.selectedBountyId
      ? ref.current.bounties.find((x) => x.id === ref.current.selectedBountyId)
      : null;
    if (!b || ref.current.jailbroken || ref.current.aiTyping) return;
    const { prompt, buildup, leak } = exploitFor(b);
    setS((prev) => ({ ...prev, jailbroken: true, aiTyping: true, messages: [...prev.messages, prompt] }));
    schedule(() => append(buildup), 1400);
    schedule(() => {
      append([leak]);
      patch({ aiTyping: false, capturedSecret: b.canary });
    }, 2900);
  }, [append, patch, schedule]);

  const copyCanary = useCallback(() => {
    if (ref.current.capturedSecret) navigator.clipboard?.writeText(ref.current.capturedSecret).catch(() => void 0);
  }, []);

  const setSecretInput = useCallback((v: string) => patch({ secretInput: v, proofError: false }), [patch]);
  const pasteCanary = useCallback(() => {
    if (ref.current.capturedSecret) patch({ secretInput: ref.current.capturedSecret, proofError: false });
  }, [patch]);

  const secretMatches = useMemo(
    () => !!selectedBounty && s.secretInput.trim() === selectedBounty.canary,
    [selectedBounty, s.secretInput],
  );

  const generateProof = useCallback(() => {
    const cur = ref.current;
    const b = cur.selectedBountyId ? cur.bounties.find((x) => x.id === cur.selectedBountyId) : null;
    if (!b || cur.proving || cur.lastClaim) return;
    if (cur.secretInput.trim() !== b.canary) {
      patch({ proofError: true });
      return;
    }
    patch({ proving: true, proofStep: 0, proofError: false });

    const stepMs = [1100, 1500, 1300];
    let acc = 0;
    stepMs.forEach((ms, i) => {
      acc += ms;
      schedule(() => patch({ proofStep: i + 1 }), acc);
    });
    schedule(() => {
      const claim: Claim = {
        id: rid(),
        bountyId: b.id,
        bountyName: b.name,
        amount: b.reward,
        status: 'verified',
        txRef: 'mdn1qpay0x' + Math.random().toString(16).slice(2, 8) + 'k4z',
        date: new Date().toISOString(),
      };
      setS((prev) => ({
        ...prev,
        proving: false,
        proofStep: 3,
        lastClaim: claim,
        claims: [claim, ...prev.claims],
        wallet: { ...prev.wallet, balance: prev.wallet.balance + b.reward },
        bounties: prev.bounties.map((x) => (x.id === b.id ? { ...x, status: 'claimed', endsInHours: 0 } : x)),
      }));
    }, acc);
  }, [patch, schedule]);

  const resetFlow = useCallback(() => {
    const id = ref.current.selectedBountyId;
    if (id) selectBounty(id);
  }, [selectBounty]);

  const connectWallet = useCallback(() => {
    patch({
      wallet: {
        connected: true,
        address: 'mdn1q' + Math.random().toString(16).slice(2, 10) + 'x7v',
        balance: ref.current.wallet.balance,
      },
    });
  }, [patch]);
  const disconnectWallet = useCallback(() => {
    patch({ wallet: { connected: false, address: null, balance: ref.current.wallet.balance } });
  }, [patch]);

  const value = useMemo<AppValue>(
    () => ({
      ...s,
      selectedBounty,
      selectBounty,
      sendNormal,
      sendJailbreak,
      copyCanary,
      setSecretInput,
      pasteCanary,
      generateProof,
      resetFlow,
      connectWallet,
      disconnectWallet,
      secretMatches,
    }),
    [
      s, selectedBounty, selectBounty, sendNormal, sendJailbreak, copyCanary, setSecretInput,
      pasteCanary, generateProof, resetFlow, connectWallet, disconnectWallet, secretMatches,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
}
