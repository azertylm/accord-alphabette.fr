import type { FamilleId, Lecon, Profil } from './types';

/**
 * La bibliothèque des cinq minutes.
 *
 * Chaque leçon tient en une page, se lit en trois à quatre minutes et se laisse
 * écouter en cinq. Elles sont rangées par familles sonores : ACCORD choisit
 * celle qui jouxte le goût déjà connu, jamais un programme ni un sommaire.
 */

export const LECONS: Lecon[] = [
  {
    id: 'cage-silence',
    titre: 'Le silence de John Cage',
    domaine: 'Musique',
    accroche: 'En 1952, un pianiste n’a joué aucune note pendant quatre minutes et trente-trois secondes.',
    paragraphes: [
      'La pièce s’appelle 4′33″. John Cage y monte sur scène, ouvre le couvercle du piano, consulte un chronomètre, puis referme le couvercle. Trois mouvements, aucun son volontaire. Le public, d’abord gêné, entend bientôt autre chose : la ventilation, une chaise, la pluie sur le toit, son propre souffle.',
      'Cage ne cherchait pas le vide. Il voulait prouver qu’il n’existe pas : dans une salle anéchoïque, il avait encore entendu deux sons, le système nerveux et la circulation du sang. Le silence absolu est un mythe d’ingénieur. Ce que nous appelons silence est toujours un fond sonore que nous avons cessé d’écouter.',
      'La leçon vaut pour nos oreilles saturées : baisser le volume n’est pas se priver de musique, c’est changer de partition. Le monde continue de jouer, avec ou sans nous.',
    ],
    points: [
      '4′33″ ne contient aucun son écrit, mais elle est faite de tous ceux de la salle.',
      'Le silence absolu n’existe pas : le corps lui-même fait du bruit.',
      'Écouter le fond, c’est déjà composer.',
    ],
    anecdote:
      'À la création, certains spectateurs sont partis furieux. Aujourd’hui, la pièce est l’une des plus jouées du répertoire contemporain — et souvent la plus silencieuse.',
    action: 'Coupe le son trente secondes et nomme trois choses que tu entends.',
    mots: ['silence', 'écoute', 'contemporain', 'expérience'],
    familles: ['nuit', 'pluie', 'papier'],
    source: 'local',
  },
  {
    id: 'vague-ocean',
    titre: 'La recette d’une vague',
    domaine: 'Océanographie',
    accroche: 'Une vague ne transporte pas d’eau : elle transporte de l’énergie.',
    paragraphes: [
      'Quand le vent souffle sur des centaines de kilomètres, il transfère son énergie à la surface. L’eau monte et descend presque sur place ; ce qui voyage, c’est le mouvement. Une bouée croise une houle sans être emportée vers le large.',
      'En approchant de la côte, la vague ralentit par le fond. Sa longueur d’onde diminue, sa hauteur augmente — l’énergie se concentre — puis elle déferle. La même houle peut traverser un océan et finir en embruns sur un rocher breton.',
      'Les océanographes parlent de « trains de houle » : des groupes de vagues régulières, parfois espacées de vingt secondes. C’est ce rythme lent que notre oreille reconnaît sur une plage, bien avant de voir la vague.',
    ],
    points: [
      'La vague déplace de l’énergie, pas de l’eau.',
      'Le fond marin transforme la houle en déferlante.',
      'Le rythme des trains de houle est une signature de l’océan.',
    ],
    anecdote:
      'Certaines houles traversent le Pacifique en une semaine. Un surfeur peut, en théorie, prendre la même vague que celle née d’une tempête à des milliers de kilomètres.',
    action: 'Compte dix vagues et note leur intervalle : ton ressenti change de rythme.',
    mots: ['vague', 'océan', 'rythme', 'nature'],
    familles: ['vague', 'clairiere', 'pluie'],
    source: 'local',
  },
  {
    id: 'gothique-lumiere',
    titre: 'Pourquoi une cathédrale tient debout',
    domaine: 'Architecture',
    accroche: 'Le gothique n’est pas une affaire de style : c’est une affaire de poussées.',
    paragraphes: [
      'Une voûte en pierre pousse vers l’extérieur et vers le bas. Les maçons romans répondaient par des murs épais. Les gothiques ont fait l’inverse : des murs minces, percés de vitraux, et des arcs-boutants qui viennent reprendre la poussée à l’extérieur.',
      'La croisée d’ogives répartit le poids sur quatre piliers au lieu de le laisser courir sur un mur entier. On peut alors monter très haut et ouvrir des fenêtres immenses. La lumière n’est pas un décor ajouté : elle est la conséquence structurelle d’un calcul de forces.',
      'Les bâtisseurs ne disposaient pas de la statique moderne. Ils travaillaient par essais, par transmission de chantier, parfois par effondrement. Chartres a brûlé, Beauvais s’est effondrée : le gothique est aussi une histoire de reprises.',
    ],
    points: [
      'L’arc-boutant reprend la poussée à l’extérieur du mur.',
      'La croisée d’ogives concentre les charges sur les piliers.',
      'Les vitraux sont rendus possibles par la structure, pas seulement par le goût.',
    ],
    anecdote:
      'La cathédrale de Beauvais détient le record de hauteur de voûte gothique — et s’est partiellement effondrée en 1284, douze ans après le chœur.',
    action: 'Dans une église près de chez toi, cherche les arcs-boutants avant de regarder les vitraux.',
    mots: ['architecture', 'pierre', 'lumière', 'structure'],
    familles: ['papier', 'cuivre', 'clairiere'],
    source: 'local',
  },
  {
    id: 'jazz-langage',
    titre: 'Ce que le jazz emprunte au langage',
    domaine: 'Musique',
    accroche: 'Un chorus se comprend comme une phrase : début, respiration, chute.',
    paragraphes: [
      'Dans le bebop, les musiciens improvisent sur des grilles d’accords, mais aussi sur des gestes de parole. Une phrase commence, se répète en variant, s’interrompt, reprend plus haut. Les « licks » sont des expressions toutes faites, comme des politesses, que l’on peut détourner.',
      'Le swing n’est pas seulement un décalage rythmique : c’est une façon de faire respirer le temps. Les croches ne tombent pas au milieu, elles penchent. Cette souplesse donne l’impression que le musicien parle plutôt qu’il ne récite.',
      'Les grands solistes savent se taire. Miles Davis pouvait laisser un silence de deux mesures au milieu d’un chorus : le public entendait la phrase suivante avant qu’elle arrive. Improviser, c’est aussi décider de ne pas remplir.',
    ],
    points: [
      'Un solo se construit comme une phrase parlée, avec respirations.',
      'Le swing est une flexion du temps, pas une simple syncope.',
      'Le silence fait partie de l’improvisation.',
    ],
    anecdote:
      'Le mot « jazz » vient probablement de l’argot américain, mais son origine exacte reste disputée. Le genre a d’abord été une danse avant d’être une musique savante.',
    action: 'Écoute un solo et compte les silences plutôt que les notes.',
    mots: ['jazz', 'improvisation', 'rythme', 'voix'],
    familles: ['cuivre', 'ville', 'foyer'],
    source: 'local',
  },
  {
    id: 'lumiere-photo',
    titre: 'L’architecture de la lumière',
    domaine: 'Photographie',
    accroche: 'Une photo n’est pas prise par l’appareil : elle est prise par la lumière.',
    paragraphes: [
      'À l’heure bleue, juste après le coucher du soleil, le ciel et les lampadaires ont presque la même intensité. Les visages se détachent sans ombres dures, les fenêtres s’allument. Ce n’est pas un hasard si les cinéastes tournent souvent à ce moment : la lumière y est déjà équilibrée.',
      'La lumière dure de midi, que l’on dit « mauvaise », révèle les matières et les reliefs. Les architectes l’utilisent pour lire une façade. La photographie de rue, elle, préfère souvent l’ombre des arcades, où le contraste devient un cadre.',
      'Chercher la lumière, c’est accepter d’attendre. Les grands photographes reviennent au même endroit à la même heure, parfois pendant des semaines, pour une différence de quelques minutes.',
    ],
    points: [
      'L’heure bleue équilibre ciel et lumières artificielles.',
      'La lumière dure sert à lire les matières et les volumes.',
      'La bonne lumière se prépare plus qu’elle ne se déclenche.',
    ],
    anecdote:
      'Le mot « photographie » signifie littéralement « écrire avec la lumière ». Le premier cliché permanent, en 1826, a demandé huit heures de pose.',
    action: 'Sors voir la même façade deux fois dans la journée et compare.',
    mots: ['lumière', 'photo', 'couleur', 'patience'],
    familles: ['clairiere', 'neon', 'vague'],
    source: 'local',
  },
  {
    id: 'ville-memoire',
    titre: 'Les villes se souviennent-elles ?',
    domaine: 'Urbanisme',
    accroche: 'Une rue garde la trace de ce qu’on y a fait, même quand les murs ont changé.',
    paragraphes: [
      'Les urbanistes parlent de « persistance du tracé » : un chemin de charrette devient une rue, puis un boulevard, puis une ligne de tram. Le plan survive aux bâtiments. À Paris, la rue Saint-Honoré suit un axe gallo-romain ; à Lyon, les pentes de la Croix-Rousse gardent le dessin des canuts.',
      'La mémoire d’une ville est aussi sonore. Les anciens quartiers de métiers avaient leurs bruits : marteaux, scies, voix. Les halles avaient une rumeur qu’aucun marché couvert moderne ne reproduit exactement. Le son est un patrimoine que l’on archive encore mal.',
      'Une ville qui se souvient n’est pas une ville figée. Elle choisit ce qu’elle garde : une façade, un nom, un usage. La mémoire urbaine est un tri, pas une conservation intégrale.',
    ],
    points: [
      'Le tracé des rues survit souvent aux bâtiments.',
      'Le patrimoine sonore d’un quartier est une mémoire à part entière.',
      'Conserver une ville, c’est choisir, pas tout garder.',
    ],
    anecdote:
      'Le mot « canut » désignait les ouvriers lyonnais de la soie. Leurs ateliers avaient des plafonds très hauts pour laisser passer les métiers à tisser — d’où les façades si particulières de la Croix-Rousse.',
    action: 'Dans ta rue, cherche un nom ou un tracé plus ancien que les immeubles.',
    mots: ['ville', 'mémoire', 'rue', 'patrimoine'],
    familles: ['ville', 'nuit', 'papier'],
    source: 'local',
  },
  {
    id: 'pain-temps',
    titre: 'Le goût du pain dépend du temps',
    domaine: 'Cuisine',
    accroche: 'Farine, eau, sel, levain : la quatrième chose est le temps.',
    paragraphes: [
      'Une pâte à pain n’est pas un mélange, c’est une fermentation. Les levures et les bactéries lactiques transforment les sucres, produisent du gaz et des acides. Plus la pâte fermente lentement, plus les arômes se complexent et plus la mie devient digeste.',
      'Le froid ralentit cette fermentation sans l’arrêter. Une pousse au réfrigérateur pendant douze à vingt-quatre heures donne un pain plus parfumé qu’une pousse rapide à température ambiante. C’est le principe de la baguette de tradition française, souvent fermentée la veille.',
      'La croûte, elle, est une réaction de Maillard : les sucres et les protéines brunissent à haute température. Un four très chaud et un coup de buée produisent une croûte fine et sonore. Le « chant » du pain qui sort du four est le bruit de cette croûte qui se rétracte.',
    ],
    points: [
      'La fermentation lente construit les arômes.',
      'Le froid ralentit la pousse sans la stopper.',
      'La croûte brune est une réaction de Maillard.',
    ],
    anecdote:
      'Le mot « levain » désigne à la fois la pâte fermentée et le mélange de farine et d’eau qui entretient les micro-organismes. Certains levains de boulangerie ont plus de cent ans.',
    action: 'Goûte deux pains du même boulanger et demande lequel a poussé le plus lentement.',
    mots: ['pain', 'cuisine', 'temps', 'fermentation'],
    familles: ['foyer', 'papier', 'ville'],
    source: 'local',
  },
  {
    id: 'oiseaux-ciel',
    titre: 'Comment les oiseaux lisent le ciel',
    domaine: 'Ornithologie',
    accroche: 'Un rouge-gorge peut sentir le champ magnétique terrestre.',
    paragraphes: [
      'Les oiseaux migrateurs s’orientent avec plusieurs boussoles : le soleil, les étoiles, les repères du paysage et le champ magnétique. La plus étrange est la boussole magnétique. Chez certaines espèces, une protéine de l’œil, la cryptochrome, réagit à la lumière et rend la direction magnétique visible — comme une nuance dans le ciel.',
      'Ils corrigent aussi leur cap avec l’odorat. Des expériences ont montré que des pigeons privés d’odeurs se perdent plus facilement. Le vent porte une carte chimique que nous ne percevons pas.',
      'Les oiseaux ne volent pas « au hasard » : ils suivent des couloirs de migration, souvent les côtes et les vallées. Savoir où ils passent permet de protéger les haltes, ces escales où ils reprennent des forces.',
    ],
    points: [
      'Les oiseaux combinent plusieurs boussoles : soleil, étoiles, paysage, magnétisme.',
      'La cryptochrome de l’œil joue un rôle dans la perception du champ magnétique.',
      'L’odorat aide aussi à s’orienter.',
    ],
    anecdote:
      'Le rouge-gorge qui chante dans ton jardin en hiver n’est pas forcément le même qu’en été : certains individus descendent du nord pour passer la saison froide.',
    action: 'Lève les yeux dix minutes à l’heure du passage et note la direction des vols.',
    mots: ['oiseaux', 'ciel', 'nature', 'orientation'],
    familles: ['clairiere', 'vague', 'nuit'],
    source: 'local',
  },
  {
    id: 'cuillere-design',
    titre: 'La cuillère est un chef-d’œuvre',
    domaine: 'Design',
    accroche: 'Un objet que personne ne remarque est souvent un objet très bien pensé.',
    paragraphes: [
      'Une cuillère doit tenir dans la main, porter sans renverser, entrer dans la bouche et se poser sans rouler. Ces contraintes expliquent sa forme : le creux, le manche, la courbure. Les couverts de cantine, si banals, résultent de décennies d’ajustements.',
      'Le designer Dieter Rams a formulé une règle simple : « Moins, mais mieux. » Ses objets Braun, devenus des références, ne cherchent pas à être vus. Ils cherchent à disparaître dans l’usage. Une bonne poignée ne demande pas d’explication.',
      'L’ergonomie se mesure parfois en millimètres. Une cuillère trop plate laisse échapper le liquide ; trop profonde, elle ne rentre pas en bouche. La différence entre un bon et un mauvais objet est souvent invisible sur une photo.',
    ],
    points: [
      'La forme d’un objet courant est une somme de contraintes résolues.',
      'Le bon design se remarque à son absence de gêne.',
      'L’ergonomie se joue dans des détails mesurables.',
    ],
    anecdote:
      'La cuillère à soupe standard contient environ 15 millilitres, la cuillère à café 5 millilitres. Les recettes anciennes utilisaient souvent des cuillères de tailles très variables.',
    action: 'Prends trois cuillères chez toi et dis laquelle est la mieux dessinée — et pourquoi.',
    mots: ['design', 'objet', 'main', 'usage'],
    familles: ['papier', 'foyer', 'ville'],
    source: 'local',
  },
  {
    id: 'mythes-nuit',
    titre: 'Les mythes grecs et nos nuits',
    domaine: 'Mythologie',
    accroche: 'Les Grecs n’expliquaient pas la nuit : ils la racontaient.',
    paragraphes: [
      'Pour eux, la nuit est une déesse, Nyx, fille du Chaos. Elle précède même Zeus : Homère la décrit comme une divinité que le roi des dieux respecte. La nuit n’est pas un décor, c’est une puissance première.',
      'Ses enfants disent nos peurs : Thanatos, la mort ; Hypnos, le sommeil ; les Oneiroi, les rêves ; Némésis, la vengeance. Chaque expérience nocturne a son nom et son visage. Le récit permet d’apprivoiser ce qui ne se voit pas.',
      'Les mythes ne sont pas des explications scientifiques déguisées. Ce sont des outils pour penser. Quand nous disons « tomber dans les bras de Morphée », nous utilisons encore un dieu grec pour parler d’un endormissement.',
    ],
    points: [
      'Nyx, la Nuit, est une divinité primitive et respectée.',
      'Les enfants de la Nuit nomment le sommeil, la mort et les rêves.',
      'Les mythes servent à rendre pensable ce qui échappe.',
    ],
    anecdote:
      'Morphée n’est pas un dieu grec à proprement parler : c’est un des Oneiroi, les rêves, fils d’Hypnos. Son nom a donné « morphine », pour sa capacité à façonner des formes.',
    action: 'Donne un nom à ta dernière nuit difficile, comme on nomme un personnage.',
    mots: ['mythe', 'nuit', 'rêve', 'récit'],
    familles: ['nuit', 'vague', 'foyer'],
    source: 'local',
  },
  {
    id: 'vinyle-craquement',
    titre: 'Pourquoi le vinyle craque (et pourquoi on aime ça)',
    domaine: 'Acoustique',
    accroche: 'Le craquement n’est pas un défaut du disque : c’est le bruit du monde qui entre.',
    paragraphes: [
      'Un sillon de vinyle est une gravure microscopique. L’aiguille la parcourt et transforme les aspérités en impulsions électriques. Poussières, rayures et électricité statique produisent des clics brefs, très larges en fréquence : c’est le craquement.',
      'Le CD a supprimé ces défauts. Pourtant, beaucoup d’auditeurs les regrettent. Les études de psychoacoustique suggèrent que ces bruits agissent comme des repères : ils rappellent l’objet, le geste, la pièce. Ils ajoutent une texture familière à un son par ailleurs très propre.',
      'Le vinyle n’est pas « meilleur » techniquement. Sa bande passante, sa dynamique et sa durée de vie sont inférieures au numérique. Mais l’écoute n’est pas qu’une mesure : c’est un rituel, avec sa manipulation, sa face A et sa face B.',
    ],
    points: [
      'Le craquement vient des aspérités lues par l’aiguille.',
      'Le cerveau associe ces bruits à l’objet et au geste.',
      'La supériorité du vinyle est culturelle, pas purement technique.',
    ],
    anecdote:
      'Le sillon d’un 33 tours mesure environ 0,05 millimètre de large. Une tête de lecture peut se déplacer de plusieurs kilomètres pendant une seule face.',
    action: 'Écoute un morceau en vinyle et compte les craquements des trente premières secondes.',
    mots: ['vinyle', 'grain', 'objet', 'écoute'],
    familles: ['papier', 'foyer', 'cuivre'],
    source: 'local',
  },
  {
    id: 'temps-plantes',
    titre: 'Le temps des plantes',
    domaine: 'Botanique',
    accroche: 'Une plante ne bouge pas, mais elle compte les jours.',
    paragraphes: [
      'Les plantes possèdent une horloge circadienne, comme nous. Elles anticipent l’aube, ouvrent leurs stomates, orientent leurs feuilles. Certaines fleurs s’ouvrent à heure fixe : Linné avait imaginé une « horloge florale » où chaque espèce indiquait une heure.',
      'Elles mesurent aussi le froid. Pour fleurir au bon moment, beaucoup d’espèces ont besoin d’une période de vernalisation : plusieurs semaines de basses températures. Un hiver doux peut décaler toute une floraison.',
      'Le changement climatique brouille ces horloges. Les cerisiers fleurissent plus tôt, parfois avant l’arrivée de leurs pollinisateurs. La plante ne se trompe pas : c’est le calendrier auquel elle s’est accordée qui change.',
    ],
    points: [
      'Les plantes ont une horloge circadienne et anticipent l’aube.',
      'La vernalisation — le froid hivernal — déclenche certaines floraisons.',
      'Le dérèglement climatique décale les calendriers écologiques.',
    ],
    anecdote:
      'Le bambou de certaines espèces fleurit tous les 60 à 120 ans, puis meurt. Toute une forêt peut fleurir en même temps, à l’échelle d’un continent.',
    action: 'Note la date de la première fleur de ton quartier et compare l’an prochain.',
    mots: ['plantes', 'temps', 'saison', 'nature'],
    familles: ['clairiere', 'vague', 'pluie'],
    source: 'local',
  },
  {
    id: 'typographie-sens',
    titre: 'La typographie change le sens',
    domaine: 'Graphisme',
    accroche: 'Le même mot, en deux polices, ne dit pas la même chose.',
    paragraphes: [
      'Une police à empattements suggère la continuité, le livre, l’institution. Une linéale évoque la modernité, l’écran, la neutralité. Ces associations ne sont pas naturelles : elles se sont construites par l’usage et l’histoire de l’imprimé.',
      'La lisibilité dépend aussi de la taille, de l’interligne et de la longueur de ligne. Un texte trop large fatigue l’œil, qui perd le début de la ligne suivante. Les typographes recommandent souvent 60 à 75 caractères par ligne en lecture longue.',
      'Les caractères ont une voix. Une police condensée crie ; une police très ouverte respire ; une italique penche la phrase vers l’intime. Choisir une police, c’est choisir un ton avant même d’avoir écrit un mot.',
    ],
    points: [
      'Les associations de polices viennent de l’histoire de l’imprimé.',
      'La longueur de ligne influence directement la lecture.',
      'La police porte un ton avant le contenu.',
    ],
    anecdote:
      'Le caractère Comic Sans a été créé en 1994 pour une bande dessinée pédagogique de Microsoft. Il est aujourd’hui l’un des plus décriés — et l’un des plus reconnaissables.',
    action: 'Prends un mot et écris-le dans trois polices : dis lequel ment le moins.',
    mots: ['typographie', 'lecture', 'forme', 'sens'],
    familles: ['papier', 'ville', 'neon'],
    source: 'local',
  },
  {
    id: 'pluie-atmosphere',
    titre: 'Ce que la pluie dit de l’atmosphère',
    domaine: 'Météorologie',
    accroche: 'L’odeur de la pluie a un nom : le pétrichor.',
    paragraphes: [
      'Avant l’averse, l’air se charge de molécules produites par les bactéries du sol et les plantes. Quand les premières gouttes frappent la terre sèche, elles projettent ces molécules dans l’air : c’est le pétrichor, cette odeur de terre mouillée que l’on reconnaît instantanément.',
      'La pluie naît dans les nuages par coalescence : de petites gouttes s’unissent jusqu’à devenir assez lourdes pour tomber. Dans un nuage d’orage, les courants ascendants peuvent suspendre des gouttes longtemps et fabriquer de la grêle par couches successives.',
      'Les gouttes ne tombent pas en forme de larme. Elles sont presque sphériques quand elles sont petites, puis s’aplatissent en crêpe en grossissant. La forme de larme est une convention de dessin, pas une réalité physique.',
    ],
    points: [
      'L’odeur de la pluie s’appelle le pétrichor.',
      'Les gouttes grossissent par coalescence dans le nuage.',
      'Une goutte de pluie n’a pas la forme d’une larme.',
    ],
    anecdote:
      'Le mot « pétrichor » vient du grec petra, la pierre, et ichor, le sang des dieux. Il a été inventé en 1964 par deux chercheurs australiens.',
    action: 'À la prochaine averse, sors respirer avant que l’odeur ne se disperse.',
    mots: ['pluie', 'odeur', 'ciel', 'atmosphère'],
    familles: ['pluie', 'clairiere', 'nuit'],
    source: 'local',
  },
  {
    id: 'cinema-muet',
    titre: 'Le cinéma avant le parlant',
    domaine: 'Cinéma',
    accroche: 'Les films muets n’étaient pas silencieux.',
    paragraphes: [
      'Dans les salles des années 1910-1920, un pianiste ou un orchestre accompagnait chaque projection. Le son était joué en direct, adapté à la salle et au public. Certaines partitions étaient envoyées avec le film, d’autres improvisées.',
      'Le passage au parlant, à la fin des années 1920, a bouleversé les corps : les acteurs devaient parler dans un micro caché, les caméras devenaient bruyantes, les décors étaient enfermés dans des cabines. Le jeu s’est figé avant de se réinventer.',
      'Le muet n’est donc pas une époque sans son, mais une époque où le son n’était pas enregistré avec l’image. Le cinéma a d’abord été une projection accompagnée, comme un concert.',
    ],
    points: [
      'Les projections muettes étaient accompagnées en direct.',
      'Le parlant a d’abord contraint la mise en scène.',
      'Le muet est une technique, pas une absence de son.',
    ],
    anecdote:
      'Le Chanteur de jazz (1927) est souvent cité comme le premier parlant, mais il ne contient que quelques scènes dialoguées. Le premier film entièrement parlant est Lights of New York, en 1928.',
    action: 'Regarde cinq minutes d’un film muet sans musique et imagine l’accompagnement.',
    mots: ['cinéma', 'muet', 'musique', 'image'],
    familles: ['nuit', 'neon', 'cuivre'],
    source: 'local',
  },
];

