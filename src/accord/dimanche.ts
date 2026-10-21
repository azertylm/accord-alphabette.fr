import type { FamilleId, Sortie } from './types';

/**
 * L'activité du dimanche — une seule, jamais un programme.
 *
 * L'âge des enfants, la météo du lieu et le budget suffisent. Le catalogue est
 * local, donc rien ne dépend d'une API de sorties : ACCORD choisit, prépare la
 * fiche de réservation et l'invitation d'agenda. La billetterie s'ouvre en un
 * clic ; l'application ne prétend pas vendre les billets elle-même.
 */

export interface Meteo {
  temperature: number;
  code: number;
  ville: string;
  latitude: number;
  longitude: number;
}

export type FamilleMeteo = 'sec' | 'pluie' | 'froid' | 'chaud';

export type Budget = 'gratuit' | 'petit' | 'moyen';

export interface Activite {
  id: string;
  nom: string;
  lieu: string;
  description: string;
  pourquoi: string;
  preparation: string[];
  duree: string;
  prix: string;
  budget: Budget;
  ageMin: number;
  ageMax: number;
  meteo: FamilleMeteo[];
  affinites: FamilleId[];
  requete: string;
}

export const ACTIVITES: Activite[] = [
  {
    id: 'museum',
    nom: 'Un musée avant la foule',
    lieu: 'Le musée d’histoire naturelle le plus proche',
    description:
      'Arriver à l’ouverture, prendre une seule salle, laisser les enfants choisir leur objet préféré. Une heure et demie suffit — et évite la fatigue des grands parcours.',
    pourquoi: 'À l’abri, calme le matin, et les collections naturalistes parlent aux petits comme aux grands.',
    preparation: ['Réserver le créneau de 10 h 30', 'Prendre une gourde', 'Choisir une seule salle'],
    duree: '1 h 30',
    prix: '≈ 12 € par adulte, gratuit pour les moins de 18 ans',
    budget: 'petit',
    ageMin: 4,
    ageMax: 14,
    meteo: ['pluie', 'froid', 'sec', 'chaud'],
    affinites: ['papier', 'nuit', 'clairiere'],
    requete: 'billets musée histoire naturelle',
  },
  {
    id: 'ferme',
    nom: 'La ferme pédagogique',
    lieu: 'Une ferme urbaine ou pédagogique à 30 minutes',
    description:
      'Nourrir les chèvres, voir traire, finir par un goûter. Les enfants bougent, les adultes ralentissent. Prévoir des bottes même s’il ne pleut pas.',
    pourquoi: 'Le contact animal fonctionne à tous les âges, et la sortie reste courte.',
    preparation: ['Vérifier les horaires de traite', 'Bottes et change', 'Un peu de grain autorisé'],
    duree: '2 h',
    prix: '≈ 6 € par personne',
    budget: 'petit',
    ageMin: 1,
    ageMax: 10,
    meteo: ['sec', 'chaud'],
    affinites: ['clairiere', 'vague', 'foyer'],
    requete: 'billets ferme pédagogique',
  },
  {
    id: 'planetarium',
    nom: 'Le planétarium',
    lieu: 'Le planétarium ou l’observatoire le plus proche',
    description:
      'Une séance de 45 minutes sous la coupole, puis l’exposition. Les plus petits décrochent parfois : choisir une séance adaptée à leur âge.',
    pourquoi: 'La nuit artificielle fascine, et la salle sombre calme les groupes.',
    preparation: ['Réserver la séance jeune public', 'Arriver 15 minutes avant', 'Éviter les jours de scolaire'],
    duree: '1 h 15',
    prix: '≈ 8 € par personne',
    budget: 'petit',
    ageMin: 5,
    ageMax: 14,
    meteo: ['pluie', 'froid', 'sec', 'chaud'],
    affinites: ['nuit', 'neon', 'vague'],
    requete: 'billets planétarium jeune public',
  },
  {
    id: 'atelier',
    nom: 'Un atelier de terre',
    lieu: 'Un atelier céramique qui accepte les familles',
    description:
      'Deux heures les mains dans l’argile. Chacun repart avec une pièce à cuire, récupérée plus tard. Le résultat compte moins que le geste.',
    pourquoi: 'Les enfants font, les adultes soufflent — et la matière se souvient des mains.',
    preparation: ['Réserver un atelier famille', 'Vêtements qui ne craignent rien', 'Prévoir la récupération'],
    duree: '2 h',
    prix: '≈ 25 € par personne',
    budget: 'moyen',
    ageMin: 6,
    ageMax: 14,
    meteo: ['pluie', 'froid', 'sec', 'chaud'],
    affinites: ['papier', 'foyer', 'clairiere'],
    requete: 'billets atelier céramique famille',
  },
  {
    id: 'accrobranche',
    nom: 'Les arbres à hauteur d’enfant',
    lieu: 'Un parc accrobranche avec parcours juniors',
    description:
      'Une heure et demie de parcours, un pique-nique, et le retour avant la fin du jour. Vérifier la taille minimum avant de réserver.',
    pourquoi: 'Le mouvement évacue la semaine, et les parcours juniors sont faits pour les 5-10 ans.',
    preparation: ['Vérifier la taille minimale', 'Chaussures fermées', 'Pique-nique'],
    duree: '3 h',
    prix: '≈ 18 € par enfant',
    budget: 'moyen',
    ageMin: 5,
    ageMax: 13,
    meteo: ['sec', 'chaud'],
    affinites: ['clairiere', 'vague', 'ville'],
    requete: 'billets accrobranche famille',
  },
  {
    id: 'piscine',
    nom: 'La piscine au réveil',
    lieu: 'La piscine municipale avec bassin ludique',
    description:
      'Ouvrir à 9 h, nager quarante minutes, puis le goûter. Les bassins ludiques sont souvent vides le dimanche matin.',
    pourquoi: 'Peu de monde, un budget maîtrisé, et tout le monde ressort détendu.',
    preparation: ['Vérifier les horaires du dimanche', 'Bonnet obligatoire', 'Pièce pour le casier'],
    duree: '1 h 30',
    prix: '≈ 5 € par adulte',
    budget: 'gratuit',
    ageMin: 0,
    ageMax: 14,
    meteo: ['pluie', 'froid', 'sec', 'chaud'],
    affinites: ['vague', 'ville', 'foyer'],
    requete: 'billets piscine municipale',
  },
  {
    id: 'rando',
    nom: 'La boucle des trois kilomètres',
    lieu: 'Un sentier familial autour d’un lac ou d’un bois',
    description:
      'Trois kilomètres, une crique pour la pause, un jeu de piste naturel : trouver trois feuilles différentes, un oiseau, une trace. Retour avant midi.',
    pourquoi: 'Gratuit, dehors, et la distance reste tenable pour les jambes de six ans.',
    preparation: ['Chaussures de marche', 'Eau et encas', 'Imprimer le parcours'],
    duree: '2 h',
    prix: 'Gratuit',
    budget: 'gratuit',
    ageMin: 4,
    ageMax: 14,
    meteo: ['sec', 'chaud', 'froid'],
    affinites: ['clairiere', 'vague', 'papier'],
    requete: 'sentier randonnée famille 3 km',
  },
  {
    id: 'cinema',
    nom: 'La séance du dimanche matin',
    lieu: 'Le cinéma qui programme un film jeune public',
    description:
      'Une séance à 10 h 30, un film de 80 minutes, pas de bande-annonce interminable. Choisir la salle la plus proche et rentrer à pied.',
    pourquoi: 'Abrité, facile, et la séance du matin laisse l’après-midi libre.',
    preparation: ['Vérifier la séance jeune public', 'Réserver les places', 'Prévoir un pull'],
    duree: '2 h',
    prix: '≈ 7 € par personne',
    budget: 'petit',
    ageMin: 3,
    ageMax: 13,
    meteo: ['pluie', 'froid', 'chaud'],
    affinites: ['nuit', 'neon', 'cuivre'],
    requete: 'billets cinéma séance jeune public',
  },
  {
    id: 'marche',
    nom: 'Le marché couvert',
    lieu: 'Le marché couvert du centre-ville',
    description:
      'Donner à chacun un budget de cinq euros et une mission : rapporter de quoi faire le déjeuner. Les enfants achètent, goûtent, négocient.',
    pourquoi: 'Gratuit, vivant, et l’après-midi commence avec un repas choisi ensemble.',
    preparation: ['Cinq euros par enfant', 'Un panier', 'Une liste très courte'],
    duree: '1 h 30',
    prix: 'Le budget du déjeuner',
    budget: 'petit',
    ageMin: 5,
    ageMax: 14,
    meteo: ['sec', 'chaud', 'froid'],
    affinites: ['ville', 'foyer', 'cuivre'],
    requete: 'marché couvert ville',
  },
  {
    id: 'jardin',
    nom: 'Le jardin des plantes',
    lieu: 'Le jardin botanique ou les serres municipales',
    description:
      'Les serres tropicales pour la chaleur, les pelouses pour courir, l’herbier pour ramasser trois feuilles et les coller à la maison.',
    pourquoi: 'Gratuit, abrité si besoin, et assez grand pour ne pas se marcher dessus.',
    preparation: ['Vérifier l’ouverture des serres', 'Un cahier pour l’herbier', 'Goûter'],
    duree: '2 h',
    prix: 'Gratuit',
    budget: 'gratuit',
    ageMin: 0,
    ageMax: 12,
    meteo: ['sec', 'chaud', 'pluie'],
    affinites: ['clairiere', 'vague', 'papier'],
    requete: 'jardin botanique serres famille',
  },
  {
    id: 'librairie',
    nom: 'La librairie et le chocolat chaud',
    lieu: 'Une librairie jeunesse avec un coin lecture',
    description:
      'Chacun choisit un livre, puis on lit vingt minutes au café d’à côté. Budget livre par enfant, chocolat chaud pour tous.',
    pourquoi: 'Une sortie lente, parfaite quand il fait gris, et un souvenir qui reste.',
    preparation: ['Un budget par enfant', 'Demander le coin lecture', 'Prévoir le retour à pied'],
    duree: '1 h 30',
    prix: '≈ 12 € par livre',
    budget: 'moyen',
    ageMin: 4,
    ageMax: 14,
    meteo: ['pluie', 'froid'],
    affinites: ['papier', 'foyer', 'nuit'],
    requete: 'librairie jeunesse coin lecture',
  },
  {
    id: 'pate',
    nom: 'La cuisine à quatre mains',
    lieu: 'La cuisine de la maison',
    description:
      'Une pâte à pizza qui pousse pendant que l’on range, chacun sa garniture, et le four à 250 °C. Le dimanche devient un atelier, sans trajet.',
    pourquoi: 'Zéro billet, zéro météo, et les enfants mangent ce qu’ils ont fait.',
    preparation: ['Sortir la farine la veille', 'Deux heures de pousse', 'Un tablier par enfant'],
    duree: '3 h',
    prix: '≈ 8 € au total',
    budget: 'gratuit',
    ageMin: 2,
    ageMax: 14,
    meteo: ['pluie', 'froid', 'sec', 'chaud'],
    affinites: ['foyer', 'papier', 'cuivre'],
    requete: 'recette pizza famille',
  },
  {
    id: 'brocante',
    nom: 'La brocante du dimanche',
    lieu: 'La brocante ou le vide-grenier du quartier',
    description:
      'Donner à chacun trois euros et une mission : un objet qui raconte quelque chose. On repart avec une histoire, pas un sac.',
    pourquoi: 'Gratuit, imprévisible, et les enfants adorent marchander.',
    preparation: ['Trois euros par enfant', 'Un sac', 'Repérer la brocante'],
    duree: '1 h 30',
    prix: 'Quelques euros',
    budget: 'gratuit',
    ageMin: 6,
    ageMax: 14,
    meteo: ['sec', 'chaud'],
    affinites: ['ville', 'papier', 'cuivre'],
    requete: 'brocante vide-grenier dimanche',
  },
  {
    id: 'expo',
    nom: 'L’exposition dont on parle',
    lieu: 'Le centre d’art ou la médiathèque',
    description:
      'Une expo courte, un jeu : chacun choisit l’œuvre qu’il emporterait chez lui et explique pourquoi. Trente minutes de regard, pas plus.',
    pourquoi: 'Souvent gratuite, abritée, et les médiathèques prêtent des cartes-jeux.',
    preparation: ['Vérifier l’accès gratuit', 'Demander le livret enfant', 'Prévoir 45 minutes'],
    duree: '1 h',
    prix: 'Souvent gratuit',
    budget: 'gratuit',
    ageMin: 6,
    ageMax: 14,
    meteo: ['pluie', 'froid', 'chaud'],
    affinites: ['papier', 'neon', 'nuit'],
    requete: 'exposition famille médiathèque',
  },
];

