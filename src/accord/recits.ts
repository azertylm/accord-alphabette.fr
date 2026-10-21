import type { FamilleId } from './types';

/** Les récits courts du flux : vingt secondes de voix, pas une conférence. */
export const RECITS: Record<FamilleId, { titre: string; texte: string }[]> = {
  clairiere: [
    {
      titre: 'La lumière avant le bruit',
      texte:
        'À six heures, la forêt n’est pas silencieuse : elle est pleine de petits sons qui n’ont pas encore besoin d’être compris. Un merle, une branche, un ruisseau. Le jour ne commence pas par un réveil, il commence par un accord.',
    },
    {
      titre: 'Ce que les arbres retiennent',
      texte:
        'Un chêne garde dans son bois les années sèches et les années d’eau. On peut les lire dans ses cernes, comme une partition lente. Le vent, lui, ne laisse aucune trace : il passe, il plie, il repart.',
    },
  ],
  pluie: [
    {
      titre: 'La pluie n’a pas de rythme',
      texte:
        'On dit qu’il pleut régulièrement, mais aucune goutte ne tombe au même moment. C’est notre oreille qui fabrique la régularité, parce qu’elle préfère une nappe à une addition. Le hasard, bien écouté, devient une berceuse.',
    },
    {
      titre: 'Une pièce quand il pleut',
      texte:
        'La pluie change l’acoustique d’une maison. Les murs résonnent moins, les pas s’assourdissent, les voix se rapprochent. On baisse la musique sans y penser : le dehors vient de fournir le fond sonore.',
    },
  ],
  cuivre: [
    {
      titre: 'Le dernier set',
      texte:
        'À une heure du matin, un club de jazz ne compte plus les clients. Le pianiste joue pour le barman, le barman essuie un verre, et personne ne demande de rappel. C’est souvent là que la musique devient vraie : quand elle n’a plus personne à convaincre.',
    },
    {
      titre: 'Une note qui traîne',
      texte:
        'Une contrebasse ne s’arrête pas quand le doigt se lève. La corde continue, le bois répond, la salle garde un instant. Les bons musiciens jouent aussi ce qui reste après la note — et c’est peut-être cela, le swing.',
    },
  ],
  nuit: [
    {
      titre: 'Le fond du silence',
      texte:
        'Dans une chambre la nuit, on entend trois choses : le souffle, le sang, et parfois un avion très loin. Le silence n’est jamais vide ; il est simplement plus doux que le reste. Il suffit de ne pas le remplir.',
    },
    {
      titre: 'Une note tenue',
      texte:
        'Un drone ne raconte rien, et c’est pour cela qu’il repose. Il ne demande pas d’attention, il occupe l’espace. Au bout de quelques minutes, l’oreille cesse de le suivre et commence à écouter la pièce autour.',
    },
  ],
  ville: [
    {
      titre: 'La ville à hauteur d’épaule',
      texte:
        'Un trottoir n’est pas un couloir : c’est une conversation sans mots. Les pas ralentissent près d’une vitrine, accélèrent au feu, s’écartent d’une poussette. La ville se règle toute seule, par petites négociations.',
    },
    {
      titre: 'Le café de huit heures',
      texte:
        'Avant le travail, un café ressemble à une salle de répétition. Les tasses, la machine, les bribes de phrases : chacun répète sa journée avant de la jouer. À neuf heures, tout le monde sera parti, et le bruit changera de forme.',
    },
  ],
  vague: [
    {
      titre: 'Le temps d’une vague',
      texte:
        'Une vague ne commence pas à la plage. Elle est née d’une tempête, parfois à des milliers de kilomètres, et elle a voyagé sans se presser. Quand elle arrive, elle a déjà une histoire. Nous n’entendons que la fin.',
    },
    {
      titre: 'Le ressac',
      texte:
        'Après chaque vague, l’eau redescend en tirant les galets. Ce bruit-là est plus grave que le premier : c’est le retour. Une plage respire en deux temps, et notre oreille règle son souffle sur le sien sans qu’on le décide.',
    },
  ],
  papier: [
    {
      titre: 'Le grain du vinyle',
      texte:
        'Un disque n’est pas parfait, et c’est pour cela qu’on y revient. Le craquement dit qu’il y a un objet, un geste, une aiguille. Le numérique a gagné la mesure ; le vinyle a gardé la trace.',
    },
    {
      titre: 'Une guitare en bois',
      texte:
        'Une corde pincée met un instant à devenir un son. Le bois filtre, la caisse résonne, l’air de la pièce ajoute sa couleur. C’est pourquoi deux guitares identiques ne sonnent jamais tout à fait pareil : la pièce joue aussi.',
    },
  ],
  neon: [
    {
      titre: 'La nuit qui avance',
      texte:
        'Une basse régulière fait quelque chose de simple : elle donne une direction. On peut marcher dessus, conduire dessus, finir un travail dessus. Le néon n’explique pas la nuit, il la rend praticable.',
    },
    {
      titre: 'Un synthé qui brille',
      texte:
        'Un filtre qui s’ouvre, et la même note change de visage. C’est toute l’histoire de la musique électronique : pas plus de notes, mais plus de lumière dans les notes. Le mouvement naît d’un réglage, pas d’un accord.',
    },
  ],
  foyer: [
    {
      titre: 'Ce que le feu dit',
      texte:
        'Un feu de bois n’a pas de tempo. Il craque quand il veut, s’affaisse, repart. On ne l’écoute pas comme une musique : on l’écoute comme une présence. C’est peut-être la première radio de l’humanité.',
    },
    {
      titre: 'Fredonner',
      texte:
        'Fredonner, c’est chanter sans adresse. Pas de public, pas de justesse à défendre. La voix se pose sur ce qu’on fait, et la pièce devient un peu plus habitable. Personne n’a besoin d’entendre pour que cela compte.',
    },
  ],
};

/** Le flux commence par la famille de l'heure, comme une radio qui sait où elle est. */
export function familleDeLHeure(date = new Date()): FamilleId {
  const heure = date.getHours();
  if (heure < 7) return 'nuit';
  if (heure < 11) return 'clairiere';
  if (heure < 15) return 'ville';
  if (heure < 19) return 'vague';
  if (heure < 23) return 'cuivre';
  return 'neon';
}
