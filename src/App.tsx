import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '@alphabette/shell';
import '@alphabette/shell/style.css';
import './accord/accord.css';
import { APP } from './alphabette.app';
import { ecrireProfil, fusionner, lireProfil, oublierProfil } from './accord/profil';
import type { ModuleId, Profil, Signal } from './accord/types';
import { Accueil } from './accord/modules/Accueil';
import { Dimanche } from './accord/modules/Dimanche';
import { LeconCinq } from './accord/modules/LeconCinq';
import { NeufSons } from './accord/modules/NeufSons';
import { Radio } from './accord/modules/Radio';
import { Voix } from './accord/modules/Voix';
import { VueProfil } from './accord/modules/VueProfil';

type Vue = 'accueil' | 'profil' | ModuleId;

/**
 * ACCORD — CE QUI TE FAIT DU BIEN S'ENTEND.
 *
 * Les deux barres viennent de <AppShell>. Ici, on ne fait qu'une chose : faire
 * circuler UN profil d'écoute entre cinq modules. Le test des neuf sons ouvre
 * le bal ; la radio, la voix, le dimanche et la leçon l'affinent sans jamais
 * redemander ce qui a déjà été appris.
 */
export function App() {
  const [vue, setVue] = useState<Vue>('accueil');
  const [profil, setProfil] = useState<Profil | null>(() => lireProfil());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [vue]);

  const surProfil = useCallback(
    (signal: Signal, module: ModuleId) => {
      setProfil((actuel) => {
        const suivant = fusionner(actuel, signal, module);
        ecrireProfil(suivant);
        return suivant;
      });
    },
    [],
  );

  const surOublier = useCallback(() => {
    oublierProfil();
    setProfil(null);
    setVue('accueil');
  }, []);

  const retour = useCallback(() => setVue('accueil'), []);
  const voirProfil = useCallback(() => setVue('profil'), []);
  const ouvrirModule = useCallback((id: ModuleId) => setVue(id), []);

  return (
    <AppShell app={APP}>
      {vue === 'accueil' && <Accueil profil={profil} onModule={ouvrirModule} onVoirProfil={voirProfil} />}

      {vue === 'profil' && (
        <VueProfil
          profil={profil}
          onRetour={retour}
          onModule={ouvrirModule}
          onOublier={surOublier}
        />
      )}

      {vue === 'sons' && (
        <NeufSons
          onProfil={surProfil}
          onRetour={retour}
          onVoirProfil={voirProfil}
          onModule={ouvrirModule}
        />
      )}

      {vue === 'dimanche' && (
        <Dimanche profil={profil} onProfil={surProfil} onRetour={retour} onVoirProfil={voirProfil} />
      )}

      {vue === 'voix' && (
        <Voix onProfil={surProfil} onRetour={retour} onVoirProfil={voirProfil} />
      )}

      {vue === 'radio' && (
        <Radio profil={profil} onProfil={surProfil} onRetour={retour} onVoirProfil={voirProfil} />
      )}

      {vue === 'lecon' && (
        <LeconCinq
          profil={profil}
          onProfil={surProfil}
          onRetour={retour}
          onVoirProfil={voirProfil}
          onModule={ouvrirModule}
        />
      )}
    </AppShell>
  );
}
