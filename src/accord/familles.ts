import type { Famille, FamilleId, Playlist } from './types';

/**
 * Les neuf familles sonores d'ACCORD.
 *
 * Chaque famille décrit une manière d'habiter le son : sa chaleur, son
 * mouvement, sa part de nature, sa densité et sa lumière. Ce sont les cinq
 * axes du profil — les mêmes que ceux du test des 9 sons, de la radio et des
 * autres modules. Aucune famille n'est « meilleure » : elles sont neuf façons
 * d'être bien.
 */

export const FAMILLES: Record<FamilleId, Famille> = {
  clairiere: {
    id: 'clairiere',
    nom: 'Clairière',
    sousTitre: 'Nature claire, cordes à l’air',
    phrase:
      'Ton oreille cherche l’air avant le volume : des cordes qui respirent, des feuillages, une lumière qui traverse. Le silence n’y est pas vide, il est aéré.',
    geste: 'Ouvre la fenêtre et laisse entrer le matin.',
    mots: ['aéré', 'feuillu', 'clair', 'acoustique', 'matin'],
    axes: { chaleur: 62, mouvement: 32, nature: 94, densite: 24, lumiere: 82 },
  },
  pluie: {
    id: 'pluie',
    nom: 'Averse',
    sousTitre: 'Pluie fine, piano proche',
    phrase:
      'Tu aimes que le monde se taise un peu. Une averse derrière la vitre, quelques notes espacées : le bruit devient une couverture, pas une menace.',
    geste: 'Reste une minute de plus sous l’auvent.',
    mots: ['enveloppant', 'régulier', 'intime', 'triste-doux', 'abrité'],
    axes: { chaleur: 38, mouvement: 22, nature: 72, densite: 58, lumiere: 34 },
  },
  cuivre: {
    id: 'cuivre',
    nom: 'Cuivre',
    sousTitre: 'Jazz de nuit, chaleur humaine',
    phrase:
      'Tu écoutes les gens autant que la musique. Un piano qui traîne, une contrebasse qui marche : il te faut du vivant, du bois, des désaccords qui finissent bien.',
    geste: 'Commande un dernier verre et reste pour le rappel.',
    mots: ['chaleureux', 'vivant', 'cuivré', 'nocturne', 'humain'],
    axes: { chaleur: 88, mouvement: 58, nature: 18, densite: 52, lumiere: 46 },
  },
  nuit: {
    id: 'nuit',
    nom: 'Nuit blanche',
    sousTitre: 'Silence habité, drones longs',
    phrase:
      'Ton repos a besoin d’espace. Pas de vide : une nappe lointaine, un souffle, une note tenue. Tu entends le silence comme d’autres entendent une chanson.',
    geste: 'Éteins une lumière, garde une seule note.',
    mots: ['immobile', 'vaste', 'feutré', 'nocturne', 'suspendu'],
    axes: { chaleur: 46, mouvement: 8, nature: 50, densite: 12, lumiere: 8 },
  },
  ville: {
    id: 'ville',
    nom: 'Boulevard',
    sousTitre: 'Ville vivante, rythme doux',
    phrase:
      'Tu aimes sentir que ça circule. Un café qui parle, une basse ronde, des pas sur le trottoir : le mouvement te tient compagnie sans te bousculer.',
    geste: 'Prends la rue parallèle, celle qui a des arbres.',
    mots: ['urbain', 'fluide', 'solaire', 'habité', 'rythmé'],
    axes: { chaleur: 54, mouvement: 82, nature: 16, densite: 78, lumiere: 56 },
  },
  vague: {
    id: 'vague',
    nom: 'Grand large',
    sousTitre: 'Houle longue, guitares amples',
    phrase:
      'Il te faut de l’ampleur. Une vague qui monte, une guitare qui s’ouvre, une voix qui prend son temps : tu respires mieux quand le son a de l’horizon.',
    geste: 'Regarde au-delà de la dernière ligne droite.',
    mots: ['ample', 'organique', 'puissant-doux', 'horizon', 'marin'],
    axes: { chaleur: 48, mouvement: 44, nature: 90, densite: 34, lumiere: 64 },
  },
  papier: {
    id: 'papier',
    nom: 'Papier de verre',
    sousTitre: 'Bois, cordes, vinyle',
    phrase:
      'Tu préfères ce qui a une matière. Une corde pincée, un grain de vinyle, un bois qui travaille : le son doit avoir été touché par quelqu’un.',
    geste: 'Sors le disque, laisse le craquement.',
    mots: ['artisanal', 'grainé', 'proche', 'acoustique', 'patiné'],
    axes: { chaleur: 74, mouvement: 26, nature: 42, densite: 30, lumiere: 44 },
  },
  neon: {
    id: 'neon',
    nom: 'Néon',
    sousTitre: 'Pulsation, nuit électrique',
    phrase:
      'Tu aimes que le son te pousse. Une pulsation nette, des synthés qui brillent, une ville qui ne dort pas : le mouvement te donne de l’énergie au lieu de te fatiguer.',
    geste: 'Marche plus vite, la ville suivra.',
    mots: ['précis', 'électrique', 'nocturne', 'motorisé', 'brillant'],
    axes: { chaleur: 28, mouvement: 92, nature: 8, densite: 86, lumiere: 22 },
  },
  foyer: {
    id: 'foyer',
    nom: 'Foyer',
    sousTitre: 'Voix proche, feu doux',
    phrase:
      'Ce que tu écoutes doit te ramener à quelque chose de connu. Une voix qui parle bas, un feu qui craque, une mélodie simple : la chaleur avant la performance.',
    geste: 'Baisse la lumière et laisse parler.',
    mots: ['chaleureux', 'familier', 'lent', 'voix', 'réconfortant'],
    axes: { chaleur: 92, mouvement: 16, nature: 58, densite: 40, lumiere: 52 },
  },
};

