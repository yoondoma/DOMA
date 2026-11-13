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
 * 시그니처 스팅 — 클래식·웅장 (고대 콜로세움 입구).
 * 짧은 브라스 5도 + 저음 팀파니 (~0.55s). SF/전자음 금지. 루프 없음.
 */
function playSignatureSting(c: AudioContext): void {
  const t0 = c.currentTime;
  const master = c.createGain();
  master.gain.value = PLAY_GAIN;
  master.connect(c.destination);

  // 따뜻한 브라스 필터
  const brassLp = c.createBiquadFilter();
  brassLp.type = "lowpass";
  brassLp.frequency.setValueAtTime(900, t0);
  brassLp.frequency.exponentialRampToValueAtTime(420, t0 + 0.5);
  brassLp.Q.value = 0.7;
  brassLp.connect(master);

  const tone = (
    freq: number,
    type: OscillatorType,
    start: number,
    dur: number,
    peak: number,
    dest: AudioNode,
  ) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0 + start);
    g.gain.setValueAtTime(0.0001, t0 + start);
    g.gain.exponentialRampToValueAtTime(peak, t0 + start + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t0 + start);
    o.stop(t0 + start + dur + 0.02);
  };

  // 팀파니 저음 — 묵직한 입구
  tone(55, "sine", 0, 0.42, 0.48, master);
  tone(82.4, "sine", 0.01, 0.36, 0.28, master);

  // 브라스 완전5도 (C3–G3) — 짧고 웅장
  tone(130.81, "sawtooth", 0.02, 0.48, 0.14, brassLp);
  tone(196.0, "sawtooth", 0.03, 0.46, 0.11, brassLp);
  // 옥타브 살짝 — 홀 잔향감
  tone(261.63, "triangle", 0.05, 0.4, 0.07, brassLp);
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
