import { useEffect, useMemo, useRef, useState } from 'react';
import {
  chargerMeteo,
  choisirSortie,
  dateLongue,
  emojiMeteo,
  familleMeteo,
  motifReservation,
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
        `${texteMeteo(meteo.code, meteo.temperature)} (${meteo.temperature} °C)`,
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

  const motif = sortie ? motifReservation(sortie.reference) : [];
  const familleM = meteo ? familleMeteo(meteo.code, meteo.temperature) : 'sec';

  return (
    <div className="ac-page">
      <EnteteModule
        id="dimanche"
        onRetour={onRetour}
        intro={
          <p className="ac-intro">
            Dis-nous seulement l’âge des enfants. ACCORD regarde la météo de ton coin, tient compte de
            ton budget et choisit <b>une</b> sortie pour dimanche — avec la fiche de réservation et
            l’invitation d’agenda déjà prêtes.
          </p>
        }
      />

      <div className="ac-meteo">
        <span className="ac-meteo__emoji" aria-hidden="true">
          {meteo ? emojiMeteo(meteo.code) : '…'}
        </span>
        <div>
          <b>
            {meteo
              ? `${meteo.temperature} °C · ${texteMeteo(meteo.code, meteo.temperature)}`
              : 'Je regarde le ciel…'}
          </b>
          <span>{meteo ? meteo.ville : 'géolocalisation facultative'}</span>
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
                Ta sortie · {familleM === 'pluie' ? 'à l’abri' : 'dehors'} · {sortie.duree}
              </p>
              <h2 className="ac-sortie__titre">{sortie.nom}</h2>
              <p className="ac-sortie__lieu">{sortie.lieu}</p>
              <p className="ac-sortie__description">{sortie.description}</p>
              <p className="ac-sortie__pourquoi">
                <b>Pourquoi celle-ci :</b> {sortie.pourquoi}
              </p>

              <div className="ac-sortie__infos">
                <span>{sortie.prix}</span>
                <span>{sortie.places} places</span>
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
                  Réserver mes billets ↗
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
              <span>Fiche de réservation ACCORD</span>
              <b>{sortie.reference}</b>
            </div>
            <div className="ac-billet__corps">
              <div className="ac-billet__code" aria-hidden="true">
                {motif.map((actif, index) => (
                  <i key={index} className={actif ? 'ac-billet__point' : ''} />
                ))}
              </div>
              <div className="ac-billet__infos">
                <h3>{sortie.nom}</h3>
                <p>
                  {dateAffichee} · {sortie.heure} · {sortie.places} places
                </p>
                <p>{sortie.lieu}</p>
                <p className="ac-mini-note">
                  ACCORD ne vend pas les billets : ton créneau et ta fiche sont prêts, la billetterie
                  s’ouvre en un clic sur le site du lieu.
                </p>
              </div>
            </div>
            <div className="ac-billet__pied">
              <span>{sortie.prix}</span>
              <span>{sortie.reference}</span>
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
            La sortie est stable pour ce week-end : elle ne change pas entre samedi soir et dimanche
            matin. Si tu demandes une autre idée, ACCORD reste dans les mêmes contraintes d’âge, de
            météo et de budget.
          </Note>
        </>
      )}

      {!lireCle() && <ReglageCle />}
    </div>
  );
}
