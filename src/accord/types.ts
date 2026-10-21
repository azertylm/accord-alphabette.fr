/**
 * ACCORD — les types du profil d'écoute partagé.
 *
 * Un seul profil, cinq modules. Le test des 9 sons ouvre le bal ; la sortie du
 * dimanche, la voix, la radio et la leçon de cinq minutes y déposent chacun un
 * signal. L'utilisateur ne remplit jamais de formulaire : il réagit, il parle,
 * il laisse filer — le profil se recompose derrière.
 */

export type ModuleId = 'sons' | 'dimanche' | 'voix' | 'radio' | 'lecon';

export type FamilleId =
  | 'clairiere'
  | 'pluie'
  | 'cuivre'
  | 'nuit'
  | 'ville'
  | 'vague'
  | 'papier'
  | 'neon'
  | 'foyer';

export type Axe = 'chaleur' | 'mouvement' | 'nature' | 'densite' | 'lumiere';

export type Axes = Record<Axe, number>;

export interface Famille {
  id: FamilleId;
  nom: string;
  sousTitre: string;
  phrase: string;
  geste: string;
  mots: string[];
  axes: Axes;
}

export interface Son {
  id: string;
  numero: string;
  nom: string;
  texture: string;
  famille: FamilleId;
  axes: Axes;
  ecoute: string;
}

export interface Piste {
  titre: string;
  artiste: string;
  duree: string;
}

export interface Playlist {
  nom: string;
  intention: string;
  duree: string;
  pistes: Piste[];
}

export interface Envie {
  id: string;
  nom: string;
  phrase: string;
  action: string;
  url: string;
  source: 'local' | 'mistral';
}

export interface Sortie {
  id: string;
  nom: string;
  lieu: string;
  description: string;
  pourquoi: string;
  conseil: string;
  preparation: string[];
  duree: string;
  prix: string;
  reference: string;
  date: string;
  heure: string;
  places: number;
  lienBillets: string;
  source: 'local' | 'mistral';
}

export interface LeconRef {
  id: string;
  titre: string;
  domaine: string;
  date: string;
}

export interface Lecon {
  id: string;
  titre: string;
  domaine: string;
  accroche: string;
  paragraphes: string[];
  points: string[];
  anecdote: string;
  action: string;
  mots: string[];
  familles: FamilleId[];
  source: 'local' | 'mistral';
}

export interface Profil {
  famille: FamilleId;
  axes: Axes;
  mots: string[];
  confiance: number;
  modules: Partial<Record<ModuleId, number>>;
  source: 'local' | 'mistral';
  maj: string;
  envies?: Envie[];
  sortie?: Sortie;
  lecon?: LeconRef;
  radio?: { famille: FamilleId; minutes: number; passes: number };
}

export interface Signal {
  famille?: FamilleId;
  axes?: Partial<Axes>;
  mots?: string[];
  confiance?: number;
  source?: 'local' | 'mistral';
  envies?: Envie[];
  sortie?: Sortie;
  lecon?: LeconRef;
  radio?: Profil['radio'];
}

export interface ModuleInfo {
  id: ModuleId;
  numero: string;
  nom: string;
  question: string;
  promesse: string;
  duree: string;
  glyphe: string;
}
