import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { jouerFamille, obtenirAnalyseur, reveillerAudio, type Lecture } from '../audio';
import { FAMILLES, ORDRE_FAMILLES } from '../familles';
import { familleDeLHeure, RECITS } from '../recits';
import type { Axe, Axes, FamilleId, ModuleId, Profil, Signal } from '../types';
import { Bouton, Note, Ondes, SceauFamille } from '../ui';

const AXES: Axe[] = ['chaleur', 'mouvement', 'nature', 'densite', 'lumiere'];
const FIN = 8;
const MINIMUM_POUR_SAUVER = 12;

interface Courant {
  numero: number;
  famille: FamilleId;
  recit: { titre: string; texte: string } | null;
  duree: number;
}

interface Ecoute {
  famille: FamilleId;
  secondes: number;
}

function poidsInitial(profil: Profil | null): Record<FamilleId, number> {
  return ORDRE_FAMILLES.reduce(
    (acc, id) => {
      let poids = 1;
      if (profil) {
        if (profil.famille === id) poids += 4;
        const distance =
          AXES.reduce((somme, axe) => somme + Math.abs(FAMILLES[id].axes[axe] - profil.axes[axe]), 0) /
          (AXES.length * 100);
        poids += Math.max(0, 1 - distance) * 2.2;
      }
      acc[id] = poids;
      return acc;
    },
    {} as Record<FamilleId, number>,
  );
}

function choisirFamille(poids: Record<FamilleId, number>, actuelle: FamilleId): FamilleId {
  const candidats = ORDRE_FAMILLES.filter((id) => id !== actuelle);
  const total = candidats.reduce((somme, id) => somme + Math.max(0.15, poids[id]), 0);
  let tirage = Math.random() * total;
  for (const id of candidats) {
    tirage -= Math.max(0.15, poids[id]);
    if (tirage <= 0) return id;
  }
  return candidats[0] ?? actuelle;
}

function creerCourant(famille: FamilleId, numero: number): Courant {
  const recit = numero % 3 === 0 ? null : RECITS[famille][numero % RECITS[famille].length];
  return {
    numero,
    famille,
    recit,
    duree: recit ? 24 : 28,
  };
}

