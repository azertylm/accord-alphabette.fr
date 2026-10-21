import type { FamilleId } from './types';
import { SONS } from './sons';

/**
 * Le moteur sonore d'ACCORD — Web Audio, aucun fichier, rien à télécharger.
 *
 * Les neuf extraits sont synthétisés : bruit rose filtré pour les feuillages,
 * impulsions pour la pluie, triades pour le jazz, sinus tenus pour le silence.
 * Cinq secondes, une enveloppe propre, puis plus rien. La radio utilise les
 * mêmes matières, mais plus longtemps.
 *
 * Aucun son n'est enregistré ni envoyé : tout naît et meurt dans l'onglet.
 */

let contexte: AudioContext | null = null;
let analyseur: AnalyserNode | null = null;
let busGeneral: GainNode | null = null;

let bruitBlanc: AudioBuffer | null = null;
let bruitRose: AudioBuffer | null = null;
let bruitBrun: AudioBuffer | null = null;

const SON_DE_FAMILLE: Record<FamilleId, string> = {
  clairiere: 'foret',
  pluie: 'pluie',
  cuivre: 'jazz',
  nuit: 'silence',
  ville: 'ville',
  vague: 'vague',
  papier: 'papier',
  neon: 'neon',
  foyer: 'foyer',
};

function contexteAudio(): AudioContext {
  if (!contexte) {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    contexte = new Ctx();
    busGeneral = contexte.createGain();
    busGeneral.gain.value = 0.9;
    analyseur = contexte.createAnalyser();
    analyseur.fftSize = 1024;
    analyseur.smoothingTimeConstant = 0.78;
    busGeneral.connect(analyseur);
    busGeneral.connect(contexte.destination);
  }
  if (contexte.state === 'suspended') void contexte.resume();
  return contexte;
}

export function obtenirAnalyseur(): AnalyserNode | null {
  return analyseur;
}

export function reveillerAudio() {
  contexteAudio();
}

/* --------------------------------------------------------------------------
   Matières premières
-------------------------------------------------------------------------- */

function creerBruit(c: AudioContext, sorte: 'blanc' | 'rose' | 'brun'): AudioBuffer {
  const cache = sorte === 'blanc' ? bruitBlanc : sorte === 'rose' ? bruitRose : bruitBrun;
  if (cache) return cache;

  const secondes = 8;
  const taille = Math.floor(c.sampleRate * secondes);
  const buffer = c.createBuffer(1, taille, c.sampleRate);
  const donnees = buffer.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  let dernier = 0;

  for (let i = 0; i < taille; i += 1) {
    const blanc = Math.random() * 2 - 1;
    if (sorte === 'rose') {
      b0 = 0.99886 * b0 + blanc * 0.0555179;
      b1 = 0.99332 * b1 + blanc * 0.0750759;
      b2 = 0.969 * b2 + blanc * 0.153852;
      b3 = 0.8665 * b3 + blanc * 0.3104856;
      b4 = 0.55 * b4 + blanc * 0.5329522;
      b5 = -0.7616 * b5 - blanc * 0.016898;
      donnees[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + blanc * 0.5362) * 0.11;
      b6 = blanc * 0.115926;
    } else if (sorte === 'brun') {
      dernier = (dernier + 0.02 * blanc) / 1.02;
      donnees[i] = dernier * 3.2;
    } else {
      donnees[i] = blanc * 0.6;
    }
  }

  if (sorte === 'blanc') bruitBlanc = buffer;
  else if (sorte === 'rose') bruitRose = buffer;
  else bruitBrun = buffer;
  return buffer;
}

interface CoucheBruit {
  sorte?: 'blanc' | 'rose' | 'brun';
  filtres?: { type: BiquadFilterType; freq: number; q?: number }[];
  gain?: number;
  /** Modulation lente du gain : [fréquence Hz, profondeur]. */
  modulation?: [number, number];
  /** Balayage du dernier filtre : [fréquence de départ, fréquence d'arrivée]. */
  balayage?: [number, number];
}

