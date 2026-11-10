import { useEffect, useMemo, useRef, useState } from 'react';
import {
  chargerMeteo,
  choisirSortie,
  dateLongue,
  emojiMeteo,
  familleMeteo,
  prochainDimanche,
  telechargerInvitation,
  texteMeteo,
  type Budget,
  type Meteo,
} from '../dimanche';
import { conseilDimanche, lireCle } from '../ia';
import type { ModuleId, Profil, Signal, Sortie } from '../types';
import { Bouton, EnteteModule, Note, ReglageCle } from '../ui';

const AGES: { label: string; valeur: number; note: string }[] = [
  { label: '0–3 ans', valeur: 2, note: 'tout petit' },
  { label: '4–6 ans', valeur: 5, note: 'maternelle' },
  { label: '7–9 ans', valeur: 8, note: 'primaire' },
  { label: '10–12 ans', valeur: 11, note: 'avant l’adolescence' },
  { label: '13 ans +', valeur: 15, note: 'ado' },
];

const BUDGETS: { id: Budget; label: string; note: string }[] = [
  { id: 'gratuit', label: 'Gratuit', note: '0 €' },
  { id: 'petit', label: '≤ 30 €', note: 'une place, un goûter' },
  { id: 'moyen', label: '≤ 60 €', note: 'toute la famille' },
];