export function Radio({
  profil,
  onProfil,
  onRetour,
  onVoirProfil,
}: {
  profil: Profil | null;
  onProfil: (signal: Signal, module: ModuleId) => void;
  onRetour: () => void;
  onVoirProfil: () => void;
}) {
  const depart = useMemo<FamilleId>(() => profil?.famille ?? familleDeLHeure(), [profil?.famille]);
  const [courant, setCourant] = useState<Courant>(() => creerCourant(depart, 0));
  const [progress, setProgress] = useState(0);
  const [fini, setFini] = useState(false);
  const [bars, setBars] = useState<number[]>(() => new Array(36).fill(0.08));
  const [secondes, setSecondes] = useState(0);
  const [passes, setPasses] = useState(0);
  const [journal, setJournal] = useState<Ecoute[]>([]);
  const [silence, setSilence] = useState(false);

  const poids = useRef<Record<FamilleId, number>>(poidsInitial(profil));
  const journalRef = useRef<Ecoute[]>([]);
  const lecture = useRef<Lecture | null>(null);
  const debut = useRef(0);
  const traite = useRef(-1);
  const sauve = useRef(false);
  const courantRef = useRef(courant);
  const finiRef = useRef(fini);
  const departX = useRef<number | null>(null);
  const profilRef = useRef(profil);
  const onProfilRef = useRef(onProfil);
  const passesRef = useRef(passes);

  profilRef.current = profil;
  onProfilRef.current = onProfil;
  passesRef.current = passes;

  useEffect(() => {
    courantRef.current = courant;
  }, [courant]);

  useEffect(() => {
    finiRef.current = fini;
  }, [fini]);

  const sauverProfil = useCallback(() => {
    if (sauve.current) return;
    const ecoutes = journalRef.current;
    const total = ecoutes.reduce((somme, entree) => somme + entree.secondes, 0);
    if (total < MINIMUM_POUR_SAUVER) return;
    sauve.current = true;

    const parFamille = ORDRE_FAMILLES.reduce(
      (acc, id) => {
        acc[id] = 0;
        return acc;
      },
      {} as Record<FamilleId, number>,
    );
    for (const entree of ecoutes) parFamille[entree.famille] += entree.secondes;

    const famille = ORDRE_FAMILLES.reduce(
      (meilleure, id) => (parFamille[id] > parFamille[meilleure] ? id : meilleure),
      ORDRE_FAMILLES[0],
    );

    const axes = AXES.reduce(
      (acc, axe) => {
        acc[axe] = Math.round(
          ORDRE_FAMILLES.reduce((somme, id) => somme + FAMILLES[id].axes[axe] * parFamille[id], 0) / total,
        );
        return acc;
      },
      {} as Axes,
    );

    const base = profilRef.current?.confiance ?? 42;
    onProfilRef.current(
      {
        famille,
        axes,
        mots: ['radio', ...FAMILLES[famille].mots.slice(0, 3)],
        confiance: Math.min(94, base + Math.min(12, Math.round(total / 30))),
        source: 'local',
        radio: { famille, minutes: Math.round((total / 60) * 10) / 10, passes: passesRef.current },
      },
      'radio',
    );
  }, []);

  const terminer = useCallback(
    (zappe: boolean) => {
      const actuel = courantRef.current;
      if (traite.current === actuel.numero) return;
      traite.current = actuel.numero;
      const temps = Math.min(actuel.duree, Math.max(0, (performance.now() - debut.current) / 1000));

      const entree: Ecoute = { famille: actuel.famille, secondes: temps };
      journalRef.current = [...journalRef.current, entree];
      setJournal(journalRef.current);

      if (zappe) {
        poids.current[actuel.famille] = Math.max(0.15, poids.current[actuel.famille] * 0.42);
        setPasses((valeur) => valeur + 1);
      } else {
        poids.current[actuel.famille] += 1.4;
      }

      setSecondes((valeur) => valeur + temps);
      setProgress(zappe ? 0 : 1);

      if (actuel.numero + 1 >= FIN) {
        lecture.current?.stop();
        lecture.current = null;
        setFini(true);
        return;
      }

      const suivante = choisirFamille(poids.current, actuel.famille);
      const prochain = creerCourant(suivante, actuel.numero + 1);
      courantRef.current = prochain;
      debut.current = performance.now();
      setCourant(prochain);
    },
    [],
  );

  const terminerRef = useRef(terminer);
  terminerRef.current = terminer;

  useEffect(() => {
    if (fini) return;
    let annule = false;
    traite.current = -1;
    debut.current = performance.now();
    setProgress(0);

    try {
      reveillerAudio();
      lecture.current = jouerFamille(courant.famille, courant.duree, () => {
        if (!annule) terminerRef.current(false);
      });
      setSilence(false);
    } catch {
      setSilence(true);
    }

    const minuteur = window.setInterval(() => {
      const ecoule = (performance.now() - debut.current) / 1000;
      setProgress(Math.min(1, ecoule / courant.duree));
      const noeud = obtenirAnalyseur();
      if (noeud) {
        const donnees = new Uint8Array(noeud.fftSize);
        noeud.getByteTimeDomainData(donnees);
        let somme = 0;
        for (let i = 0; i < donnees.length; i += 1) {
          const valeur = (donnees[i] - 128) / 128;
          somme += valeur * valeur;
        }
        const rms = Math.sqrt(somme / donnees.length);
        setBars((precedentes) => [...precedentes.slice(1), Math.max(0.05, Math.min(1, rms * 9))]);
      }
    }, 100);

    return () => {
      annule = true;
      window.clearInterval(minuteur);
      lecture.current?.stop();
      lecture.current = null;
    };
  }, [courant, fini]);

  useEffect(
    () => () => {
      lecture.current?.stop();
      sauverProfil();
    },
    [],
  );

  const zapper = () => {
    if (fini) return;
    lecture.current?.stop();
    lecture.current = null;
    terminer(true);
  };

  const famille = FAMILLES[courant.famille];
  const total = journal.reduce((somme, entree) => somme + entree.secondes, 0);
  const parFamille = journal.reduce(
    (acc, entree) => {
      acc[entree.famille] = (acc[entree.famille] ?? 0) + entree.secondes;
      return acc;
    },
    {} as Partial<Record<FamilleId, number>>,
  );
  const dominante = ORDRE_FAMILLES.reduce(
    (meilleure, id) => ((parFamille[id] ?? 0) > (parFamille[meilleure] ?? 0) ? id : meilleure),
    depart,
  );
  const part = total > 0 ? Math.round(((parFamille[dominante] ?? 0) / total) * 100) : 0;

  const garder = () => {
    sauve.current = false;
    sauverProfil();
    onVoirProfil();
  };

  const reprendre = () => {
    sauve.current = false;
    setFini(false);
    const prochain = creerCourant(dominante, courant.numero + 1);
    courantRef.current = prochain;
    debut.current = performance.now();
    setCourant(prochain);
  };

  if (fini) {
    return (
      <div className="ac-page">
        <header className="ac-entete ac-entete--serre">
          <button type="button" className="ac-retour" onClick={onRetour}>
            ← Retour
          </button>
          <p className="ac-eyebrow">Module 04 · radio · fin de session</p>
          <h1 className="ac-titre">
            Le flux a trouvé <em>son axe.</em>
          </h1>
        </header>

        <div className="ac-radio-bilan">
          <SceauFamille famille={dominante} taille={96} />
          <div>
            <p className="ac-eyebrow">Ta famille dominante sur cette écoute</p>
            <h2 className="ac-resultat__nom">{FAMILLES[dominante].nom}</h2>
            <p className="ac-intro">{FAMILLES[dominante].sousTitre}</p>
            <div className="ac-radio-bilan__chiffres">
              <span>
                <b>{Math.max(1, Math.round(total / 60))}</b> min écoutées
              </span>
              <span>
                <b>{passes}</b> zaps
              </span>
              <span>
                <b>{part} %</b> sur ta famille
              </span>
            </div>
          </div>
        </div>

        <Note>
          La radio n’a pas de bouton : elle n’a retenu que les moments que tu n’as pas zappés. Ton
          profil d’écoute est déjà mis à jour — {FAMILLES[dominante].nom} devient la famille de
          départ des prochains modules.
        </Note>

        <div className="ac-actions">
          <Bouton variante="grand" onClick={garder}>
            Garder ce flux
          </Bouton>
          <Bouton variante="fantome" onClick={reprendre}>
            Continuer d’écouter
          </Bouton>
        </div>

        <p className="ac-mini-note">
          Le flux est synthétisé dans ton navigateur : aucune musique n’est téléchargée ni envoyée.
          Les titres réels apparaissent dans la playlist du test des 9 sons.
        </p>
      </div>
    );
  }

  return (
    <div className="ac-page ac-page--radio">
      <header className="ac-radio-entete">
        <button type="button" className="ac-retour" onClick={onRetour}>
          ← Retour
        </button>
        <p className="ac-eyebrow">Module 04 · radio de mes goûts · flux continu</p>
        <div className="ac-radio-entete__etat">
          <span className="ac-radio-pastille" aria-hidden="true" />
          <span>
            {courant.numero + 1} / {FIN} · {part > 0 ? `le flux se resserre · ${part} %` : 'le flux cherche'}
          </span>
        </div>
      </header>

      <div
        className="ac-radio-scene"
        tabIndex={0}
        role="application"
        aria-label="Radio continue. Glisse vers la gauche pour zapper."
        onPointerDown={(evenement) => {
          reveillerAudio();
          departX.current = evenement.clientX;
        }}
        onPointerUp={(evenement) => {
          if (departX.current !== null && departX.current - evenement.clientX > 60) zapper();
          departX.current = null;
        }}
        onPointerCancel={() => {
          departX.current = null;
        }}
        onKeyDown={(evenement) => {
          if (evenement.key === 'ArrowLeft' || evenement.key === 'ArrowRight' || evenement.key === ' ') {
            evenement.preventDefault();
            zapper();
          }
        }}
      >
        <div className="ac-radio-fond" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="ac-radio-scene__tete">
          <SceauFamille famille={courant.famille} taille={54} />
          <div>
            <p className="ac-eyebrow">{courant.recit ? 'Récit' : 'Mouvement'}</p>
            <h1 className="ac-radio-scene__famille">{famille.nom}</h1>
          </div>
          <span className="ac-radio-scene__duree">{courant.duree} s</span>
        </div>

        <div className="ac-radio-scene__centre">
          <Ondes valeurs={bars} hauteur={120} barres={36} />
          <h2 className="ac-radio-scene__titre">
            {courant.recit ? courant.recit.titre : 'Sans titre, et c’est voulu'}
          </h2>
          <p className="ac-radio-scene__texte">
            {courant.recit
              ? courant.recit.texte
              : 'Un lit sonore, sans mélodie à retenir. Reste ou passe : c’est la seule chose qu’ACCORD te demande.'}
          </p>
        </div>

        <div className="ac-radio-scene__pied">
          <div className="ac-radio-progression" aria-hidden="true">
            <span style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="ac-radio-scene__aide">
            <span>Glisse vers la gauche pour zapper · sinon, laisse.</span>
            <span>{secondes > 0 ? `${Math.round(secondes)} s d’écoute` : 'le flux commence'}</span>
          </div>
        </div>

        {silence && (
          <div className="ac-radio-silence">
            <p>
              Le son n’a pas démarré. Touche la scène pour l’autoriser — le navigateur demande un
              geste avant de jouer.
            </p>
          </div>
        )}
      </div>

      <p className="ac-mini-note ac-mini-note--centre">
        Aucun bouton de lecture : la radio observe ce que tu n’as pas zappé. Les récits s’affichent,
        les mouvements se jouent. Chaque passage nourrit le même profil d’écoute.
      </p>
    </div>
  );
}
