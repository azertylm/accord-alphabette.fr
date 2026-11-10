import type { Envie } from './types';

/**
 * Les envies locales.
 *
 * Trois directions, jamais un catalogue. Le moteur local cherche des mots dans
 * ce qui a été dit (ou reconnu par le navigateur) et lit l'énergie de la voix.
 * Chaque envie porte une action réelle : un lien, un geste, un endroit.
 */

export interface EnvieModele {
  id: string;
  nom: string;
  phrase: string;
  action: string;
  mots: string[];
  url: (requete: string) => string;
}

export interface Prosodie {
  energie: number;
  variation: number;
  silences: number;
  duree: number;
}

const sansAccents = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const recherche = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
const carte = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const ENVIES: EnvieModele[] = [
  {
    id: 'silence',
    nom: 'Du silence',
    phrase: 'Si ta journée a été bruyante, ce n’est peut-être pas de solitude dont tu as besoin, mais de calme.',
    action: 'Ferme la porte vingt minutes',
    mots: ['bruit', 'bruyant', 'fatigue', 'fatigué', 'tete', 'tête', 'stress', 'cri', 'cris', 'monde', 'agace'],
    url: () => recherche('exercice de calme cinq minutes'),
  },
  {
    id: 'dehors',
    nom: 'De l’air',
    phrase: 'Si tu as passé beaucoup de temps entre des murs, un peu d’horizon peut faire du bien.',
    action: 'Marche sans écouteurs',
    mots: ['enferme', 'enfermé', 'sortir', 'marcher', 'dehors', 'respirer', 'air', 'parc', 'jardin'],
    url: () => carte('parc jardin proche'),
  },
  {
    id: 'compagnie',
    nom: 'De la compagnie',
    phrase: 'Peut-être qu’un visage te manque. Voir ou entendre quelqu’un change souvent une semaine.',
    action: 'Appelle une personne ce soir',
    mots: ['seul', 'seule', 'ami', 'amie', 'parler', 'voir', 'famille', 'copain', 'copine', 'manque'],
    url: () => carte('café ouvert ce soir'),
  },
  {
    id: 'mouvement',
    nom: 'Bouger',
    phrase: 'Si l’énergie tourne en rond, il lui faut peut-être un corps en mouvement plutôt qu’une pensée de plus.',
    action: 'Vingt minutes de marche rapide',
    mots: ['energie', 'énergie', 'courir', 'sport', 'danser', 'immobile', 'bouger', 'nerveux', 'agite'],
    url: () => carte('parc sport plein air'),
  },
  {
    id: 'creer',
    nom: 'Créer',
    phrase: 'Si une idée a essayé de passer aujourd’hui, elle mérite dix minutes de vraie attention.',
    action: 'Commence par dix minutes',
    mots: ['idee', 'idée', 'dessiner', 'ecrire', 'écrire', 'projet', 'faire', 'creer', 'créer', 'atelier'],
    url: () => recherche('idées pour commencer à créer dix minutes'),
  },
  {
    id: 'ecouter',
    nom: 'Écouter',
    phrase: 'Un son choisi par toi fait souvent plus de bien qu’un fond sonore subi.',
    action: 'Mets un disque entier',
    mots: ['musique', 'silence', 'bruit', 'chanson', 'radio', 'ecouter', 'écouter', 'playlist', 'son'],
    url: (q) => `https://www.deezer.com/search/${encodeURIComponent(q || 'album entier')}`,
  },
  {
    id: 'dormir',
    nom: 'Dormir',
    phrase: 'La fatigue n’est pas un détail de la journée : c’est peut-être son vrai message. Si elle dure des semaines, parles-en à ton médecin.',
    action: 'Couche-toi trente minutes plus tôt',
    mots: ['fatigue', 'fatigué', 'nuit', 'sommeil', 'reveil', 'réveil', 'epuise', 'épuisé', 'dormir', 'courte nuit'],
    url: () => recherche('routine sommeil trente minutes'),
  },
  {
    id: 'manger',
    nom: 'Manger',
    phrase: 'Si tu as sauté un repas ou mangé debout, un vrai repas est une manière lente de prendre soin de toi.',
    action: 'Cuisine un plat simple',
    mots: ['faim', 'repas', 'cuisine', 'cuisiner', 'gout', 'goût', 'restaurant', 'manger', 'dejeuner', 'déjeuner'],
    url: () => recherche('recette simple 20 minutes'),
  },
  {
    id: 'ralentir',
    nom: 'Ralentir',
    phrase: 'Si la journée a filé sans que tu la choisisses, rappelle-toi qu’une pause n’est pas une récompense : c’est un besoin.',
    action: 'Quinze minutes sans écran',
    mots: ['course', 'presse', 'pressé', 'temps', 'pause', 'vite', 'urgent', 'debordé', 'deborder'],
    url: () => recherche('exercice respiration cinq minutes'),
  },
  {
    id: 'lire',
    nom: 'Lire',
    phrase: 'Une histoire te ferait peut-être du bien, si tu t’autorises à t’arrêter assez longtemps.',
    action: 'Ouvre le livre posé sur la table',
    mots: ['livre', 'lire', 'histoire', 'page', 'calme', 'roman', 'librairie', 'lecture'],
    url: () => carte('librairie indépendante'),
  },
  {
    id: 'appeler',
    nom: 'Donner des nouvelles',
    phrase: 'Si quelqu’un t’a traversé l’esprit aujourd’hui, ce n’est peut-être pas anodin.',
    action: 'Envoie un message maintenant',
    mots: ['famille', 'mere', 'mère', 'pere', 'père', 'nouvelles', 'appeler', 'telephone', 'téléphone', 'soeur', 'frere'],
    url: () => 'sms:',
  },
  {
    id: 'chanter',
    nom: 'Chanter',
    phrase: 'Ta voix a peut-être envie de sortir, même faux, même sous la douche.',
    action: 'Chante une chanson entière',
    mots: ['chanter', 'voix', 'fredonner', 'musique', 'chanson', 'douche'],
    url: (q) => `https://www.deezer.com/search/${encodeURIComponent(q || 'chanson à chanter')}`,
  },
];

