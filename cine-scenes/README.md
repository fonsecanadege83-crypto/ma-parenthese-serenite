# CinéScènes IA

Application indépendante (Cloudflare Worker mono-fichier, comme `worker-parenthese-v15.js`) qui transforme une photo en scène vidéo cinématographique — **100% gratuite, sans API payante ni clé à configurer.**

## Comment ça marche (et pourquoi c'est gratuit)

Il n'existe pas aujourd'hui de fournisseur d'IA vidéo (fal.ai, Runway, Kling, Artlist...) proposant de la génération illimitée gratuite : ces modèles tournent sur des GPU coûteux et sont facturés à la génération.

À la place, l'app recrée l'effet "cinéma" par un procédé classique de montage, calculé **directement dans le navigateur** :
- travelling/zoom façon Ken Burns (le mouvement de caméra utilisé dans tous les documentaires et rétrospectives photo)
- étalonnage couleur façon film (chaud, noir & blanc contrasté, désaturé et onirique, etc. selon le style choisi)
- vignette, grain filmique animé, bandes noires façon cinémascope
- pour le style "Rêve Éthéré", des particules de lumière flottantes

Le résultat est filmé en direct via `canvas.captureStream()` + `MediaRecorder`, exporté en vidéo `.webm`. Aucune photo n'est envoyée à un serveur : tout se passe sur l'appareil de la personne qui utilise l'app, sauf si elle choisit explicitement de partager sa scène dans la galerie publique (auquel cas seule la vidéo finale, pas la photo d'origine, est stockée).

C'est une vraie technique de mise en scène cinéma (pas de génération de mouvement par IA façon Kling/Runway) : pas de personnes qui bougent dans l'image, mais un vrai rendu "scène de film" à partir d'une photo fixe.

## Fonctionnement technique

1. La photo est chargée localement dans une balise `<canvas>`.
2. `renderScene()` (dans `worker.js`, section frontend) anime zoom/travelling + filtres pendant 5 ou 10 secondes, en HD (720p) ou Full HD (1080p).
3. Le flux du canvas est enregistré en `.webm` via `MediaRecorder`.
4. La personne peut télécharger la vidéo, et/ou cliquer "Partager dans la galerie" pour l'envoyer à `POST /api/gallery-save`, qui la stocke dans R2.
5. `GET /api/gallery` liste les vidéos partagées (lecture directe du bucket R2, aucune base de données nécessaire).

## Mise en place

Le bucket R2 (`cine-scenes-media`, pour la galerie publique uniquement) a déjà été créé sur le compte Cloudflare. Il reste une seule étape, depuis le tableau de bord Cloudflare :

1. Sur [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Worker**.
2. Donnez-lui un nom, par ex. `cine-scenes-ia`, puis **Deploy**.
3. Cliquez **Edit code**, effacez tout, collez le contenu de `worker.js`. **Save and deploy**.
4. **Settings → Bindings** → ajoutez un binding **R2 Bucket** : nom `MEDIA` → bucket `cine-scenes-media`.

Aucun secret, aucune clé API, aucun compte tiers à créer. L'app est utilisable dès le déploiement.

*(La galerie partagée est optionnelle — sans le binding R2, tout fonctionne sauf le bouton "Partager dans la galerie".)*

## Limites à connaître

- Format d'export : `.webm` (lu nativement par tous les navigateurs et par VLC ; pas nativement par QuickTime/iMovie — une conversion en `.mp4` serait nécessaire pour du montage Apple).
- Nécessite un navigateur récent supportant `MediaRecorder` + `canvas.captureStream()` (Chrome, Edge, Firefox — support partiel sur anciennes versions de Safari).
- L'enregistrement dure aussi longtemps que la vidéo (5 ou 10 secondes réelles), puisqu'il s'agit d'un vrai tournage en temps réel du canvas.
- Ce n'est pas de la génération de mouvement par IA (les éléments de la photo ne "s'animent" pas eux-mêmes) : c'est un habillage cinéma (caméra + étalonnage) autour d'une photo fixe.

## Évolution possible (payante, optionnelle)

Si un budget devient acceptable plus tard, un vrai mouvement généré par IA (ex. via l'API de fal.ai, `queue.fal.run`, modèles Kling image-to-video) peut être ajouté comme option "Pro" à côté du rendu gratuit, sans toucher à l'existant.

## Personnalisation

- **Styles** : objets `STYLES` (métadonnées affichées) et `STYLE_RECIPES` (paramètres d'animation/filtre côté navigateur) dans `worker.js`.
- **Résolution** : toggle HD/Full HD dans l'interface, correspond aux dimensions du canvas de rendu.