/* --------------------------------------------------------------------------
   Météo — Open-Meteo, sans clé ni compte
-------------------------------------------------------------------------- */

function position(): Promise<{ latitude: number; longitude: number } | null> {
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => resolve(null),
      { timeout: 3500, maximumAge: 20 * 60 * 1000 },
    );
  });
}

export async function chargerMeteo(): Promise<Meteo> {
  const point = await position();
  const latitude = point?.latitude ?? 48.8566;
  const longitude = point?.longitude ?? 2.3522;
  const ville = point ? 'autour de toi' : 'Paris (par défaut)';
  try {
    const reponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`,
    );
    if (!reponse.ok) throw new Error('météo indisponible');
    const json = (await reponse.json()) as { current?: { temperature_2m?: number; weather_code?: number } };
    return {
      temperature: Math.round(json.current?.temperature_2m ?? 14),
      code: json.current?.weather_code ?? 2,
      ville,
      latitude,
      longitude,
    };
  } catch {
    return { temperature: 14, code: 2, ville, latitude, longitude };
  }
}

export function familleMeteo(code: number, temperature: number): FamilleMeteo {
  if (code >= 51) return 'pluie';
  if (code >= 71 && code <= 77) return 'froid';
  if (temperature <= 7) return 'froid';
  if (temperature >= 25) return 'chaud';
  return 'sec';
}

export function emojiMeteo(code: number): string {
  if (code >= 95) return '⛈️';
  if (code >= 71 && code <= 86) return '❄️';
  if (code >= 51 && code <= 82) return '🌧️';
  if (code === 45 || code === 48) return '🌫️';
  if (code === 3) return '☁️';
  if (code === 2) return '🌤️';
  return '☀️';
}

export function texteMeteo(code: number, temperature: number): string {
  const famille = familleMeteo(code, temperature);
  if (famille === 'pluie') return 'il pleut';
  if (famille === 'froid') return 'il fait froid';
  if (famille === 'chaud') return 'il fait bon';
  return 'le ciel est clair';
}

/* --------------------------------------------------------------------------
   Le choix — une seule sortie
-------------------------------------------------------------------------- */

export function prochainDimanche(date = new Date()): Date {
  const jour = date.getDay();
  const delta = jour === 0 ? 0 : 7 - jour;
  const dimanche = new Date(date);
  dimanche.setDate(date.getDate() + delta);
  dimanche.setHours(10, 30, 0, 0);
  return dimanche;
}

export function dateLongue(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

const RANG_BUDGET: Record<Budget, number> = { gratuit: 0, petit: 1, moyen: 2 };

function scoreActivite(activite: Activite, ages: number[], meteo: FamilleMeteo, budget: Budget) {
  let score = 0;
  for (const age of ages) {
    if (age >= activite.ageMin && age <= activite.ageMax) score += 4;
    else if (age < activite.ageMin) score -= (activite.ageMin - age) * 2;
    else score -= (age - activite.ageMax) * 1.2;
  }
  if (activite.meteo.includes(meteo)) score += 5;
  else score -= 6;
  const ecart = RANG_BUDGET[budget] - RANG_BUDGET[activite.budget];
  if (ecart >= 0) score += 3;
  else score -= 4;
  return score;
}

function hashChaine(texte: string): number {
  let hash = 0;
  for (let i = 0; i < texte.length; i += 1) hash = (hash * 31 + texte.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function reference(activite: Activite, date: Date): string {
  const graine = hashChaine(`${activite.id}-${date.toISOString().slice(0, 10)}`);
  return `AC-${String(graine % 9000 + 1000)}-${String((graine >> 3) % 900 + 100)}`;
}

/**
 * Choisit UNE activité : la meilleure pour l'âge et la météo, stable sur le
 * week-end (la même famille ne voit pas changer la sortie entre samedi soir et
 * dimanche matin), mais qui sait aussi changer de semaine.
 */
export function choisirSortie(
  ages: number[],
  meteo: FamilleMeteo,
  budget: Budget,
  famille: FamilleId,
  date = prochainDimanche(),
  variante = 0,
): Sortie {
  const classement = [...ACTIVITES]
    .map((activite) => ({
      activite,
      score: scoreActivite(activite, ages, meteo, budget) + (activite.affinites.includes(famille) ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  const vivier = classement.filter((entree) => entree.score >= classement[0].score - 3).slice(0, 3);
  const semaine = Math.floor(date.getTime() / (86_400_000 * 7));
  const choix = vivier[(semaine + variante) % vivier.length] ?? classement[0];
  const activite = choix.activite;
  const dimanche = prochainDimanche(date);
  const places = 2 + Math.max(1, ages.length);

  return {
    id: activite.id,
    nom: activite.nom,
    lieu: activite.lieu,
    description: activite.description,
    pourquoi: activite.pourquoi,
    conseil: '',
    preparation: activite.preparation,
    duree: activite.duree,
    prix: activite.prix,
    reference: reference(activite, dimanche),
    date: dimanche.toISOString(),
    heure: '10 h 30',
    places,
    lienBillets: `https://www.google.com/search?q=${encodeURIComponent(`${activite.requete} ${dateLongue(dimanche)}`)}`,
    source: 'local',
  };
}