function coucheBruit(
  c: AudioContext,
  destination: AudioNode,
  t0: number,
  duree: number,
  options: CoucheBruit,
): AudioScheduledSourceNode[] {
  const source = c.createBufferSource();
  source.buffer = creerBruit(c, options.sorte ?? 'rose');
  source.loop = true;

  let noeud: AudioNode = source;
  const filtres: BiquadFilterNode[] = [];
  for (const option of options.filtres ?? []) {
    const filtre = c.createBiquadFilter();
    filtre.type = option.type;
    filtre.frequency.value = option.freq;
    filtre.Q.value = option.q ?? 0.7;
    noeud.connect(filtre);
    noeud = filtre;
    filtres.push(filtre);
  }

  const gain = c.createGain();
  const niveau = options.gain ?? 0.04;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, niveau), t0 + 0.35);
  gain.gain.setValueAtTime(Math.max(0.0002, niveau), t0 + Math.max(0.4, duree - 0.5));
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
  noeud.connect(gain);
  gain.connect(destination);

  const sources: AudioScheduledSourceNode[] = [source];

  if (options.modulation) {
    const [freq, profondeur] = options.modulation;
    const lfo = c.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = freq;
    const amplitude = c.createGain();
    amplitude.gain.value = profondeur;
    lfo.connect(amplitude);
    amplitude.connect(gain.gain);
    lfo.start(t0);
    lfo.stop(t0 + duree);
    sources.push(lfo);
  }

  if (options.balayage && filtres.length > 0) {
    const filtre = filtres[filtres.length - 1];
    filtre.frequency.setValueAtTime(options.balayage[0], t0);
    filtre.frequency.exponentialRampToValueAtTime(
      Math.max(40, options.balayage[1]),
      t0 + duree * 0.92,
    );
  }

  source.start(t0, Math.random() * 4);
  source.stop(t0 + duree + 0.05);
  return sources;
}

function note(
  c: AudioContext,
  destination: AudioNode,
  frequence: number,
  t: number,
  duree: number,
  volume: number,
  forme: OscillatorType = 'sine',
  glisse?: number,
): OscillatorNode {
  const oscillateur = c.createOscillator();
  const gain = c.createGain();
  oscillateur.type = forme;
  oscillateur.frequency.setValueAtTime(frequence, t);
  if (glisse) {
    oscillateur.frequency.exponentialRampToValueAtTime(Math.max(20, glisse), t + duree * 0.85);
  }
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), t + Math.min(0.04, duree * 0.2));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  oscillateur.connect(gain);
  gain.connect(destination);
  oscillateur.start(t);
  oscillateur.stop(t + duree + 0.03);
  return oscillateur;
}

function craquement(
  c: AudioContext,
  destination: AudioNode,
  t: number,
  volume = 0.03,
  frequence = 2200,
): AudioBufferSourceNode {
  const source = c.createBufferSource();
  source.buffer = creerBruit(c, 'blanc');
  const filtre = c.createBiquadFilter();
  filtre.type = 'bandpass';
  filtre.frequency.value = frequence;
  filtre.Q.value = 1.4;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
  source.connect(filtre);
  filtre.connect(gain);
  gain.connect(destination);
  source.start(t, Math.random() * 7);
  source.stop(t + 0.05);
  return source;
}

function accord(
  c: AudioContext,
  destination: AudioNode,
  notes: number[],
  t: number,
  duree: number,
  volume: number,
  forme: OscillatorType = 'triangle',
) {
  for (const frequence of notes) {
    note(c, destination, frequence, t, duree, volume, forme);
    note(c, destination, frequence * 2.003, t, duree * 0.7, volume * 0.28, 'sine');
  }
}

/* --------------------------------------------------------------------------
   Les neuf matières
-------------------------------------------------------------------------- */

