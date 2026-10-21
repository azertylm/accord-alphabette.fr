import type { Envie, Lecon, Profil } from './types';
import type { ResultatSons } from './profil';
import { FAMILLES } from './familles';

/**
 * La part Mistral d'ACCORD — IA souveraine, hébergée en France.
 *
 * La clé est optionnelle et reste dans ce navigateur (BYOK). Sans elle, tout
 * fonctionne : les neuf sons, la playlist, la sortie du dimanche, les envies et
 * la leçon sont calculés localement. Avec elle, Mistral écrit mieux — il ne
 * décide jamais seul de la famille sonore ni des liens.
 */

export const CLE_LS = 'accord.mistral-cle';
export const MODELE = 'mistral-small-latest';
const URL_CHAT = 'https://api.mistral.ai/v1/chat/completions';

export function lireCle(): string | null {
  try {
    const cle = localStorage.getItem(CLE_LS);
    return cle && cle.trim() ? cle.trim() : null;
  } catch {
    return null;
  }
}

export function ecrireCle(cle: string | null) {
  try {
    if (cle && cle.trim()) localStorage.setItem(CLE_LS, cle.trim());
    else localStorage.removeItem(CLE_LS);
  } catch {
    /* mode privé : la clé n'est simplement pas mémorisée. */
  }
}

