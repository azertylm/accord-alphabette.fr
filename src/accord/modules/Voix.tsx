import { useCallback, useEffect, useRef, useState } from 'react';
import { enviesLocales, mesurerProsodie, type Prosodie } from '../envies';
import { enviesMistral, lireCle, transcrireAudio } from '../ia';
import type { Envie, ModuleId, Signal } from '../types';
import { Bouton, EnteteModule, Note, Ondes, ReglageCle } from '../ui';

type Etape = 'pret' | 'ecoute' | 'analyse' | 'resultat';

interface Reconnaissance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((evenement: ResultatParole) => void) | null;
  onerror: ((evenement: unknown) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface ResultatParole {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

type ConstructeurReconnaissance = new () => Reconnaissance;

const DUREE = 20;

function reconnaissanceVocale(): ConstructeurReconnaissance | null {
  const fenetre = window as unknown as {
    SpeechRecognition?: ConstructeurReconnaissance;
    webkitSpeechRecognition?: ConstructeurReconnaissance;
  };
  return fenetre.SpeechRecognition ?? fenetre.webkitSpeechRecognition ?? null;
}

export function Voix({
  onProfil,
  onRetour,
  onVoirProfil,
}: {
  onProfil: (signal: Signal, module: ModuleId) => void;
  onRetour: () => void;
  onVoirProfil: () => void;
}) {
  const [etape, setEtape] = useState<Etape>('pret');
  const [secondes, setSecondes] = useState(0);
  const [bars, setBars] = useState<number[]>(() => new Array(28).fill(0.08));
  const [envies, setEnvies] = useState<Envie[]>([]);
  const [transcription, setTranscription] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [texteLibre, setTexteLibre] = useState('');
  const [modeTexte, setModeTexte] = useState(false);
  const [source, setSource] = useState<'local' | 'mistral'>('local');
  const [enregistre, setEnregistre] = useState(false);

  const flux = useRef<MediaStream | null>(null);
  const contexte = useRef<AudioContext | null>(null);
  const analyseur = useRef<AnalyserNode | null>(null);
  const enregistreur = useRef<MediaRecorder | null>(null);
  const morceaux = useRef<Blob[]>([]);
  const echantillons = useRef<number[]>([]);
  const minuteur = useRef<number | null>(null);
  const debut = useRef(0);
  const etapeRef = useRef<Etape>('pret');
  const arreterRef = useRef<() => void>(() => {});
  const reconnaissance = useRef<Reconnaissance | null>(null);
  const texteReconnu = useRef('');
  const deja = useRef(false);
  const traiterRef = useRef<(texte: string, prosodie: Prosodie, audio: Blob | null) => void>(() => {});

  useEffect(() => {
    etapeRef.current = etape;
  }, [etape]);

  useEffect(
    () => () => {
      if (minuteur.current) window.clearInterval(minuteur.current);
      flux.current?.getTracks().forEach((piste) => piste.stop());
      try {
        reconnaissance.current?.abort();
      } catch {
        /* déjà arrêtée. */
      }
      void contexte.current?.close();
    },
    [],
  );

  const traiter = useCallback(
    async (texteSaisi: string, prosodie: Prosodie, audio: Blob | null) => {
      setEtape('analyse');
      setErreur(null);
      const locales = enviesLocales(texteSaisi, prosodie);
      let retenues = locales;
      let texte = texteSaisi;
      let depuis: 'local' | 'mistral' = 'local';

      if (lireCle()) {
        try {
          if (!texte && audio) {
            texte = await transcrireAudio(audio);
            setTranscription(texte);
          }
          if (texte.trim().length > 8) {
            retenues = await enviesMistral(texte);
            depuis = 'mistral';
          }
        } catch (probleme) {
          setErreur(
            probleme instanceof Error
              ? probleme.message
              : 'Mistral n’a pas répondu. La lecture locale a pris le relais.',
          );
        }
      }

      if (!deja.current) {
        deja.current = true;
        onProfil(
          {
            mots: retenues.map((envie) => envie.nom),
            confiance: Math.round(50 + retenues.length * 2),
            source: depuis,
            envies: retenues,
          },
          'voix',
        );
      }

      setEnvies(retenues);
      setSource(depuis);
      setEnregistre(Boolean(audio));
      setEtape('resultat');
    },
    [onProfil],
  );

  traiterRef.current = (texte, prosodie, audio) => {
    void traiter(texte, prosodie, audio);
  };

  const arreter = useCallback(() => {
    if (etapeRef.current !== 'ecoute') return;
    etapeRef.current = 'analyse';
    const duree = Math.min(DUREE, (performance.now() - debut.current) / 1000);
    if (minuteur.current) {
      window.clearInterval(minuteur.current);
      minuteur.current = null;
    }
    try {
      reconnaissance.current?.stop();
    } catch {
      /* déjà arrêtée. */
    }
    flux.current?.getTracks().forEach((piste) => piste.stop());
    void contexte.current?.close();
    contexte.current = null;
    setEtape('analyse');

    const prosodie = mesurerProsodie(echantillons.current, duree);
    const type = enregistreur.current?.mimeType || 'audio/webm';

    const finaliser = () => {
      const audio = morceaux.current.length ? new Blob(morceaux.current, { type }) : null;
      const texte = (texteReconnu.current || '').trim();
      traiterRef.current(texte, prosodie, audio);
    };

    const rec = enregistreur.current;
    if (rec && rec.state !== 'inactive') {
      rec.addEventListener('stop', finaliser, { once: true });
      try {
        rec.stop();
      } catch {
        finaliser();
      }
    } else {
      finaliser();
    }
  }, []);

  arreterRef.current = arreter;

  const demarrer = async () => {
    setErreur(null);
    setTranscription('');
    setEnvies([]);
    setEnregistre(false);
    echantillons.current = [];
    morceaux.current = [];
    texteReconnu.current = '';
    deja.current = false;
    setSecondes(0);
    setBars(new Array(28).fill(0.08));

    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      flux.current = media;

      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      contexte.current = ctx;
      const sourceMedia = ctx.createMediaStreamSource(media);
      const noeud = ctx.createAnalyser();
      noeud.fftSize = 1024;
      sourceMedia.connect(noeud);
      analyseur.current = noeud;

      const rec = new MediaRecorder(media);
      rec.ondataavailable = (evenement) => {
        if (evenement.data.size > 0) morceaux.current.push(evenement.data);
      };
      rec.start(250);
      enregistreur.current = rec;

      // La reconnaissance vocale du navigateur donne un texte immédiat, sans
      // envoyer l'audio à Mistral. Quand elle n'existe pas, la transcription
      // Mistral prend le relais si une clé est configurée.
      const Ctor = reconnaissanceVocale();
      if (Ctor) {
        try {
          const reco = new Ctor();
          reco.lang = 'fr-FR';
          reco.continuous = true;
          reco.interimResults = true;
          reco.onresult = (evenement) => {
            let texte = '';
            for (let i = 0; i < evenement.results.length; i += 1) {
              texte += evenement.results[i][0]?.transcript ?? ' ';
            }
            texteReconnu.current = texte.trim();
          };
          reco.onerror = () => {
            /* le repli Mistral ou la prosodie suffit. */
          };
          reco.start();
          reconnaissance.current = reco;
        } catch {
          /* reconnaissance indisponible : on continue sans texte. */
        }
      }

      setEtape('ecoute');
      etapeRef.current = 'ecoute';
      debut.current = performance.now();

      minuteur.current = window.setInterval(() => {
        const ecoule = (performance.now() - debut.current) / 1000;
        setSecondes(Math.min(DUREE, ecoule));
        const noeudAnalyse = analyseur.current;
        if (noeudAnalyse) {
          const donnees = new Uint8Array(noeudAnalyse.frequencyBinCount);
          noeudAnalyse.getByteTimeDomainData(donnees);
          let somme = 0;
          for (let i = 0; i < donnees.length; i += 1) {
            const valeur = (donnees[i] - 128) / 128;
            somme += valeur * valeur;
          }
          const rms = Math.sqrt(somme / donnees.length);
          echantillons.current.push(rms);
          setBars((precedentes) => [...precedentes.slice(1), Math.max(0.06, Math.min(1, rms * 7))]);
        }
        if (ecoule >= DUREE) arreterRef.current();
      }, 90);
    } catch (probleme) {
      setErreur(
        probleme instanceof Error && probleme.name === 'NotAllowedError'
          ? 'Le micro est bloqué. Autorise-le dans le navigateur, ou utilise le repli écrit.'
          : 'Aucun micro accessible. Le repli écrit fonctionne aussi.',
      );
      setEtape('pret');
    }
  };

  const analyserTexte = () => {
    if (texteLibre.trim().length < 3) return;
    setTranscription(texteLibre.trim());
    void traiter(texteLibre.trim(), { energie: 46, variation: 34, silences: 0.25, duree: 0 }, null);
  };

  const recommencer = () => {
    setEtape('pret');
    setSecondes(0);
    setEnvies([]);
    setTranscription('');
    setErreur(null);
    setEnregistre(false);
    setTexteLibre('');
    deja.current = false;
    setBars(new Array(28).fill(0.08));
  };

  return (
    <div className="ac-page">
      <EnteteModule
        id="voix"
        onRetour={onRetour}
        intro={
          <p className="ac-intro">
            Parle vingt secondes de ta journée, comme à un ami. Ce qui t’a énervé, ce qui t’a plu, ce
            que tu n’as pas eu le temps de faire. ACCORD repère les élans et les manques, et en tire
            trois envies à satisfaire cette semaine.
          </p>
        }
      />

      {etape === 'pret' && (
        <>
          <div className="ac-voix">
            <button type="button" className="ac-micro" onClick={() => void demarrer()}>
              <span className="ac-micro__halo" />
              <span className="ac-micro__icone" aria-hidden="true">
                ◍
              </span>
            </button>
            <p className="ac-voix__invite">Vingt secondes, sans te préparer.</p>
            <p className="ac-voix__aide">
              Personne n’écoute à part toi. Le son reste dans cet appareil ; si tu ajoutes une clé
              Mistral, il part chez Mistral en France pour la transcription, puis il est oublié.
            </p>
          </div>

          {erreur && <p className="ac-erreur">{erreur}</p>}

          <div className="ac-voix__repli">
            <button type="button" className="ac-lien-discret" onClick={() => setModeTexte((valeur) => !valeur)}>
              {modeTexte ? 'Masquer le repli écrit' : 'Pas de micro, ou pas envie de parler ?'}
            </button>
            {modeTexte && (
              <div className="ac-repli-texte">
                <label className="ac-champ">
                  <span>Trois mots suffisent</span>
                  <input
                    type="text"
                    value={texteLibre}
                    placeholder="fatigué, envie de voir des amis, besoin d’air…"
                    maxLength={180}
                    onChange={(evenement) => setTexteLibre(evenement.target.value)}
                    onKeyDown={(evenement) => {
                      if (evenement.key === 'Enter') analyserTexte();
                    }}
                  />
                </label>
                <Bouton onClick={analyserTexte} disabled={texteLibre.trim().length < 3}>
                  Deviner mes envies
                </Bouton>
              </div>
            )}
          </div>

          <ReglageCle />
        </>
      )}

      {etape === 'ecoute' && (
        <div className="ac-voix ac-voix--ecoute">
          <div className="ac-micro ac-micro--ecoute">
            <span className="ac-micro__halo" />
            <span className="ac-micro__halo ac-micro__halo--2" />
            <span className="ac-micro__icone" aria-hidden="true">
              ◍
            </span>
          </div>
          <p className="ac-chrono">
            <b>{String(Math.floor(secondes)).padStart(2, '0')}</b> / 20 secondes
          </p>
          <Ondes valeurs={bars} hauteur={84} barres={32} />
          <p className="ac-voix__aide">Ne te censure pas. Les hésitations comptent aussi.</p>
          <Bouton variante="fantome" onClick={() => arreterRef.current()}>
            J’ai fini
          </Bouton>
        </div>
      )}

      {etape === 'analyse' && (
        <div className="ac-analyse">
          <p className="ac-eyebrow">Lecture de la voix</p>
          <h1 className="ac-titre">Je relis ta journée.</h1>
          <div className="ac-analyse__rond" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <ul className="ac-analyse__lignes">
            <li>Énergie, variations, silences</li>
            <li>Ce qui revient sans que tu le dises</li>
            <li>Trois envies à satisfaire cette semaine</li>
          </ul>
        </div>
      )}

      {etape === 'resultat' && envies.length > 0 && (
        <>
          <header className="ac-entete ac-entete--serre">
            <button type="button" className="ac-retour" onClick={recommencer}>
              ← Refaire
            </button>
            <p className="ac-eyebrow">
              Ta voix · {source === 'mistral' ? 'Mistral, France' : 'moteur local'}
            </p>
            <h1 className="ac-titre">Trois envies pour cette semaine.</h1>
            <p className="ac-intro">
              Rien à valider : ce sont des directions, pas des devoirs. Une seule suffit pour que la
              semaine change de couleur.
            </p>
          </header>

          {erreur && <p className="ac-erreur">{erreur}</p>}

          <div className="ac-envies">
            {envies.map((envie, index) => (
              <article key={`${envie.nom}-${index}`} className="ac-envie">
                <span className="ac-envie__num">{String(index + 1).padStart(2, '0')}</span>
                <h2>{envie.nom}</h2>
                <p>{envie.phrase}</p>
                <a className="ac-envie__lien" href={envie.url} target="_blank" rel="noreferrer">
                  {envie.action} →
                </a>
              </article>
            ))}
          </div>

          {transcription && (
            <details className="ac-transcription">
              <summary>Ce que j’ai entendu</summary>
              <p>{transcription}</p>
            </details>
          )}

          <div className="ac-actions ac-actions--centre">
            <Bouton onClick={onVoirProfil}>Voir ma carte sonore</Bouton>
            <Bouton variante="fantome" onClick={recommencer}>
              Reparler vingt secondes
            </Bouton>
          </div>

          <p className="ac-mini-note ac-mini-note--centre">
            {enregistre && source === 'mistral'
              ? 'L’enregistrement a été transmis à Mistral en France pour la transcription, puis oublié.'
              : 'Aucun enregistrement n’a quitté cet appareil. Seules l’énergie et les pauses ont été mesurées.'}
          </p>

          {!lireCle() && <ReglageCle />}
        </>
      )}

      {etape === 'resultat' && envies.length === 0 && (
        <Note>
          Je n’ai pas réussi à dégager trois envies. Recommence en parlant plus librement, ou utilise
          le repli écrit.
          <div className="ac-actions">
            <Bouton onClick={recommencer}>Recommencer</Bouton>
          </div>
        </Note>
      )}
    </div>
  );
}