function construire(c: AudioContext, destination: AudioNode, son: string, t0: number, duree: number) {
  const fin = t0 + duree;
  const sources: AudioScheduledSourceNode[] = [];
  const ajouter = (liste: AudioScheduledSourceNode[]) => sources.push(...liste);

  if (son === 'foret') {
    ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'rose', filtres: [{ type: 'lowpass', freq: 620 }], gain: 0.05 }));
    ajouter(coucheBruit(c, destination, t0, duree, {
      sorte: 'rose',
      filtres: [{ type: 'bandpass', freq: 2700, q: 0.55 }],
      gain: 0.035,
      modulation: [0.13, 0.018],
    }));
    ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'brun', filtres: [{ type: 'lowpass', freq: 180 }], gain: 0.035 }));
    let t = t0 + 0.35;
    while (t < fin - 0.2) {
      const base = 2100 + Math.random() * 1900;
      const oscillateur = note(c, destination, base, t, 0.1, 0.022, 'sine', base * 1.45);
      sources.push(oscillateur);
      t += 0.24 + Math.random() * 0.5;
    }
    return sources;
  }

  if (son === 'pluie') {
    ajouter(coucheBruit(c, destination, t0, duree, {
      sorte: 'blanc',
      filtres: [{ type: 'highpass', freq: 1100 }, { type: 'lowpass', freq: 7200 }],
      gain: 0.085,
      modulation: [0.07, 0.02],
    }));
    ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'rose', filtres: [{ type: 'lowpass', freq: 480 }], gain: 0.035 }));
    let t = t0 + 0.15;
    while (t < fin - 0.15) {
      sources.push(craquement(c, destination, t, 0.014 + Math.random() * 0.02, 1500 + Math.random() * 2600));
      t += 0.09 + Math.random() * 0.2;
    }
    return sources;
  }

  if (son === 'jazz') {
    const grille = [
      [146.83, 174.61, 220, 261.63, 329.63],
      [196, 246.94, 293.66, 349.23, 440],
      [130.81, 164.81, 196, 246.94, 293.66],
      [110, 130.81, 164.81, 196, 246.94],
    ];
    const basses = [73.42, 98, 65.41, 55];
    const pas = 1.22;
    let index = 0;
    for (let t = t0 + 0.05; t < fin - 0.2; t += pas) {
      accord(c, destination, grille[index % grille.length], t, pas * 0.92, 0.022, 'triangle');
      note(c, destination, basses[index % basses.length], t, pas * 0.82, 0.055, 'sine');
      note(c, destination, basses[index % basses.length] * 2, t, pas * 0.42, 0.02, 'triangle');
      index += 1;
    }
    let tic = t0 + 0.2;
    let pair = false;
    while (tic < fin - 0.1) {
      sources.push(craquement(c, destination, tic, 0.017, 5200));
      tic += pair ? 0.5 : 0.38;
      pair = !pair;
    }
    // Grain de vinyle.
    let grain = t0 + 0.2;
    while (grain < fin - 0.1) {
      if (Math.random() > 0.55) sources.push(craquement(c, destination, grain, 0.012, 2400));
      grain += 0.18 + Math.random() * 0.4;
    }
    return sources;
  }

  if (son === 'silence') {
    ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'brun', filtres: [{ type: 'lowpass', freq: 420 }], gain: 0.026 }));
    const souffle = note(c, destination, 55, t0, duree, 0.014, 'sine');
    sources.push(souffle);
    const lointain = note(c, destination, 220, t0 + 0.9, duree - 1.4, 0.008, 'sine');
    sources.push(lointain);
    for (const depart of [0.9, 3.15]) {
      if (depart < duree - 1) {
        ajouter(coucheBruit(c, destination, t0 + depart, 1.5, {
          sorte: 'rose',
          filtres: [{ type: 'bandpass', freq: 700, q: 0.8 }],
          gain: 0.022,
        }));
      }
    }
    return sources;
  }

  if (son === 'ville') {
    ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'brun', filtres: [{ type: 'lowpass', freq: 320 }], gain: 0.055 }));
    ajouter(coucheBruit(c, destination, t0, duree, {
      sorte: 'rose',
      filtres: [{ type: 'bandpass', freq: 850, q: 0.6 }],
      gain: 0.028,
      modulation: [0.21, 0.014],
    }));
    ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'rose', filtres: [{ type: 'bandpass', freq: 450, q: 0.9 }], gain: 0.02 }));
    ajouter(coucheBruit(c, destination, t0 + 1.1, 1.5, {
      sorte: 'rose',
      filtres: [{ type: 'bandpass', freq: 600, q: 0.6 }],
      gain: 0.045,
      balayage: [500, 1800],
    }));
    ajouter(coucheBruit(c, destination, t0 + 3.3, 1.2, {
      sorte: 'rose',
      filtres: [{ type: 'bandpass', freq: 900, q: 0.5 }],
      gain: 0.035,
      balayage: [1500, 500],
    }));
    note(c, destination, 392, t0 + 2.35, 0.16, 0.014, 'sine');
    note(c, destination, 494, t0 + 2.52, 0.2, 0.014, 'sine');
    return sources;
  }

  if (son === 'vague') {
    ajouter(coucheBruit(c, destination, t0, duree, {
      sorte: 'rose',
      filtres: [{ type: 'lowpass', freq: 760 }],
      gain: 0.1,
      modulation: [0.08, 0.07],
    }));
    ajouter(coucheBruit(c, destination, t0, duree, {
      sorte: 'rose',
      filtres: [{ type: 'bandpass', freq: 1900, q: 0.5 }],
      gain: 0.035,
      modulation: [0.055, 0.03],
    }));
    ajouter(coucheBruit(c, destination, t0, duree, {
      sorte: 'brun',
      filtres: [{ type: 'lowpass', freq: 130 }],
      gain: 0.055,
      modulation: [0.05, 0.03],
    }));
    ajouter(coucheBruit(c, destination, t0 + 2.4, 1.4, {
      sorte: 'blanc',
      filtres: [{ type: 'highpass', freq: 3200 }],
      gain: 0.022,
    }));
    return sources;
  }

  if (son === 'papier') {
    const arpege = [130.81, 196, 329.63, 246.94, 174.61, 261.63, 392, 293.66];
    let index = 0;
    for (let t = t0 + 0.1; t < fin - 0.3; t += 0.46) {
      note(c, destination, arpege[index % arpege.length], t, 0.78, 0.032, 'triangle');
      note(c, destination, arpege[index % arpege.length] * 2.004, t, 0.5, 0.009, 'sine');
      index += 1;
    }
    ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'brun', filtres: [{ type: 'lowpass', freq: 260 }], gain: 0.025 }));
    let grain = t0 + 0.2;
    while (grain < fin - 0.1) {
      if (Math.random() > 0.42) sources.push(craquement(c, destination, grain, 0.016, 1900 + Math.random() * 1800));
      grain += 0.1 + Math.random() * 0.25;
    }
    return sources;
  }

  if (son === 'neon') {
    let temps = t0 + 0.05;
    let pas = 0;
    while (temps < fin - 0.2) {
      note(c, destination, 96, temps, 0.16, 0.11, 'sine', 44);
      note(c, destination, pas % 2 === 0 ? 55 : 65.41, temps, 0.34, 0.05, 'sawtooth');
      sources.push(craquement(c, destination, temps + 0.25, 0.015, 7000));
      if (pas % 4 === 2) {
        note(c, destination, 220, temps + 0.18, 0.12, 0.018, 'square');
        note(c, destination, 329.63, temps + 0.32, 0.1, 0.014, 'square');
      }
      temps += 0.5;
      pas += 1;
    }
    ajouter(coucheBruit(c, destination, t0, duree, {
      sorte: 'rose',
      filtres: [{ type: 'lowpass', freq: 1200 }],
      gain: 0.022,
      modulation: [0.09, 0.012],
    }));
    for (const frequence of [110, 164.81, 220]) {
      const oscillateur = c.createOscillator();
      const filtre = c.createBiquadFilter();
      const gain = c.createGain();
      oscillateur.type = 'sawtooth';
      oscillateur.frequency.value = frequence;
      filtre.type = 'lowpass';
      filtre.frequency.setValueAtTime(600, t0);
      filtre.frequency.linearRampToValueAtTime(1400, t0 + duree * 0.6);
      filtre.Q.value = 3;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(0.012, t0 + 1.1);
      gain.gain.linearRampToValueAtTime(0.0001, fin);
      oscillateur.connect(filtre);
      filtre.connect(gain);
      gain.connect(destination);
      oscillateur.start(t0);
      oscillateur.stop(fin + 0.05);
      sources.push(oscillateur);
    }
    return sources;
  }

  // foyer
  ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'brun', filtres: [{ type: 'lowpass', freq: 240 }], gain: 0.03 }));
  ajouter(coucheBruit(c, destination, t0, duree, { sorte: 'rose', filtres: [{ type: 'bandpass', freq: 650, q: 0.7 }], gain: 0.008 }));
  accord(c, destination, [174.61, 220, 261.63, 329.63], t0 + 0.2, duree - 0.4, 0.014, 'sine');
  const fredon = [261.63, 293.66, 349.23, 329.63, 293.66, 261.63, 220, 246.94];
  let index = 0;
  for (let t = t0 + 0.5; t < fin - 0.5; t += 0.58) {
    note(c, destination, fredon[index % fredon.length], t, 0.52, 0.018, 'sine');
    index += 1;
  }
  let braise = t0 + 0.15;
  while (braise < fin - 0.1) {
    sources.push(craquement(c, destination, braise, 0.008 + Math.random() * 0.035, 900 + Math.random() * 2600));
    braise += 0.07 + Math.random() * 0.24;
  }
  return sources;
}