export const ORDRE_FAMILLES: FamilleId[] = [
  'clairiere',
  'pluie',
  'cuivre',
  'nuit',
  'ville',
  'vague',
  'papier',
  'neon',
  'foyer',
];

export const PLAYLISTS: Record<FamilleId, Playlist> = {
  clairiere: {
    nom: 'Clairière — cordes à l’air',
    intention: 'Pour les matins qui prennent leur temps et les fenêtres ouvertes.',
    duree: '48 min',
    pistes: [
      { titre: 'Bloom', artiste: 'The Paper Kites', duree: '3:30' },
      { titre: 'Holocene', artiste: 'Bon Iver', duree: '5:36' },
      { titre: 'Promise', artiste: 'Ben Howard', duree: '6:21' },
      { titre: 'Riverside', artiste: 'Agnes Obel', duree: '3:48' },
      { titre: 'Heartbeats', artiste: 'José González', duree: '2:40' },
      { titre: 'Cherry Wine', artiste: 'Hozier', duree: '4:00' },
      { titre: 'The Wolves (Act I and II)', artiste: 'Bon Iver', duree: '5:22' },
    ],
  },
  pluie: {
    nom: 'Averse — piano sous la pluie',
    intention: 'Quand dehors il tombe des cordes et qu’on est bien dedans.',
    duree: '52 min',
    pistes: [
      { titre: 'Nuvole Bianche', artiste: 'Ludovico Einaudi', duree: '5:57' },
      { titre: 'Says', artiste: 'Nils Frahm', duree: '8:19' },
      { titre: 'Near Light', artiste: 'Ólafur Arnalds', duree: '4:30' },
      { titre: 'Opus 23', artiste: 'Dustin O’Halloran', duree: '4:48' },
      { titre: 'Ambre', artiste: 'Nils Frahm', duree: '3:56' },
      { titre: 'Experience', artiste: 'Ludovico Einaudi', duree: '5:15' },
      { titre: 'Saman', artiste: 'Ólafur Arnalds', duree: '2:44' },
    ],
  },
  cuivre: {
    nom: 'Cuivre — après minuit',
    intention: 'Un club presque vide, un piano qui refuse de s’arrêter.',
    duree: '56 min',
    pistes: [
      { titre: 'So What', artiste: 'Miles Davis', duree: '9:22' },
      { titre: 'Take Five', artiste: 'The Dave Brubeck Quartet', duree: '5:24' },
      { titre: 'My Favorite Things', artiste: 'John Coltrane', duree: '13:41' },
      { titre: '’Round Midnight', artiste: 'Thelonious Monk', duree: '6:38' },
      { titre: 'Autumn Leaves', artiste: 'Bill Evans', duree: '5:58' },
      { titre: 'Moanin’', artiste: 'Art Blakey & The Jazz Messengers', duree: '9:34' },
      { titre: 'Feeling Good', artiste: 'Nina Simone', duree: '2:54' },
    ],
  },
  nuit: {
    nom: 'Nuit blanche — une note tenue',
    intention: 'Pour les nuits où l’on ne cherche pas à dormir tout de suite.',
    duree: '1 h 04',
    pistes: [
      { titre: 'Spiegel im Spiegel', artiste: 'Arvo Pärt', duree: '9:22' },
      { titre: 'Gymnopédie No. 1', artiste: 'Erik Satie', duree: '3:21' },
      { titre: 'Clair de Lune', artiste: 'Claude Debussy', duree: '5:05' },
      { titre: 'An Ending (Ascent)', artiste: 'Brian Eno', duree: '4:24' },
      { titre: 'Weightless', artiste: 'Marconi Union', duree: '8:08' },
      { titre: 'Svefn-g-englar', artiste: 'Sigur Rós', duree: '10:04' },
      { titre: 'Nocturne No. 2', artiste: 'Frédéric Chopin', duree: '4:33' },
    ],
  },
  ville: {
    nom: 'Boulevard — pas sur le trottoir',
    intention: 'La ville à hauteur d’oreille, entre deux rendez-vous.',
    duree: '46 min',
    pistes: [
      { titre: 'Tadow', artiste: 'Masego & FKJ', duree: '5:01' },
      { titre: 'Lovely Day', artiste: 'Bill Withers', duree: '4:15' },
      { titre: 'Sunset Lover', artiste: 'Petit Biscuit', duree: '3:58' },
      { titre: 'Breezin’', artiste: 'George Benson', duree: '5:40' },
      { titre: 'Soulful Strut', artiste: 'Young-Holt Unlimited', duree: '2:59' },
      { titre: 'Ain’t No Sunshine', artiste: 'Bill Withers', duree: '2:05' },
      { titre: 'City of Stars', artiste: 'Ryan Gosling & Emma Stone', duree: '2:25' },
    ],
  },
  vague: {
    nom: 'Grand large — guitares amples',
    intention: 'Quand la pièce devient trop petite et qu’il faut de l’horizon.',
    duree: '58 min',
    pistes: [
      { titre: 'Your Hand in Mine', artiste: 'Explosions in the Sky', duree: '8:17' },
      { titre: 'The Mighty Rio Grande', artiste: 'This Will Destroy You', duree: '11:17' },
      { titre: 'Hoppípolla', artiste: 'Sigur Rós', duree: '4:28' },
      { titre: 'To Build a Home', artiste: 'The Cinematic Orchestra', duree: '6:11' },
      { titre: 'Avril 14th', artiste: 'Aphex Twin', duree: '2:05' },
      { titre: 'Ocean', artiste: 'John Butler Trio', duree: '12:08' },
      { titre: 'Comforting Sounds', artiste: 'Mew', duree: '8:51' },
    ],
  },
  papier: {
    nom: 'Papier de verre — bois et cordes',
    intention: 'Des guitares qui ont voyagé et des voix qui n’ont pas été lissées.',
    duree: '44 min',
    pistes: [
      { titre: 'Shape of My Heart', artiste: 'Sting', duree: '4:38' },
      { titre: 'Classical Gas', artiste: 'Mason Williams', duree: '3:38' },
      { titre: 'Cavatina', artiste: 'John Williams', duree: '3:45' },
      { titre: 'Blackbird', artiste: 'The Beatles', duree: '2:18' },
      { titre: 'Fast Car', artiste: 'Tracy Chapman', duree: '4:58' },
      { titre: 'Dust in the Wind', artiste: 'Kansas', duree: '3:26' },
      { titre: 'Hallelujah', artiste: 'Jeff Buckley', duree: '6:53' },
    ],
  },
  neon: {
    nom: 'Néon — la nuit avance',
    intention: 'Pour marcher vite, conduire tard, ou finir ce qui traîne.',
    duree: '54 min',
    pistes: [
      { titre: 'Midnight City', artiste: 'M83', duree: '4:03' },
      { titre: 'Nightcall', artiste: 'Kavinsky', duree: '4:18' },
      { titre: 'Strobe', artiste: 'deadmau5', duree: '10:37' },
      { titre: 'Opus', artiste: 'Eric Prydz', duree: '9:03' },
      { titre: 'Halcyon On and On', artiste: 'Orbital', duree: '9:27' },
      { titre: 'Digital Love', artiste: 'Daft Punk', duree: '4:58' },
      { titre: 'Blade Runner Blues', artiste: 'Vangelis', duree: '8:55' },
    ],
  },
  foyer: {
    nom: 'Foyer — une voix, un feu',
    intention: 'Pour les dimanches qui n’ont pas besoin de sortir.',
    duree: '42 min',
    pistes: [
      { titre: 'Come Away with Me', artiste: 'Norah Jones', duree: '3:18' },
      { titre: 'Banana Pancakes', artiste: 'Jack Johnson', duree: '3:12' },
      { titre: 'Better Together', artiste: 'Jack Johnson', duree: '3:27' },
      { titre: 'Sunday Morning', artiste: 'Maroon 5', duree: '4:04' },
      { titre: 'Dream a Little Dream of Me', artiste: 'Ella Fitzgerald', duree: '3:05' },
      { titre: 'La Vie en rose', artiste: 'Édith Piaf', duree: '3:07' },
      { titre: 'What a Wonderful World', artiste: 'Louis Armstrong', duree: '2:19' },
    ],
  },
};