function envie(modele: EnvieModele, requete: string, source: 'local' | 'mistral'): Envie {
  return {
    id: modele.id,
    nom: modele.nom,
    phrase: modele.phrase,
    action: modele.action,
    url: modele.url(requete),
    source,
  };
}

export function enviesLocales(texte: string, prosodie: Prosodie): Envie[] {
  const normalise = sansAccents(texte);
  const scores = ENVIES.map((modele) => {
    let score = 0;
    for (const mot of modele.mots) {
      if (normalise.includes(sansAccents(mot))) score += 3;
    }
    // La prosodie ne remplace pas les mots : elle départage.
    if (modele.id === 'mouvement' && prosodie.energie > 55) score += 2;
    if (modele.id === 'chanter' && prosodie.energie > 62) score += 1.5;
    if (modele.id === 'silence' && prosodie.silences > 0.32) score += 2;
    if (modele.id === 'dormir' && prosodie.energie < 34) score += 2;
    if (modele.id === 'creer' && prosodie.variation > 38) score += 1.5;
    if (modele.id === 'ecouter' && prosodie.variation > 30) score += 1;
    if (modele.id === 'compagnie' && prosodie.silences > 0.4) score += 1;
    return { modele, score };
  }).sort((a, b) => b.score - a.score);

  const retenues: EnvieModele[] = [];
  for (const { modele, score } of scores) {
    if (score > 0) retenues.push(modele);
    if (retenues.length >= 3) break;
  }

  const ordreProsodie: string[] = [];
  if (prosodie.energie > 58) ordreProsodie.push('mouvement', 'chanter', 'creer');
  if (prosodie.silences > 0.3) ordreProsodie.push('silence', 'dormir', 'ralentir');
  if (prosodie.variation > 36) ordreProsodie.push('creer', 'ecouter', 'dehors');
  ordreProsodie.push('dehors', 'compagnie', 'ecouter', 'ralentir', 'manger', 'lire', 'appeler');

  for (const id of ordreProsodie) {
    if (retenues.length >= 3) break;
    const modele = ENVIES.find((envieModele) => envieModele.id === id);
    if (modele && !retenues.some((retenue) => retenue.id === id)) retenues.push(modele);
  }

  return retenues.slice(0, 3).map((modele) => envie(modele, modele.nom, 'local'));
}

export function mesurerProsodie(echantillons: number[], duree: number): Prosodie {
  const valeurs = echantillons.filter((valeur) => valeur > 0);
  if (valeurs.length === 0) return { energie: 46, variation: 34, silences: 0.3, duree };
  const moyenne = valeurs.reduce((total, valeur) => total + valeur, 0) / valeurs.length;
  const variance =
    valeurs.reduce((total, valeur) => total + (valeur - moyenne) ** 2, 0) / valeurs.length;
  const silences = valeurs.filter((valeur) => valeur < 0.012).length / valeurs.length;
  return {
    energie: Math.max(0, Math.min(100, moyenne * 900)),
    variation: Math.max(0, Math.min(100, Math.sqrt(variance) * 1300)),
    silences,
    duree,
  };
}
