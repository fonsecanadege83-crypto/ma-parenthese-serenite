# CinéScènes IA

Application indépendante (Cloudflare Worker mono-fichier, comme `worker-parenthese-v15.js`) qui transforme une photo uploadée par l'utilisateur en scène vidéo cinématographique générée par IA.

## Pourquoi fal.ai et pas Artlist ?

L'API publique d'Artlist (`developer.artlist.io`) ne couvre aujourd'hui que le catalogue musical — pas de génération image/vidéo accessible en API REST avec une clé classique. La génération IA d'Artlist n'est disponible que via des intégrations comme celle-ci (assistant), pas par un serveur tiers.

Le backend utilise donc **[fal.ai](https://fal.ai)**, qui expose une vraie API REST (`queue.fal.run`) avec des modèles image-to-video de qualité cinéma (Kling). L'appel au fournisseur est isolé dans `handleGenerate` / `handleStatus` dans `worker.js` : le remplacer par un autre fournisseur (ou par Artlist, le jour où ils ouvrent une API de génération) ne touche que ces deux fonctions.

## Fonctionnement

1. L'utilisateur uploade une photo (`POST /api/upload`) → stockée dans R2.
2. Il choisit un style cinématographique (6 préréglages) + une touche de prompt libre optionnelle + durée (5/10s) + qualité (standard/pro).
3. `POST /api/generate` construit le prompt, soumet le job à fal.ai, enregistre l'état dans KV.
4. Le frontend interroge `GET /api/status/:jobId` toutes les 3s. Une fois terminé, la vidéo est téléchargée depuis fal.ai et stockée dans R2.
5. La scène apparaît dans la galerie (`GET /api/gallery`), consultable ensuite par tous les visiteurs de l'app.

## Mise en place

### 1. Créer les ressources Cloudflare

```bash
wrangler r2 bucket create cine-scenes-media
wrangler kv namespace create JOBS_KV
```

Copiez l'`id` renvoyé par la seconde commande dans `wrangler.toml` (`[[kv_namespaces]] id = "..."`).

### 2. Obtenir une clé fal.ai

Créez un compte sur [fal.ai](https://fal.ai/dashboard/keys) et générez une clé API.

```bash
wrangler secret put FAL_KEY
```

### 3. Déployer

```bash
wrangler deploy
```

## Personnalisation

- **Styles cinématographiques** : objet `STYLES` dans `worker.js` — chaque entrée a un `prompt` en anglais (les modèles vidéo répondent mieux en anglais) envoyé à fal.ai, et un `label`/`desc` en français affichés à l'écran.
- **Modèles** : objet `MODELS` — `standard` et `pro` pointent vers deux variantes Kling. Modifiable via les variables d'env `FAL_MODEL_STANDARD` / `FAL_MODEL_PRO` sans toucher au code.
- **Limites** : `MAX_UPLOAD_BYTES` (12 Mo) et `ALLOWED_TYPES` (JPEG/PNG/WebP) en tête de `worker.js`.

## Coûts

Chaque génération vidéo est facturée par fal.ai (variable selon modèle/durée — voir leur tableau de prix). Il n'y a pas de garde-fou de coût dans le code : à ajouter (quota par IP, limite quotidienne, etc.) avant une mise en production ouverte au public.