async function demanderJson<T>(systeme: string, utilisateur: string): Promise<T> {
  const cle = lireCle();
  if (!cle) throw new Error('Aucune clé Mistral configurée.');

  const controleur = new AbortController();
  const minuterie = window.setTimeout(() => controleur.abort(), 24000);
  try {
    const reponse = await fetch(URL_CHAT, {
      method: 'POST',
      signal: controleur.signal,
      headers: {
        Authorization: `Bearer ${cle}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODELE,
        temperature: 0.55,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systeme },
          { role: 'user', content: utilisateur },
        ],
      }),
    });

    if (reponse.status === 401) throw new Error('Clé Mistral refusée (401). Vérifie-la dans « Clé IA ».');
    if (reponse.status === 429) throw new Error('Mistral est très sollicité (429). Le moteur local a pris le relais.');
    if (!reponse.ok) throw new Error(`Mistral n’a pas répondu (${reponse.status}). Le moteur local a pris le relais.`);

    const json = (await reponse.json()) as { choices?: { message?: { content?: string } }[] };
    const texte = json.choices?.[0]?.message?.content;
    if (!texte) throw new Error('Réponse de Mistral vide.');
    return JSON.parse(texte) as T;
  } catch (erreur) {
    if (erreur instanceof DOMException && erreur.name === 'AbortError') {
      throw new Error('Mistral met trop de temps à répondre. Le moteur local a pris le relais.');
    }
    throw erreur;
  } finally {
    window.clearTimeout(minuterie);
  }
}

const texte = (valeur: unknown, max = 220): string =>
  String(valeur ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

function urlPour(requete: string): string {
  const q = requete.trim();
  const lieu = /café|cafe|parc|musée|musee|balade|piscine|restaurant|jardin|librairie|cinéma|cinema|forêt|foret|plage|marché|marche/i.test(
    q,
  );
  return lieu
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
    : `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

/* ---------------------------------------------------------------------------
   Les 9 sons → une phrase qui nomme la famille sans la trahir
--------------------------------------------------------------------------- */

interface ReponseTest {
  phrase?: string;
  mots?: unknown;
}

const SYSTEME_TEST = `Tu es ACCORD, l'application de l'écosystème alphabette.fr qui écoute comment une personne réagit au son.
On te donne les extraits qu'elle a gardés et ceux qu'elle a écartés. La famille sonore est DÉJÀ déterminée par le moteur local : tu ne la changes pas, tu ne la contredis pas.
Tu réponds UNIQUEMENT par un objet JSON :
{"phrase": "28 à 42 mots, en français, tutoiement, qui dit ce que cette oreille cherche — sans flatterie, sans psychologie de comptoir", "mots": ["4 à 6 mots concrets, pas d'emoji"]}
Ne cite pas les noms des extraits un par un. Aucun emoji. Aucun anglais.`;

export async function enrichirTest(resultat: ResultatSons): Promise<{ phrase?: string; mots?: string[] }> {
  const famille = FAMILLES[resultat.famille];
  const reponse = await demanderJson<ReponseTest>(
    SYSTEME_TEST,
    `Famille déterminée : ${famille.nom} (${famille.sousTitre}).
Extraits gardés : ${resultat.aimes.join(', ') || 'aucun'}.
Extraits écartés : ${resultat.ecartes.join(', ') || 'aucun'}.
Axes mesurés : chaleur ${resultat.axes.chaleur}, mouvement ${resultat.axes.mouvement}, nature ${resultat.axes.nature}, densité ${resultat.axes.densite}, lumière ${resultat.axes.lumiere}.
Écris la phrase et les mots.`,
  );
  return {
    phrase: texte(reponse.phrase, 320) || undefined,
    mots: (Array.isArray(reponse.mots) ? (reponse.mots as unknown[]) : [])
      .map((mot) => texte(mot, 30))
      .filter(Boolean)
      .slice(0, 6),
  };
}

/* ---------------------------------------------------------------------------
   Voix → trois envies
--------------------------------------------------------------------------- */

interface ReponseVoix {
  envies?: { nom?: string; phrase?: string; action?: string; requete?: string }[];
}

const SYSTEME_VOIX = `Tu es ACCORD. L'utilisateur a parlé librement de sa journée pendant vingt secondes.
Tu repères les élans, les frustrations et les manques, puis tu en tires EXACTEMENT trois envies concrètes à satisfaire cette semaine.
Tu réponds uniquement par : {"envies":[{"nom":"1 à 2 mots","phrase":"12 à 20 mots, tutoiement","action":"4 à 7 mots, action concrète","requete":"recherche courte sans accents"}]}
Pas de psychologie de comptoir, pas de flatterie, pas de marque, pas d'emoji.`;

export async function enviesMistral(transcription: string): Promise<Envie[]> {
  const reponse = await demanderJson<ReponseVoix>(SYSTEME_VOIX, `Ce qu'il a dit :\n« ${transcription} »`);
  const envies = (Array.isArray(reponse.envies) ? reponse.envies : [])
    .map((envie, index) => {
      const nom = texte(envie.nom, 26);
      const phrase = texte(envie.phrase, 170);
      return {
        id: `mistral-${index}`,
        nom,
        phrase,
        action: texte(envie.action, 60),
        url: urlPour(texte(envie.requete, 80) || nom),
        source: 'mistral' as const,
      };
    })
    .filter((envie) => envie.nom && envie.phrase)
    .slice(0, 3);
  if (envies.length < 3) throw new Error('Mistral n’a pas proposé trois envies.');
  return envies;
}

/* ---------------------------------------------------------------------------
   Voix → texte (uniquement si une clé est fournie)
--------------------------------------------------------------------------- */

export async function transcrireAudio(audio: Blob): Promise<string> {
  const cle = lireCle();
  if (!cle) throw new Error('Aucune clé Mistral configurée.');
  const extension = audio.type.includes('ogg') ? 'ogg' : audio.type.includes('mp4') ? 'mp4' : 'webm';
  const corps = new FormData();
  corps.append('file', new File([audio], `journee.${extension}`, { type: audio.type || 'audio/webm' }));
  corps.append('model', 'voxtral-mini-latest');
  corps.append('language', 'fr');
  corps.append('temperature', '0');

  const controleur = new AbortController();
  const minuterie = window.setTimeout(() => controleur.abort(), 32000);
  try {
    const reponse = await fetch('https://api.mistral.ai/v1/audio/transcriptions', {
      method: 'POST',
      signal: controleur.signal,
      headers: { Authorization: `Bearer ${cle}` },
      body: corps,
    });
    if (reponse.status === 401) throw new Error('Clé Mistral refusée (401). Vérifie-la dans « Clé IA ».');
    if (reponse.status === 429) throw new Error('Mistral est très sollicité (429). Réessaie dans un instant.');
    if (!reponse.ok) throw new Error(`Transcription indisponible (${reponse.status}).`);
    const json = (await reponse.json()) as { text?: string };
    return texte(json.text, 2000);
  } finally {
    window.clearTimeout(minuterie);
  }
}

/* ---------------------------------------------------------------------------
   Dimanche → un conseil, jamais une autre sortie
--------------------------------------------------------------------------- */

export async function conseilDimanche(nom: string, ages: string, meteo: string): Promise<string> {
  const reponse = await demanderJson<{ conseil?: string }>(
    `Tu écris UNIQUEMENT un objet JSON {"conseil":"..."} avec un conseil de 16 à 26 mots, en français, tutoiement, concret, pour préparer une sortie du dimanche. Pas d'emoji, pas de marque, pas de nouveau lieu.`,
    `Sortie retenue : ${nom}. Âges des enfants : ${ages}. Météo : ${meteo}. Donne un conseil pratique.`,
  );
  return texte(reponse.conseil, 190);
}

/* ---------------------------------------------------------------------------
   Cinq minutes → une leçon sur mesure
--------------------------------------------------------------------------- */

interface ReponseLecon {
  titre?: string;
  domaine?: string;
  accroche?: string;
  paragraphes?: unknown;
  points?: unknown;
  anecdote?: string;
  action?: string;
  mots?: unknown;
}

const SYSTEME_LECON = `Tu écris une micro-leçon de cinq minutes pour ACCORD, l'application d'écoute de l'écosystème alphabette.fr.
La leçon doit être cultivée, précise, vérifiable, sans jargon inutile, et se lire en trois à quatre minutes. Elle part d'un détail concret et ouvre sur une idée plus large. Tutoiement.
Tu réponds UNIQUEMENT par un objet JSON :
{"titre":"...","domaine":"...","accroche":"une phrase de 12 à 22 mots","paragraphes":["3 paragraphes de 55 à 85 mots"],"points":["3 points de 10 à 18 mots"],"anecdote":"25 à 45 mots","action":"une action de 8 à 14 mots","mots":["4 mots-clés"]}
Aucun emoji, aucun anglais, aucune source inventée. Si tu n'es pas sûr d'un fait, choisis un fait sûr.`;

export async function leconMistral(profil: Profil): Promise<Lecon> {
  const famille = FAMILLES[profil.famille];
  const reponse = await demanderJson<ReponseLecon>(
    SYSTEME_LECON,
    `Famille sonore : ${famille.nom} (${famille.sousTitre}). Mots du profil : ${profil.mots.join(', ')}.
Choisis un sujet qui jouxte ce goût sans le répéter : ni une liste, ni un cours. Écris la leçon.`,
  );

  const paragraphes = (Array.isArray(reponse.paragraphes) ? (reponse.paragraphes as unknown[]) : [])
    .map((p) => texte(p, 700))
    .filter(Boolean)
    .slice(0, 4);
  const points = (Array.isArray(reponse.points) ? (reponse.points as unknown[]) : [])
    .map((p) => texte(p, 180))
    .filter(Boolean)
    .slice(0, 4);
  const titre = texte(reponse.titre, 90);
  if (!titre || paragraphes.length < 2) throw new Error('Leçon Mistral incomplète.');

  return {
    id: `mistral-${Date.now()}`,
    titre,
    domaine: texte(reponse.domaine, 40) || 'Culture',
    accroche: texte(reponse.accroche, 200),
    paragraphes,
    points,
    anecdote: texte(reponse.anecdote, 400),
    action: texte(reponse.action, 160),
    mots: (Array.isArray(reponse.mots) ? (reponse.mots as unknown[]) : [])
      .map((mot) => texte(mot, 30))
      .filter(Boolean)
      .slice(0, 5),
    familles: [profil.famille],
    source: 'mistral',
  };
}
