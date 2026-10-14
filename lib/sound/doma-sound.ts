/**
 * DOMA 사운드 — 스펙: sense-brand
 * 기본 ON · 입장 터치 후 unlock · Web Audio 톤 스텁 (wav 없음)
 * 볼륨/뮤트는 OS 담당 — 앱은 DOMA 끄기 토글만
 */

export type SoundEvent =
  | "pierce"
  | "support"
  | "campSwitch"
  | "judgment"
  | "agendaConfirm";

export type SoundPrefs = {
  /** 기본 true — false면 DOMA 이벤트 음 전부 */
  enabled: boolean;
};

const STORAGE_KEY = "doma.sound.v1";

/** 재생 게인 고정 — OS 볼륨이 최종 크기 */
const PLAY_GAIN = 0.55;

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

type Tone = { freq: number; dur: number; type?: OscillatorType; gain?: number };

/** 이벤트별 짧은 톤 (1–2개) · 파일 없이 생성 */
const TONES: Record<SoundEvent, Tone[]> = {
  pierce: [
    { freq: 180, dur: 0.05, type: "square", gain: 0.35 },
    { freq: 420, dur: 0.09, type: "triangle", gain: 0.28 },
  ],
  support: [{ freq: 520, dur: 0.07, type: "sine", gain: 0.3 }],
  campSwitch: [
    { freq: 300, dur: 0.05, type: "triangle", gain: 0.28 },
    { freq: 240, dur: 0.08, type: "triangle", gain: 0.25 },
  ],
  judgment: [
    { freq: 160, dur: 0.12, type: "sine", gain: 0.35 },
    { freq: 110, dur: 0.16, type: "sine", gain: 0.3 },
  ],
  agendaConfirm: [
    { freq: 440, dur: 0.06, type: "sine", gain: 0.28 },
    { freq: 660, dur: 0.1, type: "sine", gain: 0.22 },
  ],
};

function beep(c: AudioContext, tone: Tone, when: number) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = tone.type ?? "sine";
  osc.frequency.value = tone.freq;
  const peak = (tone.gain ?? 0.25) * PLAY_GAIN;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), when + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, when + tone.dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(when);
  osc.stop(when + tone.dur + 0.02);
}

/** 이벤트 훅 — unlock 전·DOMA 끄기면 no-op (볼륨은 OS) */
export function playDomaSound(event: SoundEvent): void {
  if (!prefs().enabled) return;
  if (!unlocked) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();

  const tones = TONES[event];
  let t = c.currentTime;
  for (const tone of tones) {
    beep(c, tone, t);
    t += tone.dur * 0.85;
  }
}
