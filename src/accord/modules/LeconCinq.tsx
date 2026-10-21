import { useEffect, useMemo, useRef, useState } from 'react';
import { FAMILLES } from '../familles';
import { lireCle, leconMistral } from '../ia';
import { choisirLecon, leconEnRef } from '../lecons';
import type { Lecon } from '../types';
import type { ModuleId, Profil, Signal } from '../types';
import { Bouton, EnteteModule, Note, ReglageCle, SceauFamille } from '../ui';

function dureeLisible(secondes: number): string {
  const minutes = Math.floor(secondes / 60);
  const reste = Math.max(0, secondes % 60);
  return `${minutes}:${String(reste).padStart(2, '0')}`;
}

export function LeconCinq({
  profil,
  onProfil,
  onRetour,
  onVoirProfil,
  onModule,
}: {
  profil: Profil | null;
  onProfil: (signal: Signal, module: ModuleId) => void;
  onRetour: () => void;
  onVoirProfil: () => void;
  onModule: (id: ModuleId) => void;
}) {
  const initiale = useMemo(() => choisirLecon(profil), [profil?.famille]);
  const [lecon, setLecon] = useState<Lecon>(initiale);
  const [deja, setDeja] = useState(
    Boolean(profil?.lecon && profil.lecon.date === new Date().toISOString().slice(0, 10)),
  );
  const [termine, setTermine] = useState(
    Boolean(profil?.lecon && profil.lecon.date === new Date().toISOString().slice(0, 10)),
  );
  const [restant, setRestant] = useState(300);
  const [voix, setVoix] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const [surMesure, setSurMesure] = useState(false);

  const sauve = useRef(false);
  const jour = useMemo(
    () =>
      new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    [],
  );

  const famille = FAMILLES[profil?.famille ?? 'clairiere'];

  useEffect(() => {
    const minuteur = window.setInterval(() => {
      setRestant((valeur) => (valeur > 0 ? valeur - 1 : 0));
    }, 1000);
    return () => window.clearInterval(minuteur);
  }, []);

  useEffect(
    () => () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* pas de synthèse vocale. */
      }
    },
    [],
  );

  const lire = () => {
    if (!('speechSynthesis' in window)) {
      setErreur('La synthèse vocale n’est pas disponible dans ce navigateur. La lecture reste possible à l’écran.');
      return;
    }
    if (voix) {
      window.speechSynthesis.cancel();
      setVoix(false);
      return;
    }
    const texte = [
      lecon.titre,
      lecon.accroche,
      ...lecon.paragraphes,
      ...lecon.points,
      lecon.anecdote,
      lecon.action,
    ]
      .filter(Boolean)
      .join('. ');
    const utterance = new SpeechSynthesisUtterance(texte);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.onend = () => setVoix(false);
    utterance.onerror = () => setVoix(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setVoix(true);
  };

  const marquer = () => {
    if (sauve.current) return;
    sauve.current = true;
    setTermine(true);
    setDeja(true);
    onProfil(
      {
        lecon: leconEnRef(lecon),
        mots: lecon.mots,
        source: lecon.source,
        confiance: (profil?.confiance ?? 44) + 4,
      },
      'lecon',
    );
  };

  const demanderSurMesure = async () => {
    if (!profil) return;
    setChargement(true);
    setErreur(null);
    try {
      const nouvelle = await leconMistral(profil);
      setLecon(nouvelle);
      setSurMesure(true);
      setTermine(false);
      setDeja(false);
      sauve.current = false;
      setRestant(300);
    } catch (probleme) {
      setErreur(
        probleme instanceof Error
          ? probleme.message
          : 'Mistral n’a pas répondu. La leçon locale reste affichée.',
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="ac-page">
      <EnteteModule
        id="lecon"
        onRetour={onRetour}
        intro={
          <p className="ac-intro">
            Une seule micro-leçon par jour, choisie dans la zone proche de ce que tu aimes déjà.
            Jamais un cours, jamais un programme : cinq minutes, une idée, une action.
          </p>
        }
      />

      <div className="ac-lecon-meta">
        <span className="ac-etiquette">{jour}</span>
        <span className="ac-etiquette">{lecon.domaine}</span>
        <span className={`ac-etiquette${restant === 0 ? ' ac-etiquette--verte' : ''}`}>
          {restant === 0 ? 'les 5 minutes sont passées' : `${dureeLisible(restant)} restantes`}
        </span>
        {profil && (
          <span className="ac-etiquette ac-etiquette--accent">
            près de {famille.nom.toLowerCase()}
          </span>
        )}
      </div>

      {erreur && <p className="ac-erreur">{erreur}</p>}

      <article className="ac-lecon">
        <header className="ac-lecon__tete">
          <div className="ac-lecon__sceau">
            <SceauFamille famille={profil?.famille ?? 'clairiere'} taille={72} />
          </div>
          <div>
            <p className="ac-eyebrow">
              La leçon du jour · {lecon.source === 'mistral' ? 'Mistral, France' : 'bibliothèque locale'}
            </p>
            <h1 className="ac-lecon__titre">{lecon.titre}</h1>
            {lecon.accroche && <p className="ac-lecon__accroche">{lecon.accroche}</p>}
          </div>
        </header>

        <div className="ac-lecon__corps">
          {lecon.paragraphes.map((paragraphe, index) => (
            <p key={index} className={index === 0 ? 'ac-lecon__premier' : undefined}>
              {paragraphe}
            </p>
          ))}

          {lecon.points.length > 0 && (
            <div className="ac-lecon__points">
              <p className="ac-bloc__titre">À retenir</p>
              <ul>
                {lecon.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {lecon.anecdote && (
            <aside className="ac-lecon__anecdote">
              <p className="ac-bloc__titre">Le détail qui reste</p>
              <p>{lecon.anecdote}</p>
            </aside>
          )}

          {lecon.action && (
            <div className="ac-lecon__action">
              <p className="ac-eyebrow">À faire aujourd’hui</p>
              <p>{lecon.action}</p>
            </div>
          )}
        </div>
      </article>

      <div className="ac-actions">
        <Bouton variante="grand" onClick={lire}>
          {voix ? 'Arrêter la lecture' : 'Écouter en marchant'}
        </Bouton>
        <Bouton variante={termine ? 'fantome' : 'doux'} onClick={marquer} disabled={termine}>
          {termine ? 'Leçon marquée comme lue' : 'J’ai terminé'}
        </Bouton>
        <Bouton variante="lien" onClick={onVoirProfil}>
          Voir mon profil
        </Bouton>
      </div>

      <p className="ac-mini-note">
        La leçon est lue par la voix du navigateur, sans envoyer le texte à un service. Tu peux la
        reprendre plus tard : le profil garde seulement le titre et la date.
      </p>

      {termine && (
        <Note className="ac-lecon__demain">
          <strong>Demain, une autre.</strong> La prochaine leçon sera choisie dans la même zone de
          goût, sans répéter celle-ci. Rien à programmer.
          <div className="ac-actions">
            <Bouton variante="fantome" onClick={() => onModule('sons')}>
              Refaire le test des 9 sons
            </Bouton>
            {profil && (
              <Bouton variante="lien" onClick={() => onModule('radio')}>
                Écouter la radio de mes goûts
              </Bouton>
            )}
          </div>
        </Note>
      )}

      {!termine && deja && (
        <Note>
          Cette leçon était déjà marquée comme lue aujourd’hui. Tu peux la relire ou l’écouter, mais
          ACCORD ne compte qu’une leçon par jour.
        </Note>
      )}

      {profil && lireCle() && (
        <Note>
          <div className="ac-cle">
            <div>
              <strong>Une leçon sur mesure ?</strong> Mistral peut écrire la leçon du jour à partir de
              ta famille sonore et de tes mots. La bibliothèque locale reste la garantie hors ligne.
            </div>
            <Bouton variante="fantome" onClick={() => void demanderSurMesure()} disabled={chargement}>
              {chargement ? 'J’écris…' : surMesure ? 'Réécrire sur mesure' : 'Écrire sur mesure'}
            </Bouton>
          </div>
        </Note>
      )}

      {!lireCle() && <ReglageCle />}
    </div>
  );
}
