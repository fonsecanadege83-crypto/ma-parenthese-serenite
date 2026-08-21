# Sérénité — application de bien-être

Application web de bien-être mental au quotidien, construite avec React, TypeScript, Vite et Tailwind CSS v4. Toutes les données restent en local (`localStorage`) — aucun backend requis.

## Fonctionnalités

- **Onboarding** — création d'un profil léger (prénom).
- **Accueil** — salutation du jour, suivi d'humeur, citation du jour, série (streak) et accès rapide aux activités.
- **Respirer** — respiration guidée en carré (4-4-4-2) animée, 5 cycles.
- **Méditer** — minuteur de méditation avec durées prédéfinies (3 à 20 min) et carillon sonore de fin (synthétisé, sans fichier audio).
- **Journal** — journal de gratitude + note libre, avec historique.
- **Sons ambiants** — mixeur de paysages sonores (pluie, océan, vent, feu de camp), entièrement synthétisés en Web Audio, sans fichier audio.
- **Habitudes** — suivi quotidien d'habitudes bien-être (liste par défaut + ajout personnalisé), avec série par habitude.
- **Ressources** — conseils courts catégorisés (sommeil, stress, relations, énergie), avec recherche plein texte.
- **SOS / Ancrage rapide** — technique de mise à la terre 5-4-3-2-1 interactive pour un coup de stress, accessible en un geste depuis l'accueil.
- **Étirements** — séquence guidée de 6 mouvements doux avec minuteur auto-progressif.
- **Bilan de la semaine** — synthèse des 7 derniers jours : humeur dominante, répartition, séances, taux d'habitudes accomplies.
- **Profil** — statistiques (série, séances, minutes), historique d'humeur sur 14 jours, mode clair/sombre/système, export/import de sauvegarde (JSON), réinitialisation des données.
- **Partage** — pensée du jour et entrées de journal partageables via le partage natif (ou copie presse-papiers en repli).
- **Installable (PWA)** — ajoutable à l'écran d'accueil, fonctionne hors-ligne après un premier chargement.

## Développement

```bash
npm install
npm run dev       # serveur de dev
npm run build     # build de production (tsc + vite build)
npm run lint       # oxlint
```

## Stack

- React 19 + React Router 7
- TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Vite 8 + `vite-plugin-pwa` (service worker, manifest)
- Persistance : `localStorage` (namespace `serenite:`), exportable/importable en JSON
