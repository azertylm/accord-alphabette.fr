import type { ModuleInfo, Son } from './types';

/**
 * Les neuf extraits du test.
 *
 * Chacun dure cinq secondes et n'est pas un fichier audio : il est synthétisé
 * dans le navigateur par l'API Web Audio (voir audio.ts). Rien à télécharger,
 * aucune licence, aucun son envoyé. L'utilisateur ne choisit pas un genre : il
 * dit seulement si son oreille s'y sent bien.
 */

export const SONS: Son[] = [
  {
    id: 'foret',
    numero: '01',
    nom: 'Forêt au matin',
    texture: 'feuillages · oiseaux · air clair',
    famille: 'clairiere',
    axes: { chaleur: 60, mouvement: 34, nature: 96, densite: 20, lumiere: 86 },
    ecoute: 'Le jour se lève derrière les troncs.',
  },
  {
    id: 'pluie',
    numero: '02',
    nom: 'Pluie sur un toit',
    texture: 'averse · gouttière · nappe',
    famille: 'pluie',
    axes: { chaleur: 36, mouvement: 24, nature: 70, densite: 62, lumiere: 30 },
    ecoute: 'Une averse régulière, à l’abri.',
  },
  {
    id: 'jazz',
    numero: '03',
    nom: 'Jazz de nuit',
    texture: 'piano · contrebasse · cymbales',
    famille: 'cuivre',
    axes: { chaleur: 90, mouvement: 60, nature: 16, densite: 54, lumiere: 44 },
    ecoute: 'Un trio qui joue pour trois personnes.',
  },
  {
    id: 'silence',
    numero: '04',
    nom: 'Silence habité',
    texture: 'souffle · pièce · note tenue',
    famille: 'nuit',
    axes: { chaleur: 44, mouvement: 8, nature: 52, densite: 10, lumiere: 8 },
    ecoute: 'Pas le vide : ce qui reste quand tout s’arrête.',
  },
  {
    id: 'ville',
    numero: '05',
    nom: 'Ville qui respire',
    texture: 'trottoir · café · klaxon lointain',
    famille: 'ville',
    axes: { chaleur: 54, mouvement: 84, nature: 14, densite: 80, lumiere: 58 },
    ecoute: 'La rue à hauteur d’épaule.',
  },
  {
    id: 'vague',
    numero: '06',
    nom: 'Vague longue',
    texture: 'houle · ressac · horizon',
    famille: 'vague',
    axes: { chaleur: 46, mouvement: 42, nature: 92, densite: 32, lumiere: 66 },
    ecoute: 'Une vague met dix secondes à finir.',
  },
  {
    id: 'papier',
    numero: '07',
    nom: 'Papier et bois',
    texture: 'guitare · vinyle · grain',
    famille: 'papier',
    axes: { chaleur: 76, mouvement: 28, nature: 40, densite: 28, lumiere: 42 },
    ecoute: 'Une corde pincée dans une pièce en bois.',
  },
  {
    id: 'neon',
    numero: '08',
    nom: 'Néon',
    texture: 'pulsation · basse · nuit',
    famille: 'neon',
    axes: { chaleur: 26, mouvement: 94, nature: 6, densite: 88, lumiere: 20 },
    ecoute: 'La ville qui ne s’éteint pas.',
  },
  {
    id: 'foyer',
    numero: '09',
    nom: 'Voix et feu',
    texture: 'braises · fredonnement · laine',
    famille: 'foyer',
    axes: { chaleur: 94, mouvement: 14, nature: 56, densite: 38, lumiere: 50 },
    ecoute: 'Quelqu’un fredonne près du feu.',
  },
];

export const MODULES: ModuleInfo[] = [
  {
    id: 'sons',
    numero: '01',
    nom: 'Le test des 9 sons',
    question: 'Et si je choisissais juste ce qui me fait du bien à écouter ?',
    promesse: 'Neuf extraits de cinq secondes. Une famille sonore. Une playlist prête.',
    duree: '2 min',
    glyphe: '9',
  },
  {
    id: 'dimanche',
    numero: '02',
    nom: 'L’activité du dimanche',
    question: 'Et si le dimanche était déjà organisé ?',
    promesse: 'Une seule sortie, adaptée à l’âge, à la météo et au budget. Billets prêts.',
    duree: '1 min',
    glyphe: '☼',
  },
  {
    id: 'voix',
    numero: '03',
    nom: 'Ma voix suffit',
    question: 'Et si je racontais ma journée à voix haute, sans rien formuler ?',
    promesse: 'Vingt secondes de parole libre. Trois envies pour cette semaine.',
    duree: '20 s',
    glyphe: '◍',
  },
  {
    id: 'radio',
    numero: '04',
    nom: 'La radio de mes goûts',
    question: 'Et si un flux continu me connaissait mieux qu’un algorithme ?',
    promesse: 'Aucun bouton. Ce que tu ne zappes pas resserre le flux, seconde après seconde.',
    duree: 'continu',
    glyphe: '≈',
  },
  {
    id: 'lecon',
    numero: '05',
    nom: 'Cinq minutes',
    question: 'Et si ma culture quotidienne était choisie pour moi ?',
    promesse: 'Une seule micro-leçon par jour, juste à côté de ce que tu aimes déjà.',
    duree: '5 min',
    glyphe: '5',
  },
];
