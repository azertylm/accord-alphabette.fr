import type { AlphaAppConfig } from '@alphabette/shell';

/**
 * ACCORD — l'identité du site.
 *
 * Toute la palette (jour, nuit, densité, plein écran) dérive de `accent` via
 * les variables --ab-* de la base commune. Ne jamais coder une couleur d'UI
 * ailleurs que dans cette couleur d'identité.
 */
export const APP: AlphaAppConfig = {
  key: 'accord',
  name: 'ACCORD',
  tagline: 'CE QUI TE FAIT DU BIEN S’ENTEND',

  // Violet sonore : ni chaud, ni froid, la couleur d'une note tenue.
  accent: '#6d28d9',

  // Adresses publiques (sous-domaine + chemin sur alphabette.fr).
  subdomain: 'accord',
  homePath: '/accord',

  // Liens de l'écosystème : tarifs, dons et IBAN viennent du hub.
  donUrl: 'https://alphabette.fr/don',
  accountUrl: 'https://alphabette.fr/compte',
  apiKeysUrl: 'https://alphabette.fr/cles',

  // Le compteur (x/y) est calculé automatiquement depuis le registre central.
  // Ne jamais le coder en dur : il se décale à chaque nouvelle application.

  apiKeyState: 'ok',
  accountState: 'ok',
};
