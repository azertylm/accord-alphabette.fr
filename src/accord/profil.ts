import { FAMILLES, ORDRE_FAMILLES } from './familles';
import { SONS } from './sons';
import type { Axe, Axes, FamilleId, ModuleId, Profil, Signal } from './types';

/**
 * Le profil d'écoute partagé.
 *
 * Il vit dans le navigateur (localStorage) et ne part jamais tout seul. Chaque
 * module y dépose un signal ; la fusion est douce (72 % de l'acquis, 28 % du
 * nouveau) pour qu'une radio écoutée cinq minutes ne renverse pas le test des
 * neuf sons — mais laisse tout de même une trace.
 */

const CLE = 'accord.profil.v1';
const AXES: Axe[] = ['chaleur', 'mouvement', 'nature', 'densite', 'lumiere'];
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export const AXES_LABELS: Record<Axe, string> = {
  chaleur: 'Chaleur',
  mouvement: 'Mouvement',
  nature: 'Nature',
  densite: 'Densité',
  lumiere: 'Lumière',
};

export const AXES_HINTS: Record<Axe, [string, string]> = {
  chaleur: ['minéral', 'humain'],
  mouvement: ['immobile', 'pulsé'],
  nature: ['urbain', 'organique'],
  densite: ['aéré', 'dense'],
  lumiere: ['sombre', 'clair'],
};

/** La famille dont les cinq axes sont les plus proches de ceux du profil. */
export function familleLaPlusProche(axes: Axes): FamilleId {
  let meilleure: FamilleId = 'clairiere';
  let distance = Number.POSITIVE_INFINITY;
  for (const id of ORDRE_FAMILLES) {
    const f = FAMILLES[id];
    const d = AXES.reduce((somme, axe) => somme + (f.axes[axe] - axes[axe]) ** 2, 0);
    if (d < distance) {
      distance = d;
      meilleure = id;
    }
  }
  return meilleure;
}

function axesComplets(axes: Partial<Axes> | undefined, famille: FamilleId): Axes {
  const base = FAMILLES[famille].axes;
  return AXES.reduce(
    (acc, axe) => {
      acc[axe] = Math.round(clamp(axes?.[axe] ?? base[axe]));
      return acc;
    },
    {} as Axes,
  );
}

export function profilVide(signal: Signal, module: ModuleId): Profil {
  const famille = signal.famille ?? familleLaPlusProche(axesComplets(signal.axes, 'clairiere'));
  const axes = axesComplets(signal.axes, famille);
  return {
    famille,
    axes,
    mots: Array.from(new Set([...(signal.mots ?? []), ...FAMILLES[famille].mots])).slice(0, 8),
    confiance: Math.round(clamp(signal.confiance ?? 46)),
    modules: { [module]: 1 },
    source: signal.source ?? 'local',
    maj: new Date().toISOString(),
    envies: signal.envies,
    sortie: signal.sortie,
    lecon: signal.lecon,
    radio: signal.radio,
  };
}

export function fusionner(base: Profil | null, signal: Signal, module: ModuleId): Profil {
  if (!base) return profilVide(signal, module);

  const famille = signal.famille ?? base.famille;
  const axes = { ...base.axes };
  for (const axe of AXES) {
    const valeur = signal.axes?.[axe];
    if (typeof valeur === 'number') {
      axes[axe] = Math.round(clamp(base.axes[axe] * 0.72 + valeur * 0.28));
    }
  }

  const counts = { ...base.modules };
  const dejaVu = Boolean(counts[module]);
  counts[module] = (counts[module] ?? 0) + 1;

  const gain = module === 'sons' ? 8 : dejaVu ? 2 : 5;

  return {
    ...base,
    famille,
    axes,
    mots: Array.from(new Set([...(signal.mots ?? []), ...base.mots])).slice(0, 8),
    confiance: Math.round(clamp(base.confiance + gain, 0, 96)),
    modules: counts,
    source: signal.source === 'mistral' ? 'mistral' : base.source,
    envies: signal.envies ?? base.envies,
    sortie: signal.sortie ?? base.sortie,
    lecon: signal.lecon ?? base.lecon,
    radio: signal.radio ?? base.radio,
    maj: new Date().toISOString(),
  };
}

