# CinéScènes IA

Application indépendante (Cloudflare Worker mono-fichier, comme `worker-parenthese-v15.js`) qui transforme une photo en scène vidéo cinématographique. Deux modes, dans la même app :

| Mode | Ce que ça fait | Coût |
|---|---|---|
| **Photo unique** | Anime *la photo exacte que vous uploadez* : travelling/zoom façon Ken Burns, étalonnage couleur, grain, vignette, bandes noires cinéma. Calculé et filmé entièrement dans le navigateur. | **Gratuit**, aucune clé, la photo ne quitte jamais l'appareil |
| **Avatar IA** | Prend une photo de référence (votre visage, un personnage) et la replace par l'IA dans un **nouveau décor** choisi ou décrit librement (plage, forêt, ville de nuit...), en conservant l'identité de la personne. L'image obtenue passe ensuite par le même moteur de tournage gratuit ci-dessus. | **~0,15 $ par scène générée** (fal.ai, modèle Nano Banana Pro) — le tournage vidéo lui-même reste gratuit |

## Pourquoi ce découpage payant/gratuit

Une vraie IA de génération vidéo (mouvement réaliste, personnes qui bougent) coûte cher car elle tourne sur des GPU facturés à la seconde de vidéo générée. Il n'existe pas d'équivalent gratuit et illimité chez un fournisseur sérieux.

Le compromis retenu ici : ne payer que pour la partie qui a vraiment besoin d'IA générative — **créer un nouveau décor autour de l'avatar** (une image, ~0,15 $) — et garder gratuite la partie "mise en scène cinéma" (travelling, étalonnage, grain), qui est calculée par un algorithme classique dans le navigateur, sans IA ni coût par génération.

## Fonctionnement technique

**Mode Photo unique** (voir commit précédent) : upload local → `renderScene()` anime l'image dans un `<canvas>` → enregistrement via `MediaRecorder` → `.webm` téléchargeable, partageable dans la galerie (`POST /api/gallery-save`, stocké dans R2).

**Mode Avatar IA** :
1. `POST /api/avatar/upload` : la photo de référence est envoyée au Worker et stockée dans R2 (nécessaire pour lui donner une URL publique que fal.ai peut aller chercher).
2. `POST /api/avatar/generate-scene` : le Worker appelle `fal-ai/nano-banana-pro/edit` (API `queue.fal.run`) avec la photo + un prompt décrivant le décor choisi, en lui demandant explicitement de conserver le visage et l'identité de la personne.
3. `GET /api/avatar/status/:jobId` (interrogé toutes les ~2,5 s par le navigateur) : suit l'avancement via KV, et une fois terminé télécharge l'image générée dans R2.
4. L'image obtenue est utilisée exactement comme une photo du mode gratuit : le navigateur applique dessus le style cinématographique choisi (travelling, couleur, grain) et enregistre la vidéo — cette étape ne coûte rien.

## Mise en place

Le bucket R2 (`cine-scenes-media`) et le namespace KV (`cine-scenes-jobs`, id déjà renseigné dans `wrangler.toml`) sont déjà créés sur le compte Cloudflare. Depuis le tableau de bord Cloudflare :

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Worker** → nommez-le (ex. `cine-scenes-ia`) → **Deploy**.
2. **Edit code** → effacez tout, collez le contenu de `worker.js` → **Save and deploy**.
3. **Settings → Bindings** → ajoutez :
   - **R2 Bucket** : nom `MEDIA` → bucket `cine-scenes-media`
   - **KV Namespace** : nom `JOBS_KV` → namespace `cine-scenes-jobs`

À ce stade, **le mode gratuit "Photo unique" fonctionne déjà**, sans rien de plus.

### Pour activer le mode Avatar IA (payant, optionnel)

4. Créez un compte sur [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys), générez une clé API.
5. **Settings → Variables and Secrets** → ajoutez un secret `FAL_KEY` avec cette clé.
6. **Fortement recommandé si l'app est publique** : ajoutez aussi un secret `APP_PIN` (un code que vous choisissez, ex. `4821`) — sans ça, n'importe quel visiteur de l'URL publique pourrait générer des scènes et dépenser votre crédit fal.ai. Une fois ce secret défini, l'app demande ce code avant chaque génération payante.

## Limites à connaître

- Vidéo exportée en `.webm` (natif dans les navigateurs et VLC ; pas dans QuickTime/iMovie sans conversion).
- Nécessite un navigateur récent (`MediaRecorder` + `canvas.captureStream()` — Chrome, Edge, Firefox).
- Mode Avatar IA : la fidélité du visage dépend de la netteté de la photo de référence ; ce n'est pas garanti à 100 % (limite de tout modèle de ce type).
- Sans `APP_PIN`, le mode payant est ouvert à quiconque visite l'URL — à protéger avant tout déploiement public.

## Personnalisation

- **Styles cinématographiques** (mouvement de caméra) : `STYLES` + `STYLE_RECIPES` dans `worker.js`.
- **Décors IA** (mode Avatar) : objet `SCENES` dans `worker.js` — chaque entrée a un `prompt` anglais envoyé à fal.ai.
- **Modèle de génération d'image** : constante `FAL_SCENE_MODEL` (actuellement `fal-ai/nano-banana-pro/edit`) — remplaçable par `fal-ai/nano-banana/edit` (version de base, moins chère) si besoin de réduire encore le coût.
