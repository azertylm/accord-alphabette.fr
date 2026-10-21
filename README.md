# ACCORD

**CE QUI TE FAIT DU BIEN S’ENTEND**

Application de l'écosystème [alphabette.fr](https://alphabette.fr).

- Adresses : **https://accord.alphabette.fr** (sous-domaine) et
  **https://alphabette.fr/accord** (chemin).
- Base commune : [`@alphabette/shell`](https://alphabette.fr) — les deux barres du
  haut (écosystème + application), le thème jour/nuit, la densité et le plein écran.

## Démarrer

```powershell
bun install
bun run dev
```

## Structure

```
src/
  main.tsx            point d'entrée
  App.tsx             application enveloppée par <AppShell>
  alphabette.app.ts   identité du site (nom, sous-titre, couleur, liens)
  accord/             moteur de goût, sons, IA et cinq modules
  shell/              base commune @alphabette/shell (générée, à ne pas recoder)
```

## Les cinq modules

Un seul profil d'écoute circule entre les modules, sans formulaire.

1. **Le test des 9 sons** — neuf extraits de cinq secondes synthétisés dans le
   navigateur, une réaction par extrait, puis une famille sonore et une playlist.
2. **L'activité du dimanche** — un âge et un budget suffisent : météo réelle,
   sortie unique, fiche de réservation et invitation d'agenda.
3. **Ma voix suffit** — vingt secondes de parole libre (ou un repli écrit) et
   trois envies concrètes pour la semaine.
4. **La radio de mes goûts** — un flux continu sans bouton de lecture ; ce qui
   n'est pas zappé affine le profil.
5. **Cinq minutes** — une seule micro-leçon par jour, choisie près du goût déjà
   connu, lue par la voix du navigateur.

## Données et IA

Tout fonctionne sans réseau : les sons sont synthétisés par la Web Audio API,
le profil vit dans `localStorage`, les leçons et les sorties ont un catalogue
local. Mistral AI reste optionnel (BYOK, clé stockée dans ce navigateur) et ne
reçoit jamais la voix ni les sons : seuls les mots et les mesures lui sont
transmis, avec un repli local systématique.

## La base commune

Le contenu de l'application se place à l'intérieur de `<AppShell>` :

```tsx
<AppShell app={APP}>…contenu…</AppShell>
```

L'identité (nom, sous-titre, couleur, compteur, liens) se règle **uniquement**
dans `src/alphabette.app.ts`. Ne pas recoder les barres : elles viennent de la base.

## La copie de la base embarquée

`new:app` copie la dernière version de la base dans `src/shell/` : l'application
est autonome, `bun install && bun run dev` fonctionne immédiatement, sans liaison
locale. Le fichier `src/shell/.shell-version` mémorise la version embarquée.

Pour actualiser la base d'une application existante, depuis le dépôt du hub :

```powershell
bun run sync:shell <chemin-de-cette-application>
```