/** Les leçons sont choisies près du goût déjà connu, jamais au hasard pur. */
function scoreLecon(lecon: Lecon, profil: Profil | null): number {
  if (!profil) return 0;
  let score = 0;
  if (lecon.familles.includes(profil.famille)) score += 5;
  const mots = profil.mots.map((mot) => mot.toLowerCase());
  for (const mot of lecon.mots) {
    if (mots.some((m) => m.includes(mot) || mot.includes(m))) score += 2;
  }
  return score;
}

function jourDepuisEpoque(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000);
}

export function choisirLecon(profil: Profil | null, date = new Date()): Lecon {
  const classement = [...LECONS].sort((a, b) => scoreLecon(b, profil) - scoreLecon(a, profil));
  const vivier = classement.slice(0, Math.max(3, Math.min(6, classement.length)));
  const index = jourDepuisEpoque(date) % vivier.length;
  return vivier[index];
}

/** Une leçon écrite sur mesure par Mistral, si l'utilisateur a fourni sa clé. */
export function leconEnRef(lecon: Lecon, date = new Date()): { id: string; titre: string; domaine: string; date: string } {
  return {
    id: lecon.id,
    titre: lecon.titre,
    domaine: lecon.domaine,
    date: date.toISOString().slice(0, 10),
  };
}

export const FAMILLES_LECON = (famille: FamilleId) =>
  LECONS.filter((lecon) => lecon.familles.includes(famille)).length;