export function Dimanche({
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
  const [meteo, setMeteo] = useState<Meteo | null>(null);
  const [ages, setAges] = useState<number[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [sortie, setSortie] = useState<Sortie | null>(null);
  const [variante, setVariante] = useState(0);
  const [conseil, setConseil] = useState<string | null>(null);
  const [chargementConseil, setChargementConseil] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const sauvegarde = useRef('');
  const jetonConseil = useRef(0);

  const dimanche = useMemo(() => prochainDimanche(), []);
  const dateAffichee = useMemo(() => dateLongue(dimanche), [dimanche]);

  useEffect(() => {
    let annule = false;
    void chargerMeteo().then((releve) => {
      if (!annule) setMeteo(releve);
    });
    return () => {
      annule = true;
    };
  }, []);

  useEffect(() => {
    if (!meteo || ages.length === 0 || !budget) {
      setSortie(null);
      setConseil(null);
      return;
    }
    const famille = profil?.famille ?? 'clairiere';
    const familleM = familleMeteo(meteo.code, meteo.temperature);
    const choix = choisirSortie(ages, familleM, budget, famille, dimanche, variante);
    setSortie(choix);
    setConseil(null);
    setErreur(null);

    const cle = `${familleM}-${ages.join(',')}-${budget}-${variante}-${prochainDimanche().toISOString().slice(0, 10)}`;
    if (sauvegarde.current !== cle) {
      sauvegarde.current = cle;
      onProfil(
        {
          mots: ['dimanche', 'famille', choix.id],
          sortie: choix,
          confiance: profil ? undefined : 44,
          source: 'local',
        },
        'dimanche',
      );
    }

    if (lireCle()) {
      const jeton = jetonConseil.current + 1;
      jetonConseil.current = jeton;
      setChargementConseil(true);
      conseilDimanche(
        choix.nom,
        ages.map((age) => `${age} ans`).join(', '),
        meteo.indisponible ? 'prévision inconnue' : `${texteMeteo(meteo.code, meteo.temperature)} (${meteo.temperature} °C)`,
      )
        .then((texte) => {
          if (jetonConseil.current === jeton) setConseil(texte);
        })
        .catch(() => {
          if (jetonConseil.current === jeton) setConseil(choix.pourquoi);
        })
        .finally(() => {
          if (jetonConseil.current === jeton) setChargementConseil(false);
        });
    }
    // onProfil est stable (useCallback dans App) : on ne le met pas en dépendance
    // pour éviter de recalculer la sortie à chaque rendu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meteo, ages, budget, variante, dimanche]);

  const basculerAge = (valeur: number) => {
    setAges((actuels) =>
      actuels.includes(valeur) ? actuels.filter((age) => age !== valeur) : [...actuels, valeur].sort((a, b) => a - b),
    );
    setVariante(0);
  };


  return (
    <div className="ac-page">
      <EnteteModule
        id="dimanche"
        onRetour={onRetour}
        intro={
          <p className="ac-intro">
            Dis-nous seulement l’âge des enfants. ACCORD regarde la météo de ton coin, tient compte de
            ton budget et propose <b>une</b> idée de sortie pour dimanche, avec un mémo et l’invitation d’agenda.
            ACCORD ne réserve rien : c’est toi qui vérifies et réserves auprès du lieu.
          </p>
        }
      />

      <div className="ac-meteo">
        <span className="ac-meteo__emoji" aria-hidden="true">
          {meteo && !meteo.indisponible ? emojiMeteo(meteo.code) : '…'}
        </span>
        <div>
          <b>
            {!meteo
              ? 'Je regarde la prévision…'
              : meteo.indisponible
                ? 'Prévision indisponible'
                : `Dimanche : ${meteo.temperature} °C max · ${texteMeteo(meteo.code, meteo.temperature)}`}
          </b>
          <span>
            {!meteo
              ? 'géolocalisation facultative'
              : meteo.indisponible
                ? 'Regarde la météo avant de partir : l’idée proposée n’en tient pas compte.'
                : `${meteo.ville} · prévision Open-Meteo, à revérifier la veille`}
          </span>
        </div>
        <span className="ac-meteo__tag">
          {dateAffichee} · {sortie ? sortie.heure : '10 h 30'}
        </span>
      </div>

      <section className="ac-choix">
        <div className="ac-choix__bloc">
          <p className="ac-eyebrow">L’âge des enfants</p>
          <p className="ac-mini-note">Touche une ou plusieurs tranches d’âge.</p>
          <div className="ac-puces">
            {AGES.map((age) => (
              <button
                key={age.valeur}
                type="button"
                className={`ac-puce${ages.includes(age.valeur) ? ' ac-puce--active' : ''}`}
                onClick={() => basculerAge(age.valeur)}
                aria-pressed={ages.includes(age.valeur)}
              >
                <b>{age.label}</b>
                <small>{age.note}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="ac-choix__bloc">
          <p className="ac-eyebrow">Le budget de la sortie</p>
          <p className="ac-mini-note">Tout compris, hors repas.</p>
          <div className="ac-puces">
            {BUDGETS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`ac-puce${budget === option.id ? ' ac-puce--active' : ''}`}
                onClick={() => {
                  setBudget(option.id);
                  setVariante(0);
                }}
                aria-pressed={budget === option.id}
              >
                <b>{option.label}</b>
                <small>{option.note}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      {erreur && <p className="ac-erreur">{erreur}</p>}

      {!sortie && (
        <Note>
          {ages.length === 0
            ? 'Choisis d’abord un âge : ACCORD s’occupe du reste, météo comprise.'
            : 'Il ne manque que le budget. Une fois choisi, une seule sortie apparaît — pas un programme.'}
        </Note>
      )}

      {sortie && (
        <>
          <article className="ac-sortie">
            <div className="ac-sortie__visuel" aria-hidden="true">
              <span className="ac-sortie__sceau">
                <i />
                <i />
                <i />
              </span>
              <span className="ac-sortie__jour">DIMANCHE</span>
              <span className="ac-sortie__creneau">{sortie.heure}</span>
            </div>

            <div className="ac-sortie__texte">
              <p className="ac-eyebrow">
                Ton idée de sortie · {sortie.duree}
              </p>
              <h2 className="ac-sortie__titre">{sortie.nom}</h2>
              <p className="ac-sortie__lieu">{sortie.lieu}</p>
              <p className="ac-sortie__description">{sortie.description}</p>
              <p className="ac-sortie__pourquoi">
                <b>Pourquoi celle-ci :</b> {sortie.pourquoi}
              </p>

              <div className="ac-sortie__infos">
                <span>{sortie.prix} (prix indicatif)</span>
                <span>{dateAffichee}</span>
              </div>

              <div className="ac-preparation">
                <p className="ac-bloc__titre">À préparer</p>
                <ul>
                  {sortie.preparation.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              {(chargementConseil || conseil) && (
                <p className="ac-conseil">
                  <b>Le conseil d’ACCORD :</b>{' '}
                  {chargementConseil ? 'je cherche le meilleur angle…' : conseil}
                </p>
              )}

              <div className="ac-actions">
                <Bouton variante="grand" onClick={() => telechargerInvitation(sortie)}>
                  Ajouter à mon agenda
                </Bouton>
                <a
                  className="ac-bouton ac-bouton--fantome"
                  href={sortie.lienBillets}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chercher le lieu et ses tarifs ↗
                </a>
                <Bouton
                  variante="lien"
                  onClick={() => {
                    setVariante((valeur) => valeur + 1);
                  }}
                >
                  Voir une autre idée
                </Bouton>
              </div>
            </div>
          </article>

          <section className="ac-billet">
            <div className="ac-billet__tete">
              <span>Mémo de la sortie</span>
              <b>Rien n’est réservé</b>
            </div>
            <div className="ac-billet__corps">
              <div className="ac-billet__infos">
                <h3>{sortie.nom}</h3>
                <p>
                  {dateAffichee} · vers {sortie.heure}
                </p>
                <p>{sortie.lieu}</p>
                <p className="ac-mini-note">
                  Ceci est un mémo, pas un billet. ACCORD ne connaît pas les lieux près de chez toi,
                  ne réserve pas et ne vend rien : vérifie l’ouverture, les horaires et les tarifs
                  sur le site du lieu avant de partir.
                </p>
              </div>
            </div>
            <div className="ac-billet__pied">
              <span>{sortie.prix} (prix indicatif)</span>
            </div>
          </section>

          <div className="ac-actions ac-actions--centre">
            <Bouton onClick={onVoirProfil}>Voir mon profil d’écoute</Bouton>
            <Bouton
              variante="fantome"
              onClick={() => {
                setAges([]);
                setBudget(null);
                setSortie(null);
                setConseil(null);
                setVariante(0);
                sauvegarde.current = '';
              }}
            >
              Changer d’âge
            </Bouton>
          </div>

          <Note>
            L’idée reste la même pendant la semaine tant que la prévision ne change pas de catégorie.
            Si tu demandes une autre idée, ACCORD reste dans les mêmes contraintes d’âge, de météo
            et de budget. Les prix sont des ordres de grandeur.
          </Note>
        </>
      )}

      {!lireCle() && <ReglageCle />}
    </div>
  );
}
