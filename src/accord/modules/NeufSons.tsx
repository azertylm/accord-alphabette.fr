import { useCallback, useEffect, useRef, useState } from 'react';
import { obtenirAnalyseur, jouerSon, reveillerAudio, type Lecture } from '../audio';
import { FAMILLES, PLAYLISTS } from '../familles';
import { enrichirTest, lireCle } from '../ia';
import { analyserSons, type Reaction, type ResultatSons } from '../profil';
import { SONS } from '../sons';
import type { ModuleId, Signal } from '../types';
import { Bouton, EnteteModule, Jauges, Note, Ondes, ReglageCle, SceauFamille } from '../ui';

type Etape = 'intro' | 'ecoute' | 'analyse' | 'resultat';

const DUREE = 5;

function lienPiste(titre: string, artiste: string) {
  return `https://www.deezer.com/search/${encodeURIComponent(`${titre} ${artiste}`)}`;
}

function lienPlaylist(nom: string) {
  return `https://www.deezer.com/search/${encodeURIComponent(nom.split(' — ')[0])}`;
}

export function NeufSons({
  onProfil,
  onRetour,
  onVoirProfil,
  onModule,
}: {
  onProfil: (signal: Signal, module: ModuleId) => void;
  onRetour: () => void;
  onVoirProfil: () => void;
  onModule: (id: ModuleId) => void;
}) {
  const [etape, setEtape] = useState<Etape>('intro');
  const [index, setIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});
  const [resultat, setResultat] = useState<ResultatSons | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [mots, setMots] = useState<string[] | null>(null);
  const [source, setSource] = useState<'local' | 'mistral'>('local');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bars, setBars] = useState<number[]>(() => new Array(40).fill(0.08));
  const [erreur, setErreur] = useState<string | null>(null);

  const lecture = useRef<Lecture | null>(null);
  const asyncEnrichissement = useRef(0);

  const son = SONS[index];
  const reaction = reactions[son?.id ?? ''];

  const arreter = useCallback(() => {
    lecture.current?.stop();
    lecture.current = null;
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (etape !== 'ecoute') return;
    const courant = SONS[index];
    if (!courant) return;

    let annule = false;
    setProgress(0);
    setBars(new Array(40).fill(0.08));
    setErreur(null);

    // Un court instant de respiration entre deux extraits, puis le son.
    const minuteur = window.setTimeout(() => {
      if (annule) return;
      try {
        reveillerAudio();
        lecture.current = jouerSon(courant.id, DUREE, () => {
          if (annule) return;
          setPlaying(false);
          setProgress(1);
        });
        setPlaying(true);
      } catch {
        if (!annule) {
          setErreur('Le son n’a pas pu démarrer. Tu peux tout de même dire si cet univers te plaît.');
          setPlaying(false);
        }
      }
    }, 320);

    return () => {
      annule = true;
      window.clearTimeout(minuteur);
      lecture.current?.stop();
      lecture.current = null;
      setPlaying(false);
    };
  }, [etape, index]);

  useEffect(() => {
    if (!playing) return;
    const debut = performance.now();
    const minuteur = window.setInterval(() => {
      const ecoule = (performance.now() - debut) / 1000;
      setProgress(Math.min(1, ecoule / DUREE));
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
    }, 80);
    return () => window.clearInterval(minuteur);
  }, [playing]);

  useEffect(
    () => () => {
      lecture.current?.stop();
    },
    [],
  );

  const commencer = () => {
    reveillerAudio();
    setIndex(0);
    setReactions({});
    setResultat(null);
    setPhrase(null);
    setMots(null);
    setSource('local');
    setEtape('ecoute');
  };

  const analyser = useCallback(
    async (finales: Record<string, Reaction>) => {
      const calcul = analyserSons(finales);
      setResultat(calcul);
      setEtape('analyse');
      onProfil(
        {
          famille: calcul.famille,
          axes: calcul.axes,
          mots: calcul.mots,
          confiance: calcul.confiance,
          source: 'local',
        },
        'sons',
      );

      const jeton = asyncEnrichissement.current + 1;
      asyncEnrichissement.current = jeton;
      const texteLocal = FAMILLES[calcul.famille].phrase;
      setPhrase(texteLocal);

      // L'écran de résultat ne dépend jamais de Mistral : il arrive tout de
      // suite avec la lecture locale, puis s'affine si la clé répond.
      window.setTimeout(() => {
        if (asyncEnrichissement.current === jeton) setEtape('resultat');
      }, 1500);

      if (lireCle()) {
        enrichirTest(calcul)
          .then((enrichissement) => {
            if (asyncEnrichissement.current !== jeton) return;
            if (enrichissement.phrase) setPhrase(enrichissement.phrase);
            if (enrichissement.mots?.length) setMots(enrichissement.mots);
            setSource('mistral');
          })
          .catch(() => {
            if (asyncEnrichissement.current === jeton) setPhrase(texteLocal);
          });
      }
    },
    [onProfil],
  );

  const repondre = (valeur: Reaction) => {
    const suivantes = { ...reactions, [son.id]: valeur };
    setReactions(suivantes);
    arreter();

    if (index < SONS.length - 1) {
      setIndex(index + 1);
    } else {
      void analyser(suivantes);
    }
  };

  const rejouer = () => {
    if (!son) return;
    arreter();
    reveillerAudio();
    setProgress(0);
    try {
      lecture.current = jouerSon(son.id, DUREE, () => {
        setPlaying(false);
        setProgress(1);
      });
      setPlaying(true);
    } catch {
      setErreur('Le son n’a pas pu démarrer.');
    }
  };

  const recommencer = () => {
    arreter();
    setEtape('intro');
    setIndex(0);
    setReactions({});
    setResultat(null);
    setPhrase(null);
    setMots(null);
    setSource('local');
    setProgress(0);
  };

  /* ------------------------------------------------------------------ intro */
  if (etape === 'intro') {
    return (
      <div className="ac-page">
        <EnteteModule
          id="sons"
          onRetour={onRetour}
          intro={
            <p className="ac-intro">
              Neuf extraits de cinq secondes, synthétisés dans ton navigateur. Aucun titre à
              reconnaître, aucun genre à choisir : tu dis simplement si ton oreille s’y sent bien.
              ACCORD en déduit ta famille sonore et construit la playlist qui va avec.
            </p>
          }
        />

        <div className="ac-test-intro">
          <div className="ac-test-intro__visuel" aria-hidden="true">
            <div className="ac-test-intro__ondes">
              {Array.from({ length: 28 }, (_, index) => (
                <i key={index} style={{ height: `${16 + ((index * 41) % 84)}%` }} />
              ))}
            </div>
            <span className="ac-test-intro__mention">9 extraits · 5 s · 2 min</span>
          </div>

          <div className="ac-test-intro__texte">
            <p className="ac-eyebrow">Comment ça se passe</p>
            <h2 className="ac-sous-titre">Un extrait. Un ressenti. On passe au suivant.</h2>
            <ol className="ac-liste-etapes">
              <li>
                <span>01</span> Le son démarre tout seul. Écoute sans chercher à reconnaître.
              </li>
              <li>
                <span>02</span> Deux gestes : « ça me fait du bien » ou « pas cette fois ».
              </li>
              <li>
                <span>03</span> Au neuvième, ta famille sonore et ta playlist apparaissent.
              </li>
            </ol>
            <Bouton variante="grand" onClick={commencer}>
              Lancer les neuf extraits
            </Bouton>
            <p className="ac-mini-note">
              Le son sort de ton appareil, pas d’Internet. Rien n’est enregistré.
            </p>
          </div>
        </div>

        <div className="ac-grille-9" aria-label="Les neuf extraits">
          {SONS.map((extrait) => (
            <div key={extrait.id} className={`ac-carte-9 ac-carte-9--${extrait.famille}`}>
              <span className="ac-carte-9__num">{extrait.numero}</span>
              <b>{extrait.nom}</b>
              <span>{extrait.texture}</span>
            </div>
          ))}
        </div>

        <ReglageCle />
      </div>
    );
  }

  /* ----------------------------------------------------------------- ecoute */
  if (etape === 'ecoute' && son) {
    return (
      <div className="ac-page ac-page--serre">
        <EnteteModule id="sons" onRetour={onRetour} />

        <div className="ac-fil-progression">
          <span>
            Extrait <b>{index + 1}</b> / 9
          </span>
          <span className="ac-fil-progression__barre" aria-hidden="true">
            <span style={{ width: `${((index + (reaction ? 1 : progress)) / 9) * 100}%` }} />
          </span>
          <span>{SONS.filter((entree) => reactions[entree.id]).length} réponses</span>
        </div>

        <div className="ac-scene-son">
          <div className="ac-scene-son__texte">
            <p className="ac-eyebrow">
              {son.numero} · {son.ecoute}
            </p>
            <h1 className="ac-scene-son__nom">{son.nom}</h1>
            <p className="ac-scene-son__texture">{son.texture}</p>
          </div>

          <button
            type="button"
            className={`ac-pastille-son${playing ? ' ac-pastille-son--joue' : ''}`}
            onClick={rejouer}
            aria-label={playing ? 'Relancer l’extrait' : 'Réécouter l’extrait'}
          >
            <span className="ac-pastille-son__halo" />
            <span className="ac-pastille-son__halo ac-pastille-son__halo--2" />
            <span className="ac-pastille-son__centre">
              <Ondes valeurs={bars} actif={playing} hauteur={72} barres={20} />
            </span>
            <span className="ac-pastille-son__temps">
              {playing ? `${Math.max(0, DUREE - progress * DUREE).toFixed(1)} s` : 'réécouter'}
            </span>
          </button>

          <div className="ac-scene-son__compte" aria-hidden="true">
            <span style={{ width: `${progress * 100}%` }} />
          </div>

          {erreur && <p className="ac-erreur">{erreur}</p>}

          <div className="ac-ressenti">
            <Bouton
              variante="grand"
              onClick={() => repondre('aime')}
              aria-label="Ça me fait du bien"
            >
              ♥ Ça me fait du bien
            </Bouton>
            <Bouton variante="fantome" onClick={() => repondre('pas')}>
              Pas cette fois
            </Bouton>
          </div>

          <button type="button" className="ac-lien-discret" onClick={() => repondre('neutre')}>
            Passer cet extrait
          </button>

          <p className="ac-mini-note ac-mini-note--centre">
            {playing
              ? 'Écoute encore quelques secondes, ou réponds tout de suite — c’est ton ressenti qui compte.'
              : 'Le son est terminé. Tu peux le réécouter ou passer au suivant.'}
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- analyse */
  if (etape === 'analyse') {
    return (
      <div className="ac-page">
        <div className="ac-analyse">
          <p className="ac-eyebrow">Lecture de tes neuf réactions</p>
          <h1 className="ac-titre">Je cherche l’accord.</h1>
          <div className="ac-analyse__rond" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <ul className="ac-analyse__lignes">
            <li>Les extraits que tu as gardés</li>
            <li>Ceux que tu as écartés, sans jugement</li>
            <li>Ta famille sonore et la playlist qui l’accompagne</li>
          </ul>
          <p className="ac-mini-note">
            {lireCle() ? 'Le moteur local calcule, Mistral affine la phrase.' : 'Tout se passe dans ton navigateur.'}
          </p>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- resultat */
  if (etape === 'resultat' && resultat) {
    const famille = FAMILLES[resultat.famille];
    const playlist = PLAYLISTS[resultat.famille];
    const affiches = mots ?? resultat.mots;

    return (
      <div className="ac-page">
        <header className="ac-entete ac-entete--serre">
          <button type="button" className="ac-retour" onClick={recommencer}>
            ← Refaire le test
          </button>
          <p className="ac-eyebrow">
            Ta famille sonore · {source === 'mistral' ? 'Mistral, France' : 'moteur local'} ·{' '}
            {resultat.confiance} % de confiance
          </p>
          <h1 className="ac-titre">
            Tu écoutes comme <em>{famille.nom.toLowerCase()}.</em>
          </h1>
          <p className="ac-intro">{phrase ?? famille.phrase}</p>
        </header>

        <div className="ac-resultat">
          <div className="ac-resultat__carte">
            <SceauFamille famille={resultat.famille} taille={104} />
            <div>
              <p className="ac-eyebrow">{famille.sousTitre}</p>
              <h2 className="ac-resultat__nom">{famille.nom}</h2>
              <p className="ac-resultat__geste">{famille.geste}</p>
              <div className="ac-mots">
                {affiches.map((mot) => (
                  <span key={mot} className="ac-mot ac-mot--accent">
                    {mot}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="ac-resultat__jauges">
            <p className="ac-bloc__titre">Les cinq axes de ton oreille</p>
            <Jauges profil={{ ...resultat, modules: {}, source, maj: '' }} />
          </div>
        </div>

        <section className="ac-playlist">
          <div className="ac-playlist__tete">
            <div>
              <p className="ac-eyebrow">Ta playlist · prête à jouer</p>
              <h2 className="ac-sous-titre">{playlist.nom}</h2>
              <p className="ac-intro">{playlist.intention}</p>
            </div>
            <span className="ac-playlist__duree">{playlist.duree}</span>
          </div>

          <ol className="ac-pistes">
            {playlist.pistes.map((piste, numero) => (
              <li key={`${piste.titre}-${piste.artiste}`}>
                <span className="ac-pistes__num">{String(numero + 1).padStart(2, '0')}</span>
                <span className="ac-pistes__texte">
                  <a
                    className="ac-pistes__titre"
                    href={lienPiste(piste.titre, piste.artiste)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {piste.titre}
                  </a>
                  <span className="ac-pistes__artiste">{piste.artiste}</span>
                </span>
                <span className="ac-pistes__duree">{piste.duree}</span>
              </li>
            ))}
          </ol>

          <div className="ac-actions">
            <Bouton variante="grand" onClick={() => onModule('radio')}>
              Écouter le flux de ma famille
            </Bouton>
            <a
              className="ac-bouton ac-bouton--fantome"
              href={lienPlaylist(playlist.nom)}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir dans Deezer ↗
            </a>
            <Bouton variante="lien" onClick={onVoirProfil}>
              Voir mon profil complet
            </Bouton>
          </div>
          <p className="ac-mini-note">
            Les liens ouvrent une recherche Deezer : la disponibilité dépend du pays et du catalogue.
            ACCORD ne fabrique jamais de faux titres.
          </p>
        </section>

        <section className="ac-section ac-gardes">
          <div>
            <p className="ac-bloc__titre">Ce que tu as gardé</p>
            <div className="ac-mots">
              {resultat.aimes.length ? (
                resultat.aimes.map((nom) => (
                  <span key={nom} className="ac-mot">
                    {nom}
                  </span>
                ))
              ) : (
                <span className="ac-mini-note">Aucun extrait gardé — la famille a été lue à l’inverse.</span>
              )}
            </div>
          </div>
          <div>
            <p className="ac-bloc__titre">Ce que tu as écarté</p>
            <div className="ac-mots">
              {resultat.ecartes.length ? (
                resultat.ecartes.map((nom) => (
                  <span key={nom} className="ac-mot ac-mot--pale">
                    {nom}
                  </span>
                ))
              ) : (
                <span className="ac-mini-note">Rien d’écarté : ton oreille a tout accepté.</span>
              )}
            </div>
          </div>
        </section>

        <Note>
          Ton profil est déjà nourri : la radio, la sortie du dimanche, tes trois envies et la leçon
          de cinq minutes partiront de cette famille. Tu peux la corriger en refaisant le test — pas
          en remplissant un formulaire.
        </Note>

        <div className="ac-actions">
          <Bouton onClick={onVoirProfil}>Voir ma carte sonore</Bouton>
          <Bouton variante="fantome" onClick={recommencer}>
            Refaire les neuf extraits
          </Bouton>
        </div>

        {!lireCle() && <ReglageCle />}
      </div>
    );
  }

  return null;
}
