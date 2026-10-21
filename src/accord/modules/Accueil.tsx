import { FAMILLES } from '../familles';
import { MODULES, SONS } from '../sons';
import type { ModuleId, Profil } from '../types';
import { Bouton, CarteProfil, Note, ReglageCle, SceauFamille } from '../ui';

const AUTRES = MODULES.filter((module) => module.id !== 'sons');

export function Accueil({
  profil,
  onModule,
  onVoirProfil,
}: {
  profil: Profil | null;
  onModule: (id: ModuleId) => void;
  onVoirProfil: () => void;
}) {
  const famille = profil ? FAMILLES[profil.famille] : null;
  const modulesNourris = profil
    ? (Object.keys(profil.modules) as ModuleId[]).filter((id) => (profil.modules[id] ?? 0) > 0).length
    : 0;

  return (
    <div className="ac-page ac-accueil">
      <header className="ac-hero">
        <div className="ac-hero__texte">
          <p className="ac-eyebrow">Accord · écosystème alphabette.fr</p>
          <h1 className="ac-hero__titre">
            Ce qui te fait du bien
            <br />
            <em>s’entend.</em>
          </h1>
          <p className="ac-hero__sous">
            Neuf extraits de cinq secondes. Aucune question, aucune liste de quarante résultats. Tu
            dis seulement ce qui te fait du bien — ACCORD en déduit ta <b>famille sonore</b> et te rend{' '}
            <b>une playlist</b> d’ambiance, prête à jouer.
          </p>

          <div className="ac-hero__actions">
            <Bouton variante="grand" onClick={() => onModule('sons')}>
              Faire le test des 9 sons
            </Bouton>
            <Bouton variante="fantome" onClick={() => onModule('radio')}>
              Ouvrir la radio →
            </Bouton>
          </div>

          <ul className="ac-promesses">
            <li>
              <b>9</b> extraits de 5 s
            </li>
            <li>
              <b>2</b> minutes
            </li>
            <li>
              <b>1</b> playlist
            </li>
            <li>
              <b>0</b> formulaire
            </li>
          </ul>
        </div>

        <div className="ac-hero__visuel" aria-hidden="true">
          <div className="ac-cercles">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="ac-grille-sons">
            {SONS.map((son, index) => (
              <span key={son.id} className="ac-son-pastille" style={{ ['--i' as string]: index }}>
                {son.numero}
              </span>
            ))}
          </div>
          <div className="ac-hero__etiquette">
            <span>9 × 5 secondes</span>
            <b>aucun son enregistré</b>
          </div>
        </div>
      </header>

      {profil && famille ? (
        <section className="ac-section">
          <div className="ac-section__tete">
            <div>
              <p className="ac-eyebrow">
                Ton accord · {modulesNourris} module{modulesNourris > 1 ? 's' : ''}
              </p>
              <h2 className="ac-sous-titre">Ce qu’ACCORD sait déjà de ton oreille.</h2>
            </div>
            <Bouton variante="fantome" onClick={onVoirProfil}>
              Voir le profil complet
            </Bouton>
          </div>
          <CarteProfil
            profil={profil}
            compact
            actions={
              <>
                <Bouton onClick={() => onModule('radio')}>Écouter ma famille : {famille.nom}</Bouton>
                <Bouton variante="fantome" onClick={() => onModule('sons')}>
                  Refaire le test
                </Bouton>
                <Bouton variante="lien" onClick={onVoirProfil}>
                  Mes cinq axes
                </Bouton>
              </>
            }
          />
        </section>
      ) : (
        <section className="ac-section ac-comment">
          <p className="ac-eyebrow">Comment ça marche</p>
          <h2 className="ac-sous-titre">Un signal déjà présent. Une réponse prête.</h2>
          <div className="ac-etapes">
            <div>
              <span>1</span>
              <b>Tu réagis</b>
              <p>
                Neuf extraits synthétisés dans ton navigateur : forêt, pluie, jazz, silence, ville,
                vague, papier, néon, feu. Rien à décrire.
              </p>
            </div>
            <div>
              <span>2</span>
              <b>ACCORD écoute ta réaction</b>
              <p>
                Cinq axes — chaleur, mouvement, nature, densité, lumière — et neuf familles
                possibles. Le moteur local suffit ; Mistral affine les mots.
              </p>
            </div>
            <div>
              <span>3</span>
              <b>Tu reçois une seule réponse</b>
              <p>
                Une famille sonore, une phrase, une playlist. Puis la radio, la sortie du dimanche,
                tes trois envies et la leçon de cinq minutes.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="ac-section">
        <div className="ac-section__tete">
          <div>
            <p className="ac-eyebrow">Le programme</p>
            <h2 className="ac-sous-titre">Cinq modules. Un seul profil d’écoute.</h2>
          </div>
          <p className="ac-section__note">
            Chaque module ajoute un signal au même profil. Aucun ne redemande ce que les autres ont
            déjà appris.
          </p>
        </div>

        <div className="ac-vedette">
          <button type="button" className="ac-vedette__carte" onClick={() => onModule('sons')}>
            <span className="ac-vedette__visuel" aria-hidden="true">
              <span className="ac-vedette__ondes">
                {Array.from({ length: 18 }, (_, index) => (
                  <i key={index} style={{ height: `${18 + ((index * 37) % 78)}%` }} />
                ))}
              </span>
              <span className="ac-vedette__num">01</span>
            </span>
            <span className="ac-vedette__texte">
              <span className="ac-eyebrow">Le cœur · module 01 · 2 min</span>
              <span className="ac-vedette__nom">Le test des 9 sons</span>
              <span className="ac-vedette__promesse">
                Neuf extraits courts, une réaction par extrait. ACCORD en déduit ta famille sonore et
                construit la playlist qui va avec.
              </span>
              <span className="ac-vedette__cta">Commencer par l’écoute →</span>
            </span>
          </button>
        </div>

        <div className="ac-grille-modules">
          {AUTRES.map((module) => {
            const nourri = profil ? (profil.modules[module.id] ?? 0) > 0 : false;
            return (
              <button
                key={module.id}
                type="button"
                className={`ac-module${nourri ? ' ac-module--nourri' : ''}`}
                onClick={() => onModule(module.id)}
              >
                <span className="ac-module__haut">
                  <span className="ac-module__num">Module {module.numero}</span>
                  <span className="ac-module__glyphe" aria-hidden="true">
                    {module.glyphe}
                  </span>
                </span>
                <span className="ac-module__nom">{module.nom}</span>
                <span className="ac-module__question">{module.question}</span>
                <span className="ac-module__bas">
                  <span className="ac-module__promesse">{module.promesse}</span>
                  <span className="ac-module__etat">{nourri ? 'nourri' : module.duree}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {profil && famille && (
        <section className="ac-section ac-echo">
          <div className="ac-echo__sceau">
            <SceauFamille famille={profil.famille} taille={92} />
          </div>
          <div>
            <p className="ac-eyebrow">Ton accord du moment</p>
            <h2 className="ac-sous-titre">{famille.nom}</h2>
            <p className="ac-intro">{famille.geste}</p>
          </div>
          <Bouton variante="fantome" onClick={onVoirProfil}>
            Voir ma carte sonore
          </Bouton>
        </section>
      )}

      <section className="ac-section ac-ethique">
        <div>
          <p className="ac-eyebrow">La règle du jeu</p>
          <h2 className="ac-sous-titre">Jamais de formulaire. Jamais quarante résultats.</h2>
        </div>
        <div className="ac-ethique__points">
          <p>
            <b>Un signal, une réponse.</b> Neuf sons donnent une famille et une playlist. Une voix
            donne trois envies. Un âge donne une sortie. Une journée donne une leçon.
          </p>
          <p>
            <b>Un seul profil.</b> Le test, la radio, la voix, le dimanche et la leçon nourrissent la
            même carte d’écoute. Rien ne se ressaisit.
          </p>
          <p>
            <b>Aucun son ne part.</b> Les extraits sont synthétisés dans ton navigateur. Sans clé,
            rien n’est envoyé ; avec une clé Mistral, seuls les textes nécessaires partent, en
            France.
          </p>
        </div>
        <Note>
          ACCORD ne cherche pas à te faire écouter plus longtemps. Elle cherche le son qui te laisse
          mieux qu’avant — et s’arrête quand elle l’a trouvé.
        </Note>
        <ReglageCle />
      </section>
    </div>
  );
}
