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
import { CannedAiError, extractCanary, sendCannedAiMessage, submitLocalClaim } from '@/lib/canned-ai';

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
  demoMode: boolean;
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
  setDemoMode: (enabled: boolean) => void;
  addMockTransaction: () => void;
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
  demoMode: true,
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
    const { prompt } = probeFor(b);
    setS((prev) => ({ ...prev, askedNormal: true, aiTyping: true, messages: [...prev.messages, prompt] }));
    void sendCannedAiMessage(prompt.text)
      .then((reply) => append([{ id: rid(), role: 'ai', text: reply, kind: prompt.kind, status: 'ok' }]))
      .catch((error: unknown) => append([{ id: rid(), role: 'ai', text: error instanceof CannedAiError ? error.message : 'The canned AI request failed.', kind: prompt.kind, status: 'warn' }]))
      .finally(() => patch({ aiTyping: false }));
  }, [append, patch]);

  const sendJailbreak = useCallback(() => {
    const b = ref.current.selectedBountyId
      ? ref.current.bounties.find((x) => x.id === ref.current.selectedBountyId)
      : null;
    if (!b || ref.current.jailbroken || ref.current.aiTyping) return;
    const { prompt } = exploitFor(b);
    setS((prev) => ({ ...prev, jailbroken: true, aiTyping: true, messages: [...prev.messages, prompt] }));
    void sendCannedAiMessage(prompt.text)
      .then((reply) => {
        const secret = extractCanary(reply);
        append([{ id: rid(), role: 'ai', text: reply, kind: prompt.kind, status: secret ? 'warn' : 'ok', canary: secret !== null, secret: secret ?? undefined }]);
        patch(secret ? { aiTyping: false, capturedSecret: secret } : { aiTyping: false });
      })
      .catch((error: unknown) => {
        append([{ id: rid(), role: 'ai', text: error instanceof CannedAiError ? error.message : 'The canned AI request failed.', kind: prompt.kind, status: 'warn' }]);
        patch({ aiTyping: false });
      });
  }, [append, patch]);

  const copyCanary = useCallback(() => {
    if (ref.current.capturedSecret) navigator.clipboard?.writeText(ref.current.capturedSecret).catch(() => void 0);
  }, []);

  const setSecretInput = useCallback((v: string) => patch({ secretInput: v, proofError: false }), [patch]);
  const pasteCanary = useCallback(() => {
    if (ref.current.capturedSecret) patch({ secretInput: ref.current.capturedSecret, proofError: false });
  }, [patch]);

  const secretMatches = useMemo(
    () => !!s.capturedSecret && s.secretInput.trim() === s.capturedSecret,
    [s.capturedSecret, s.secretInput],
  );

  const generateProof = useCallback(() => {
    const cur = ref.current;
    const b = cur.selectedBountyId ? cur.bounties.find((x) => x.id === cur.selectedBountyId) : null;
    if (!b || cur.proving || cur.lastClaim) return;
    // Real claims require a connected wallet and a matching private witness.
    if (!cur.demoMode && !cur.wallet.connected) return;
    if (!cur.demoMode && (!cur.capturedSecret || cur.secretInput.trim() !== cur.capturedSecret)) {
      patch({ proofError: true });
      return;
    }
    patch({ proving: true, proofStep: 0, proofError: false });

    schedule(() => patch({ proofStep: 1 }), 600);
    schedule(() => patch({ proofStep: 2 }), 1200);
    const claimRequest = cur.demoMode
      ? new Promise<{ transactionId: string }>((resolve) => schedule(
        () => resolve({ transactionId: `mock-demo-${Date.now().toString(36)}` }), 900,
      ))
      : submitLocalClaim(cur.secretInput.trim());

    void claimRequest
      .then((result) => {
        const claim: Claim = {
          id: rid(),
          bountyId: b.id,
          bountyName: b.name,
          amount: b.reward,
          status: 'verified',
          txRef: result.transactionId,
          date: new Date().toISOString(),
          isMock: cur.demoMode,
        };
        setS((prev) => ({
          ...prev,
          proving: false,
          proofStep: 3,
          lastClaim: claim,
          claims: [claim, ...prev.claims],
          // Claim verification is real; token payout is intentionally not
          // represented until a settlement circuit is implemented.
          bounties: prev.bounties.map((x) => (x.id === b.id ? { ...x, status: 'claimed', endsInHours: 0 } : x)),
        }));
      })
      .catch(() => patch({ proving: false, proofStep: -1, proofError: true }));
  }, [patch, schedule]);

  const setDemoMode = useCallback((enabled: boolean) => patch({ demoMode: enabled, proofError: false }), [patch]);

  const resetFlow = useCallback(() => {
    const id = ref.current.selectedBountyId;
    if (id) selectBounty(id);
  }, [selectBounty]);

  const addMockTransaction = useCallback(() => {
    const bounty = ref.current.bounties.find((item) => item.status !== 'claimed') ?? ref.current.bounties[0];
    if (!bounty) return;
    const mockClaim: Claim = {
      id: `demo-${rid()}`,
      bountyId: bounty.id,
      bountyName: `${bounty.name} (judge demo)`,
      amount: bounty.reward,
      status: 'verified',
      txRef: `mock-preview-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      isMock: true,
    };
    setS((prev) => ({ ...prev, claims: [mockClaim, ...prev.claims] }));
  }, []);

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
      setDemoMode,
      addMockTransaction,
      connectWallet,
      disconnectWallet,
      secretMatches,
    }),
    [
      s, selectedBounty, selectBounty, sendNormal, sendJailbreak, copyCanary, setSecretInput,
      pasteCanary, generateProof, resetFlow, setDemoMode, addMockTransaction, connectWallet, disconnectWallet, secretMatches,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
}