/* --------------------------------------------------------------------------
   Billets et agenda
-------------------------------------------------------------------------- */

/** Un motif carré déterministe, purement décoratif : la fiche de réservation. */
export function motifReservation(reference: string): boolean[] {
  let graine = hashChaine(reference);
  return Array.from({ length: 49 }, (_, index) => {
    graine = (graine * 1103515245 + 12345) & 0x7fffffff;
    if (index % 8 === 7) return false;
    return ((graine >> 8) & 1) === 1;
  });
}

function echapperIcs(texte: string): string {
  return texte.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function formatIcs(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(
    date.getMinutes(),
  )}00`;
}

export function invitationIcs(sortie: Sortie): string {
  const debut = new Date(sortie.date);
  const fin = new Date(debut.getTime() + 2 * 60 * 60 * 1000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ACCORD//Alphabette//FR',
    'BEGIN:VEVENT',
    `UID:${sortie.reference}@accord.alphabette.fr`,
    `DTSTAMP:${formatIcs(new Date())}`,
    `DTSTART:${formatIcs(debut)}`,
    `DTEND:${formatIcs(fin)}`,
    `SUMMARY:${echapperIcs(sortie.nom)}`,
    `LOCATION:${echapperIcs(sortie.lieu)}`,
    `DESCRIPTION:${echapperIcs(
      `${sortie.description}\n\nRéservation ${sortie.reference} · ${sortie.places} places.\n${sortie.lienBillets}`,
    )}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function telechargerInvitation(sortie: Sortie) {
  const blob = new Blob([invitationIcs(sortie)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = `accord-dimanche-${sortie.reference}.ics`;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
