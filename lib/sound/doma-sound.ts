/**
 * DOMA 사운드 — 스펙: sense-brand.md
 * 브금 루프 없음 · 동일 짧은 스팅만 (입장 · 전장 마무리/판결)
 * 지지·진영전환 SFX 없음 · 설정 뮤트 존중 · 첫 터치 unlock
 */

export type SoundEvent =
  | "sting"
  /** @deprecated → sting */
  | "pierce"
  /** @deprecated → sting */
  | "judgment"
  | "support"
  | "campSwitch"
  | "agendaConfirm";

export type SoundPrefs = {
  /** 기본 true — false면 DOMA 스팅 전부 끔 */
  enabled: boolean;
};

const STORAGE_KEY = "doma.sound.v1";

/** 재생 게인 고정 — OS 볼륨이 최종 크기 */
const PLAY_GAIN = 0.62;

export function defaultSoundPrefs(): SoundPrefs {
  return { enabled: true };
}

export function loadSoundPrefs(): SoundPrefs {
  if (typeof window === "undefined") return defaultSoundPrefs();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSoundPrefs();
    const parsed = JSON.parse(raw) as Partial<SoundPrefs>;
    return { enabled: parsed.enabled !== false };
  } catch {
    return defaultSoundPrefs();
  }
}

export function saveSoundPrefs(patch: Partial<SoundPrefs>): SoundPrefs {
  const next: SoundPrefs = {
    ...loadSoundPrefs(),
    ...patch,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  prefsCache = next;
  return next;
}

let prefsCache: SoundPrefs | null = null;
let ctx: AudioContext | null = null;
let unlocked = false;

function prefs(): SoundPrefs {
  if (!prefsCache) prefsCache = loadSoundPrefs();
  return prefsCache;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

/** 입장 터치 등 유저 제스처에서 호출 — 자동재생 잠금 해제 */
export function unlockDomaSound(): void {
  const c = getCtx();
  if (!c) return;
  unlocked = true;
  if (c.state === "suspended") {
    void c.resume();
  }
}

export function isSoundUnlocked(): boolean {
  return unlocked;
}

/**
 * 시그니처 스팅 — 건조한 타격·도장/금속 (~0.35s).
 * 입장·판결에 동일 재사용. 오케스트라/루프 금지.
 */
function playSignatureSting(c: AudioContext): void {
  const t0 = c.currentTime;
  const master = c.createGain();
  master.gain.value = PLAY_GAIN;
  master.connect(c.destination);

  // 저음 도장
  const thump = c.createOscillator();
  const thumpG = c.createGain();
  thump.type = "sine";
  thump.frequency.setValueAtTime(92, t0);
  thump.frequency.exponentialRampToValueAtTime(48, t0 + 0.18);
  thumpG.gain.setValueAtTime(0.0001, t0);
  thumpG.gain.exponentialRampToValueAtTime(0.55, t0 + 0.01);
  thumpG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
  thump.connect(thumpG);
  thumpG.connect(master);
  thump.start(t0);
  thump.stop(t0 + 0.24);

  // 금속 타격
  const hit = c.createOscillator();
  const hitG = c.createGain();
  hit.type = "square";
  hit.frequency.setValueAtTime(620, t0);
  hit.frequency.exponentialRampToValueAtTime(180, t0 + 0.08);
  hitG.gain.setValueAtTime(0.0001, t0);
  hitG.gain.exponentialRampToValueAtTime(0.22, t0 + 0.006);
  hitG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
  hit.connect(hitG);
  hitG.connect(master);
  hit.start(t0);
  hit.stop(t0 + 0.12);

  // 짧은 잔향 톤
  const ring = c.createOscillator();
  const ringG = c.createGain();
  ring.type = "triangle";
  ring.frequency.value = 240;
  ringG.gain.setValueAtTime(0.0001, t0 + 0.04);
  ringG.gain.exponentialRampToValueAtTime(0.12, t0 + 0.055);
  ringG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
  ring.connect(ringG);
  ringG.connect(master);
  ring.start(t0 + 0.04);
  ring.stop(t0 + 0.34);
}

/** 입장·판결만 스팅. 지지/진영전환/안건확정은 no-op (수한 확정) */
export function playDomaSound(event: SoundEvent): void {
  if (!prefs().enabled) return;
  if (!unlocked) return;

  if (
    event === "support" ||
    event === "campSwitch" ||
    event === "agendaConfirm"
  ) {
    return;
  }

  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();

  /** pierce / judgment → 동일 시그니처 */
  playSignatureSting(c);
}

/** 명시적 스팅 API */
export function playDomaSting(): void {
  playDomaSound("sting");
}