export interface Lecture {
  stop: () => void;
  analyseur: AnalyserNode | null;
  duree: number;
}

/**
 * Joue un extrait (ou un lit de radio) et rend la main immédiatement.
 * `onFin` est appelé une seule fois, à la fin naturelle — jamais après stop().
 */
export function jouerSon(sonId: string, duree = 5, onFin?: () => void): Lecture {
  const c = contexteAudio();
  const t0 = c.currentTime + 0.06;
  const fin = t0 + duree;

  const bus = c.createGain();
  bus.gain.setValueAtTime(0.0001, t0);
  bus.gain.exponentialRampToValueAtTime(0.95, t0 + 0.18);
  bus.gain.setValueAtTime(0.95, Math.max(t0 + 0.2, fin - 0.45));
  bus.gain.exponentialRampToValueAtTime(0.0001, fin);
  bus.connect(busGeneral ?? c.destination);

  const sources = construire(c, bus, sonId, t0, duree);

  let termine = false;
  let arret: number | null = null;
  const finaliser = () => {
    if (termine) return;
    termine = true;
    if (arret !== null) window.clearTimeout(arret);
    window.setTimeout(() => {
      try {
        sources.forEach((source) => source.stop());
      } catch {
        /* déjà arrêtée. */
      }
      try {
        bus.disconnect();
      } catch {
        /* déjà déconnecté. */
      }
    }, 240);
  };

  const minutage = window.setTimeout(() => {
    finaliser();
    onFin?.();
  }, Math.max(200, (fin - c.currentTime) * 1000));

  arret = minutage;

  return {
    stop: () => {
      if (termine) return;
      termine = true;
      window.clearTimeout(minutage);
      const t = c.currentTime;
      try {
        bus.gain.cancelScheduledValues(t);
        bus.gain.setValueAtTime(Math.max(0.0002, bus.gain.value), t);
        bus.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      } catch {
        /* gain déjà au repos. */
      }
      window.setTimeout(() => {
        try {
          sources.forEach((source) => source.stop());
        } catch {
          /* déjà arrêtée. */
        }
        try {
          bus.disconnect();
        } catch {
          /* déjà déconnecté. */
        }
      }, 260);
      onFin = undefined;
    },
    analyseur,
    duree,
  };
}

/** Le lit de la radio : même matière, plus longue, choisie par famille. */
export function jouerFamille(famille: FamilleId, duree: number, onFin?: () => void): Lecture {
  return jouerSon(SON_DE_FAMILLE[famille], duree, onFin);
}

/** Vérifie qu'un extrait existe encore (garde le catalogue et le moteur liés). */
export function extraitExiste(id: string): boolean {
  return SONS.some((son) => son.id === id);
}