export function lireProfil(): Profil | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const profil = JSON.parse(brut) as Profil;
    if (!profil?.famille || !profil.axes || !Array.isArray(profil.mots)) return null;
    if (!FAMILLES[profil.famille]) return null;
    return profil;
  } catch {
    return null;
  }
}

export function ecrireProfil(profil: Profil) {
  try {
    localStorage.setItem(CLE, JSON.stringify(profil));
  } catch {
    /* navigation privée : le profil vit le temps de la session. */
  }
}

export function oublierProfil() {
  try {
    localStorage.removeItem(CLE);
  } catch {
    /* rien à faire. */
  }
}

export function niveauConfiance(confiance: number): string {
  if (confiance >= 88) return 'accordé';
  if (confiance >= 72) return 'net';
  if (confiance >= 56) return 'esquissé';
  return 'premiers sons';
}

export function modulesActifs(profil: Profil): ModuleId[] {
  return (Object.keys(profil.modules) as ModuleId[]).filter((id) => (profil.modules[id] ?? 0) > 0);
}

/* ---------------------------------------------------------------------------
   Le test des 9 sons → signal de profil
--------------------------------------------------------------------------- */

export type Reaction = 'aime' | 'pas' | 'neutre';

export interface ResultatSons {
  famille: FamilleId;
  axes: Axes;
  mots: string[];
  confiance: number;
  aimes: string[];
  ecartes: string[];
  phrase: string;
}

/**
 * Chaque extrait aimé pèse deux points pour sa famille, chaque extrait écarté
 * en retire un (sans jamais l'empêcher d'être choisie si elle est aimée
 * ailleurs). Les axes sont la moyenne pondérée des extraits aimés — à défaut,
 * de tous ceux qui ont été écoutés.
 */
export function analyserSons(reactions: Record<string, Reaction>): ResultatSons {
  const scores = ORDRE_FAMILLES.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<FamilleId, number>,
  );
  const aimes = SONS.filter((son) => reactions[son.id] === 'aime');
  const ecartes = SONS.filter((son) => reactions[son.id] === 'pas');
  const entendus = SONS.filter((son) => reactions[son.id] !== undefined && reactions[son.id] !== 'neutre');

  for (const son of aimes) scores[son.famille] += 2;
  for (const son of ecartes) scores[son.famille] -= 1;

  // Une famille jamais entendue ne peut pas gagner par hasard.
  const candidates = ORDRE_FAMILLES.filter((id) => aimes.some((son) => son.famille === id));
  let famille: FamilleId = candidates[0] ?? (FAMILLES.clairiere.id as FamilleId);
  if (candidates.length > 0) {
    famille = candidates.reduce((meilleure, id) => (scores[id] > scores[meilleure] ? id : meilleure), candidates[0]);
  } else if (entendus.length > 0) {
    famille = entendus[0].famille;
  }

  // Les axes : priorité aux extraits aimés, sinon à tout ce qui a été entendu.
  const base = aimes.length ? aimes : entendus.length ? entendus : SONS;
  const axes = AXES.reduce(
    (acc, axe) => {
      const somme = base.reduce((total, son) => total + son.axes[axe], 0);
      acc[axe] = Math.round(clamp(somme / base.length));
      return acc;
    },
    {} as Axes,
  );

  const mots = Array.from(
    new Set([...aimes.flatMap((son) => [son.texture.split(' · ')[0]]), ...FAMILLES[famille].mots]),
  ).slice(0, 6);

  const confiance = Math.round(clamp(50 + aimes.length * 5 + entendus.length, 0, 94));

  return {
    famille,
    axes,
    mots,
    confiance,
    aimes: aimes.map((son) => son.nom),
    ecartes: ecartes.map((son) => son.nom),
    phrase: FAMILLES[famille].phrase,
  };
}
