import { useState } from 'react';
import { dateLongue } from '../dimanche';
import { FAMILLES } from '../familles';
import { MODULES } from '../sons';
import type { ModuleId, Profil } from '../types';
import { Bouton, CarteProfil, Note, SceauFamille } from '../ui';

export function VueProfil({
  profil,
  onRetour,
  onModule,
  onOublier,
}: {
  profil: Profil | null;
  onRetour: () => void;
  onModule: (id: ModuleId) => void;
  onOublier: () => void;
}) {
  const [confirmer, setConfirmer] = useState(false);

  if (!profil) {
    return (
      <div className="ac-page">
        <header className="ac-entete">
          <button type="button" className="ac-retour" onClick={onRetour}>
            ← Retour
          </button>
          <p className="ac-eyebrow">Ton accord</p>
          <h1 className="ac-titre">Rien encore. C’est très bien.</h1>
          <p className="ac-intro">
            ACCORD ne demande pas de compte ni de formulaire. Fais le test des neuf sons : en deux
            minutes, ton profil d’écoute existe.
          </p>
        </header>
        <div className="ac-actions">
          <Bouton variante="grand" onClick={() => onModule('sons')}>
            Faire le test des 9 sons
          </Bouton>
          <Bouton variante="fantome" onClick={() => onModule('radio')}>
            Écouter la radio
          </Bouton>
        </div>
      </div>
    );
  }

  const famille = FAMILLES[profil.famille];

  return (
    <div className="ac-page">
      <header className="ac-entete">
        <button type="button" className="ac-retour" onClick={onRetour}>
          ← Retour
        </button>
        <p className="ac-eyebrow">Ton accord · {profil.source === 'mistral' ? 'Mistral, France' : 'moteur local'}</p>
        <h1 className="ac-titre">
          Ta carte <em>sonore.</em>
        </h1>
        <p className="ac-intro">
          Un seul profil, cinq modules. Chaque geste l’a précisé — sans que tu aies jamais eu à
          décrire tes goûts.
        </p>
      </header>

      <CarteProfil
        profil={profil}
        actions={
          <>
            <Bouton onClick={() => onModule('sons')}>Refaire le test des 9 sons</Bouton>
            <Bouton variante="fantome" onClick={() => onModule('radio')}>
              Écouter {famille.nom}
            </Bouton>
            <Bouton variante="lien" onClick={onRetour}>
              Retour à l’accueil
            </Bouton>
          </>
        }
      />

      <div className="ac-profil-grille">
        <section className="ac-profil-bloc">
          <div className="ac-profil-bloc__tete">
            <div>
              <p className="ac-eyebrow">Module 03 · ma voix suffit</p>
              <h2 className="ac-sous-titre">Tes trois envies</h2>
            </div>
            <Bouton variante="lien" onClick={() => onModule('voix')}>
              {profil.envies?.length ? 'Reparler' : 'Parler vingt secondes'}
            </Bouton>
          </div>
          {profil.envies?.length ? (
            <div className="ac-envies ac-envies--profil">
              {profil.envies.map((envie, index) => (
                <article key={`${envie.nom}-${index}`} className="ac-envie">
                  <span className="ac-envie__num">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{envie.nom}</h3>
                  <p>{envie.phrase}</p>
                  <a className="ac-envie__lien" href={envie.url} target="_blank" rel="noreferrer">
                    {envie.action} →
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <p className="ac-mini-note">Aucune envie enregistrée pour le moment.</p>
          )}
        </section>

        <section className="ac-profil-bloc">
          <div className="ac-profil-bloc__tete">
            <div>
              <p className="ac-eyebrow">Module 02 · l’activité du dimanche</p>
              <h2 className="ac-sous-titre">Ta sortie prête</h2>
            </div>
            <Bouton variante="lien" onClick={() => onModule('dimanche')}>
              {profil.sortie ? 'Changer' : 'Préparer dimanche'}
            </Bouton>
          </div>
          {profil.sortie ? (
            <div className="ac-sortie-mini">
              <SceauFamille famille={profil.famille} taille={52} />
              <div>
                <b>{profil.sortie.nom}</b>
                <p>{profil.sortie.lieu}</p>
                <span>
                  {dateLongue(new Date(profil.sortie.date))} · {profil.sortie.heure} ·{' '}
                  {profil.sortie.places} places · {profil.sortie.reference}
                </span>
              </div>
            </div>
          ) : (
            <p className="ac-mini-note">Aucune sortie préparée. Un âge et un budget suffisent.</p>
          )}
        </section>

        <section className="ac-profil-bloc">
          <div className="ac-profil-bloc__tete">
            <div>
              <p className="ac-eyebrow">Module 05 · cinq minutes</p>
              <h2 className="ac-sous-titre">Ta leçon du jour</h2>
            </div>
            <Bouton variante="lien" onClick={() => onModule('lecon')}>
              Ouvrir
            </Bouton>
          </div>
          {profil.lecon ? (
            <div className="ac-lecon-mini">
              <p className="ac-eyebrow">{profil.lecon.domaine}</p>
              <b>{profil.lecon.titre}</b>
              <span>{new Date(profil.lecon.date).toLocaleDateString('fr-FR')}</span>
            </div>
          ) : (
            <p className="ac-mini-note">La prochaine leçon t’attend dans le module cinq minutes.</p>
          )}
        </section>

        <section className="ac-profil-bloc">
          <div className="ac-profil-bloc__tete">
            <div>
              <p className="ac-eyebrow">Module 04 · la radio de mes goûts</p>
              <h2 className="ac-sous-titre">Ton flux</h2>
            </div>
            <Bouton variante="lien" onClick={() => onModule('radio')}>
              Écouter
            </Bouton>
          </div>
          {profil.radio ? (
            <div className="ac-radio-mini">
              <b>{FAMILLES[profil.radio.famille].nom}</b>
              <p>
                {profil.radio.minutes} min écoutées · {profil.radio.passes} zap
                {profil.radio.passes > 1 ? 's' : ''}
              </p>
              <span>Le flux s’est resserré sur cette famille.</span>
            </div>
          ) : (
            <p className="ac-mini-note">Le flux n’a pas encore tourné. Aucun bouton à presser après l’entrée.</p>
          )}
        </section>
      </div>

      <section className="ac-section ac-modules-nourris">
        <p className="ac-eyebrow">Où en est la connaissance de ton oreille</p>
        <div className="ac-modules-nourris__liste">
          {MODULES.map((module) => {
            const passages = profil.modules[module.id] ?? 0;
            return (
              <div key={module.id} className={`ac-module-nourri${passages > 0 ? ' ac-module-nourri--ok' : ''}`}>
                <span className="ac-module-nourri__glyphe">{module.glyphe}</span>
                <div>
                  <b>{module.nom}</b>
                  <span>{passages > 0 ? `${passages} passage${passages > 1 ? 's' : ''}` : 'pas encore ouvert'}</span>
                </div>
                <button type="button" className="ac-lien-discret" onClick={() => onModule(module.id)}>
                  {passages > 0 ? 'rouvrir' : 'ouvrir'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <Note>
        <div className="ac-oublier">
          <div>
            <strong>Ton profil reste ici.</strong> Il vit dans ce navigateur, sans compte. Tu peux
            l’effacer : les modules repartiront de zéro, comme au premier jour.
          </div>
          {confirmer ? (
            <div className="ac-oublier__confirme">
              <Bouton variante="fantome" onClick={() => setConfirmer(false)}>
                Annuler
              </Bouton>
              <Bouton
                onClick={() => {
                  setConfirmer(false);
                  onOublier();
                }}
              >
                Effacer mon profil
              </Bouton>
            </div>
          ) : (
            <Bouton variante="lien" onClick={() => setConfirmer(true)}>
              Effacer mon profil…
            </Bouton>
          )}
        </div>
      </Note>
    </div>
  );
}
