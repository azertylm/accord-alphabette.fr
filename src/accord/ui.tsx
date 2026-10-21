import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FAMILLES } from './familles';
import { ecrireCle, lireCle } from './ia';
import { AXES_HINTS, AXES_LABELS, niveauConfiance } from './profil';
import { MODULES } from './sons';
import type { Axe, ModuleId, Profil } from './types';

/* --------------------------------------------------------------------------
   Boutons
-------------------------------------------------------------------------- */

type Variante = 'plein' | 'fantome' | 'doux' | 'lien' | 'grand';

export function Bouton({
  variante = 'plein',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  const classes = [
    'ac-bouton',
    `ac-bouton--${variante === 'grand' ? 'plein' : variante}`,
    variante === 'grand' ? 'ac-bouton--grand' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`ac-note ${className}`.trim()}>{children}</div>;
}

/* --------------------------------------------------------------------------
   Les cinq axes
-------------------------------------------------------------------------- */

export function Jauges({ profil, compact = false }: { profil: Profil; compact?: boolean }) {
  return (
    <div className={`ac-jauges${compact ? ' ac-jauges--compact' : ''}`}>
      {(Object.keys(AXES_LABELS) as Axe[]).map((axe) => (
        <div key={axe} className="ac-jauge">
          <span className="ac-jauge__nom">{AXES_LABELS[axe]}</span>
          <span className="ac-jauge__piste" aria-hidden="true">
            <span className="ac-jauge__valeur" style={{ width: `${profil.axes[axe]}%` }} />
          </span>
          <span className="ac-jauge__chiffre">{profil.axes[axe]}</span>
          {!compact && (
            <span className="ac-jauge__reperes">
              <span>{AXES_HINTS[axe][0]}</span>
              <span>{AXES_HINTS[axe][1]}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Carte de profil partagée
-------------------------------------------------------------------------- */

export function CarteProfil({
  profil,
  compact = false,
  actions,
}: {
  profil: Profil;
  compact?: boolean;
  actions?: ReactNode;
}) {
  const famille = FAMILLES[profil.famille];
  const actifs = (Object.keys(profil.modules) as ModuleId[]).filter(
    (id) => (profil.modules[id] ?? 0) > 0,
  );
  const noms = actifs
    .map((id) => MODULES.find((module) => module.id === id)?.nom)
    .filter(Boolean) as string[];

  return (
    <article className={`ac-profil${compact ? ' ac-profil--compact' : ''}`}>
      <div className="ac-profil__tete">
        <div className="ac-profil__texte">
          <p className="ac-eyebrow">
            Ton accord · {noms.length} module{noms.length > 1 ? 's' : ''} ·{' '}
            {profil.source === 'mistral' ? 'Mistral, France' : 'moteur local'}
          </p>
          <h2 className="ac-profil__nom">{famille.nom}</h2>
          <p className="ac-profil__sous">{famille.sousTitre}</p>
          <p className="ac-profil__phrase">{famille.phrase}</p>
        </div>
        <div className="ac-anneau" style={{ ['--ac-val' as string]: `${profil.confiance}%` }}>
          <span className="ac-anneau__centre">
            <b>{profil.confiance}</b>
            <small>{niveauConfiance(profil.confiance)}</small>
          </span>
        </div>
      </div>

      <div className="ac-profil__corps">
        <div className="ac-profil__bloc">
          <p className="ac-bloc__titre">Ce que ton oreille cherche</p>
          <Jauges profil={profil} compact={compact} />
        </div>
        <div className="ac-profil__bloc">
          <p className="ac-bloc__titre">Mots du moment</p>
          <div className="ac-mots">
            {profil.mots.map((mot) => (
              <span key={mot} className="ac-mot">
                {mot}
              </span>
            ))}
          </div>
          <p className="ac-bloc__titre ac-bloc__titre--espace">Nourri par</p>
          <div className="ac-sources">
            {noms.map((nom) => (
              <span key={nom} className="ac-source">
                {nom}
              </span>
            ))}
          </div>
        </div>
      </div>

      {actions && <div className="ac-profil__pied">{actions}</div>}
    </article>
  );
}

/* --------------------------------------------------------------------------
   En-tête de module
-------------------------------------------------------------------------- */

export function EnteteModule({
  id,
  onRetour,
  intro,
  apres,
}: {
  id: ModuleId;
  onRetour: () => void;
  intro?: ReactNode;
  apres?: ReactNode;
}) {
  const module = MODULES.find((entree) => entree.id === id);
  if (!module) return null;
  return (
    <header className="ac-entete">
      <button type="button" className="ac-retour" onClick={onRetour}>
        ← Retour
      </button>
      <p className="ac-eyebrow">
        Module {module.numero} · {module.nom} · {module.duree}
      </p>
      <h1 className="ac-titre">{module.question}</h1>
      {intro ?? <p className="ac-intro">{module.promesse}</p>}
      {apres}
    </header>
  );
}

/* --------------------------------------------------------------------------
   Ondes
-------------------------------------------------------------------------- */

export function Ondes({
  valeurs,
  actif = true,
  hauteur = 96,
  barres = 40,
}: {
  valeurs: number[];
  actif?: boolean;
  hauteur?: number;
  barres?: number;
}) {
  const affichees = Array.from({ length: barres }, (_, index) => valeurs[index] ?? 0.05);
  return (
    <div
      className={`ac-ondes${actif ? ' ac-ondes--actif' : ''}`}
      style={{ height: hauteur }}
      aria-hidden="true"
    >
      {affichees.map((valeur, index) => (
        <span
          key={index}
          className="ac-onde"
          style={{ height: `${Math.max(5, Math.min(100, valeur * 100))}%` }}
        />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Clé Mistral (BYOK)
-------------------------------------------------------------------------- */

export function ReglageCle() {
  const [cle, setCle] = useState(() => lireCle() ?? '');
  const [etat, setEtat] = useState<'repos' | 'ok' | 'effacee'>(() => (lireCle() ? 'ok' : 'repos'));
  const [ouvert, setOuvert] = useState(false);

  return (
    <Note>
      <div className="ac-cle">
        <div>
          <strong>IA souveraine, optionnelle.</strong> Sans clé, ACCORD synthétise les neuf sons et
          calcule tout localement. Avec une clé <em>Mistral AI</em> (serveurs en France), les textes
          sont écrits plus finement — seuls les mots et les mesures partent, jamais la voix ni les
          sons.
        </div>
        <Bouton variante="fantome" onClick={() => setOuvert((valeur) => !valeur)}>
          {lireCle() ? '🔑 Clé Mistral : prête' : '🔑 Ajouter ma clé Mistral'}
        </Bouton>
      </div>

      {ouvert && (
        <div className="ac-cle__panneau">
          <label className="ac-champ">
            <span>Clé Mistral (BYOK)</span>
            <input
              type="password"
              value={cle}
              placeholder="sk-…"
              autoComplete="off"
              onChange={(evenement) => setCle(evenement.target.value)}
            />
          </label>
          <div className="ac-cle__actions">
            <Bouton
              onClick={() => {
                ecrireCle(cle);
                setEtat(cle.trim() ? 'ok' : 'effacee');
              }}
            >
              Enregistrer
            </Bouton>
            <Bouton
              variante="fantome"
              onClick={() => {
                ecrireCle(null);
                setCle('');
                setEtat('effacee');
              }}
            >
              Effacer
            </Bouton>
          </div>
          <p className="ac-mini-note">
            {etat === 'ok' && '✓ Clé enregistrée dans ce navigateur. La prochaine analyse passera par Mistral.'}
            {etat === 'effacee' && 'Clé effacée. ACCORD repasse entièrement en local.'}
            {etat === 'repos' && 'Aucune clé : ACCORD fonctionne en local, sans réseau.'}
          </p>
        </div>
      )}
    </Note>
  );
}

/* --------------------------------------------------------------------------
   Sceau de famille — un motif propre à chaque famille, sans couleur en dur
-------------------------------------------------------------------------- */

export function SceauFamille({ famille, taille = 64 }: { famille: keyof typeof FAMILLES; taille?: number }) {
  return (
    <span
      className={`ac-sceau ac-sceau--${famille}`}
      style={{ width: taille, height: taille }}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
    </span>
  );
}
