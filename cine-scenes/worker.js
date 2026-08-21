/**
 * CinéScènes IA — transforme une photo en scène vidéo cinématographique.
 *
 * Deux modes :
 *  - "Photo unique" (gratuit) : le tournage (travelling/zoom façon Ken Burns,
 *    étalonnage couleur, grain, vignette, format cinéma) est calculé et
 *    enregistré directement dans le navigateur (Canvas + MediaRecorder).
 *    Aucune API, aucune clé, la photo ne quitte jamais l'appareil.
 *  - "Avatar IA" (payant, ~0,15 $/scène) : une photo de référence (avatar)
 *    est replacée par l'IA (fal.ai, modèle Nano Banana Pro) dans un nouveau
 *    décor choisi ou décrit librement, en conservant l'identité de la
 *    personne. L'image obtenue passe ensuite par le même moteur de tournage
 *    gratuit ci-dessus pour devenir une vidéo — seule l'étape de génération
 *    d'image est facturée, jamais la vidéo.
 *
 * Bindings requis (voir wrangler.toml) :
 *   - MEDIA    : bucket R2 (photos, scènes générées, galerie)
 *   - JOBS_KV  : namespace KV (suivi des générations de scène en cours)
 * Secrets (mode Avatar IA uniquement) :
 *   - FAL_KEY  : clé API fal.ai (wrangler secret put FAL_KEY)
 *   - APP_PIN  : optionnel, code d'accès pour protéger le mode payant d'un
 *                déploiement public (wrangler secret put APP_PIN)
 */

const STYLES = {
  drone: { label: "Panoramique Drone", emoji: "🚁", desc: "Envolée large, sensation d'échelle épique" },
  closeup: { label: "Gros Plan Émotion", emoji: "🎭", desc: "Lent travelling avant, ambiance intime" },
  golden: { label: "Heure Dorée", emoji: "🌅", desc: "Lumière chaude, travelling doux" },
  noir: { label: "Noir & Mystère", emoji: "🕯️", desc: "Ombres dramatiques, noir et blanc contrasté" },
  dream: { label: "Rêve Éthéré", emoji: "✨", desc: "Mouvement flottant, particules de lumière" },
  action: { label: "Action Dynamique", emoji: "⚡", desc: "Caméra vive, énergie et intensité" },
};

const SCENES = {
  beach: { label: "Plage Tropicale", emoji: "🏖️", prompt: "on a tropical beach at golden sunset, turquoise ocean waves, palm trees swaying, warm cinematic light" },
  forest: { label: "Forêt Mystique", emoji: "🌲", prompt: "in a mystical misty forest, sunbeams filtering through tall trees, moss-covered ground, ethereal cinematic atmosphere" },
  city: { label: "Ville Nocturne", emoji: "🌃", prompt: "on a neon-lit city street at night in the rain, reflections on wet pavement, cinematic urban atmosphere" },
  desert: { label: "Désert Doré", emoji: "🏜️", prompt: "in a vast golden desert at sunset, dramatic dunes, warm orange sky, cinematic wide landscape" },
  mountain: { label: "Montagne Enneigée", emoji: "🏔️", prompt: "on a snow-covered mountain peak, dramatic clouds, crisp cold light, epic cinematic alpine landscape" },
  space: { label: "Station Spatiale", emoji: "🚀", prompt: "aboard a futuristic space station, looking out at stars and planets through a large window, sci-fi cinematic lighting" },
};

const FAL_SCENE_MODEL = "fal-ai/nano-banana-pro/edit";
const GALLERY_PREFIX = "gallery/";
const GALLERY_LIMIT = 60;
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === "/" && request.method === "GET") {
        return html(PAGE);
      }
      if (pathname.startsWith("/api/media/") && request.method === "GET") {
        return await handleMedia(pathname, env);
      }
      if (pathname === "/api/gallery-save" && request.method === "POST") {
        return await handleGallerySave(request, env);
      }
      if (pathname === "/api/gallery" && request.method === "GET") {
        return await handleGallery(env);
      }
      if (pathname === "/api/avatar/upload" && request.method === "POST") {
        return await handleAvatarUpload(request, env);
      }
      if (pathname === "/api/avatar/generate-scene" && request.method === "POST") {
        return await handleAvatarGenerateScene(request, env, url);
      }
      if (pathname.startsWith("/api/avatar/status/") && request.method === "GET") {
        return await handleAvatarStatus(pathname, env);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message || "Erreur interne" }, 500);
    }
  },
};

// ---------- Routes: media & gallery ----------

async function handleMedia(pathname, env) {
  const key = decodeURIComponent(pathname.replace("/api/media/", ""));
  const obj = await env.MEDIA.get(key);
  if (!obj) return json({ error: "Fichier introuvable." }, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}

async function handleGallerySave(request, env) {
  const form = await request.formData();
  const video = form.get("video");
  const thumb = form.get("thumb");
  const styleLabel = String(form.get("styleLabel") || "Scène").slice(0, 60);

  if (!video || typeof video === "string") {
    return json({ error: "Vidéo manquante." }, 400);
  }

  const id = crypto.randomUUID();
  await env.MEDIA.put(`${GALLERY_PREFIX}${id}.webm`, video.stream(), {
    httpMetadata: { contentType: "video/webm" },
    customMetadata: { styleLabel },
  });
  if (thumb && typeof thumb !== "string") {
    await env.MEDIA.put(`${GALLERY_PREFIX}${id}.jpg`, thumb.stream(), {
      httpMetadata: { contentType: "image/jpeg" },
    });
  }

  return json({ ok: true, id });
}

async function handleGallery(env) {
  const listed = await env.MEDIA.list({
    prefix: GALLERY_PREFIX,
    include: ["customMetadata"],
    limit: 1000,
  });

  const items = listed.objects
    .filter((o) => o.key.endsWith(".webm"))
    .map((o) => ({
      id: o.key.slice(GALLERY_PREFIX.length, -".webm".length),
      videoUrl: `/api/media/${o.key}`,
      thumbUrl: `/api/media/${o.key.replace(".webm", ".jpg")}`,
      styleLabel: (o.customMetadata && o.customMetadata.styleLabel) || "Scène",
      createdAt: o.uploaded,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, GALLERY_LIMIT);

  return json({ items });
}

// ---------- Routes: avatar mode (paid scene generation) ----------

function checkPin(request, env) {
  if (!env.APP_PIN) return true;
  const pin = request.headers.get("x-app-pin") || "";
  return pin === env.APP_PIN;
}

async function handleAvatarUpload(request, env) {
  const form = await request.formData();
  const file = form.get("photo");
  if (!file || typeof file === "string") {
    return json({ error: "Aucune photo reçue." }, 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return json({ error: "Format non supporté. Utilisez JPEG, PNG ou WebP." }, 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return json({ error: "Photo trop volumineuse (12 Mo max)." }, 400);
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const id = crypto.randomUUID();
  const key = `avatars/${id}.${ext}`;

  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type } });

  return json({ photoKey: key, previewUrl: `/api/media/${key}` });
}

async function handleAvatarGenerateScene(request, env, url) {
  if (!checkPin(request, env)) {
    return json({ error: "Code d'accès invalide." }, 403);
  }
  if (!env.FAL_KEY) {
    return json({ error: "Le mode Avatar IA n'est pas configuré côté serveur (FAL_KEY manquant)." }, 500);
  }
  if (!env.JOBS_KV) {
    return json({ error: "Le mode Avatar IA n'est pas configuré côté serveur (JOBS_KV manquant)." }, 500);
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.photoKey) {
    return json({ error: "Requête invalide." }, 400);
  }

  const scene = SCENES[body.sceneId];
  const customScene = String(body.customScene || "").trim().slice(0, 200);
  if (!scene && !customScene) {
    return json({ error: "Choisissez un décor ou décrivez-en un." }, 400);
  }

  const photoObj = await env.MEDIA.head(body.photoKey);
  if (!photoObj) {
    return json({ error: "Photo introuvable, veuillez la re-uploader." }, 404);
  }

  let prompt = "Place the person from the reference photo into a new scene";
  prompt += scene ? `: ${scene.prompt}.` : ".";
  if (customScene) prompt += ` ${customScene}.`;
  prompt += " Keep their face, identity and appearance exactly the same, photorealistic, cinematic lighting, high detail.";

  const imageUrl = `${url.origin}/api/media/${body.photoKey}`;

  const submitRes = await fetch(`https://queue.fal.run/${FAL_SCENE_MODEL}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, image_urls: [imageUrl] }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    return json({ error: `Échec de la génération (${submitRes.status}) : ${errText.slice(0, 300)}` }, 502);
  }

  const submitData = await submitRes.json();
  const jobId = crypto.randomUUID();
  const now = Date.now();

  const job = {
    id: jobId,
    status: "queued",
    sceneLabel: scene ? scene.label : "Décor personnalisé",
    falStatusUrl: submitData.status_url,
    falResponseUrl: submitData.response_url,
    createdAt: now,
    updatedAt: now,
  };

  await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job), { expirationTtl: 3600 });
  return json({ jobId, status: job.status });
}

async function handleAvatarStatus(pathname, env) {
  const jobId = pathname.replace("/api/avatar/status/", "");
  const raw = await env.JOBS_KV.get(`job:${jobId}`);
  if (!raw) return json({ error: "Génération introuvable ou expirée." }, 404);

  let job = JSON.parse(raw);
  if (job.status === "completed" || job.status === "failed") {
    return json(publicAvatarJob(job));
  }

  const statusRes = await fetch(job.falStatusUrl, { headers: { Authorization: `Key ${env.FAL_KEY}` } });
  if (!statusRes.ok) return json(publicAvatarJob(job));

  const statusData = await statusRes.json();

  if (statusData.status === "COMPLETED") {
    const resultRes = await fetch(job.falResponseUrl, { headers: { Authorization: `Key ${env.FAL_KEY}` } });
    if (!resultRes.ok) {
      job = { ...job, status: "failed", error: "Échec de récupération du résultat.", updatedAt: Date.now() };
      await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job), { expirationTtl: 3600 });
      return json(publicAvatarJob(job));
    }
    const resultData = await resultRes.json();
    const imgUrl = extractImageUrl(resultData);
    if (!imgUrl) {
      job = { ...job, status: "failed", error: "Aucune image dans le résultat.", updatedAt: Date.now() };
      await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job), { expirationTtl: 3600 });
      return json(publicAvatarJob(job));
    }

    const imgRes = await fetch(imgUrl);
    const imageKey = `scenes/${jobId}.jpg`;
    await env.MEDIA.put(imageKey, imgRes.body, { httpMetadata: { contentType: "image/jpeg" } });

    job = { ...job, status: "completed", imageKey, updatedAt: Date.now() };
    await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job), { expirationTtl: 3600 });
    return json(publicAvatarJob(job));
  }

  if (statusData.status === "ERROR" || statusData.status === "FAILED") {
    job = { ...job, status: "failed", error: "La génération a échoué.", updatedAt: Date.now() };
    await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job), { expirationTtl: 3600 });
    return json(publicAvatarJob(job));
  }

  job = { ...job, status: statusData.status === "IN_PROGRESS" ? "processing" : "queued", updatedAt: Date.now() };
  await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job), { expirationTtl: 3600 });
  return json(publicAvatarJob(job));
}

function extractImageUrl(data) {
  if (data?.images?.[0]?.url) return data.images[0].url;
  if (data?.image?.url) return data.image.url;
  if (data?.output?.images?.[0]?.url) return data.output.images[0].url;
  return null;
}

function publicAvatarJob(job) {
  return {
    id: job.id,
    status: job.status,
    sceneLabel: job.sceneLabel,
    error: job.error || null,
    imageUrl: job.imageKey ? `/api/media/${job.imageKey}` : null,
  };
}

// ---------- Helpers ----------

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function html(body) {
  return new Response(body, { headers: { "content-type": "text/html; charset=utf-8" } });
}

// ---------- Frontend ----------

const STYLE_CARDS = Object.entries(STYLES)
  .map(
    ([id, s]) => `
    <div class="style-card" data-style="${id}">
      <div class="style-emoji">${s.emoji}</div>
      <div class="style-label">${s.label}</div>
      <div class="style-desc">${s.desc}</div>
    </div>`
  )
  .join("");

const SCENE_CARDS = Object.entries(SCENES)
  .map(
    ([id, s]) => `
    <div class="style-card scene-card" data-scene="${id}">
      <div class="style-emoji">${s.emoji}</div>
      <div class="style-label">${s.label}</div>
    </div>`
  )
  .join("");

const PAGE = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>CinéScènes IA</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#0B0B0D; --bg2:#141416; --card:#1B1B1F; --card-b:rgba(255,255,255,0.06);
  --gold:#C9A227; --gold-l:#E4C55B; --text:#F2EFE9; --text-m:#B5AFA4; --text-l:#7A7468;
  --r:16px; --shadow:0 8px 30px rgba(0,0,0,0.4);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--bg);color:var(--text);min-height:100%;}
body{font-family:'Inter',sans-serif;padding-bottom:60px;}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,162,39,0.10) 0%,transparent 60%);pointer-events:none;z-index:0;}
.wrap{position:relative;z-index:1;max-width:520px;margin:0 auto;padding:0 18px;}
header{padding:44px 0 20px;text-align:center;}
header h1{font-family:'Playfair Display',serif;font-weight:600;font-size:30px;letter-spacing:0.01em;}
header h1 em{color:var(--gold);font-style:italic;}
header p{color:var(--text-m);font-size:13.5px;margin-top:8px;line-height:1.6;}
.badge{display:inline-block;margin-top:12px;padding:5px 14px;border-radius:100px;background:rgba(201,162,39,0.12);border:1px solid rgba(201,162,39,0.3);color:var(--gold-l);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;}

.mode-tabs{display:flex;gap:8px;margin-bottom:16px;}
.mode-tab{flex:1;padding:12px 8px;border-radius:12px;background:var(--card);border:1.5px solid var(--card-b);text-align:center;cursor:pointer;}
.mode-tab.sel{border-color:var(--gold);background:rgba(201,162,39,0.08);}
.mode-tab-title{font-size:13px;font-weight:600;}
.mode-tab-price{display:block;font-size:10px;color:var(--text-l);margin-top:2px;}
.mode-tab.sel .mode-tab-title{color:var(--gold-l);}

.card{background:var(--card);border:1px solid var(--card-b);border-radius:var(--r);box-shadow:var(--shadow);padding:20px;margin-bottom:16px;}
.section-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:var(--gold);margin-bottom:12px;}

#dropzone,#avatar-dropzone{border:1.5px dashed rgba(255,255,255,0.15);border-radius:12px;padding:28px 16px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;}
#dropzone:hover,#dropzone.drag,#avatar-dropzone:hover,#avatar-dropzone.drag{border-color:var(--gold);background:rgba(201,162,39,0.06);}
.dz-icon{font-size:30px;margin-bottom:8px;}
.dz-text{font-size:13.5px;color:var(--text-m);white-space:pre-line;}
#preview-wrap,#avatar-preview-wrap{display:none;position:relative;}
#preview-wrap.show,#avatar-preview-wrap.show{display:block;}
#preview,#avatar-preview{width:100%;border-radius:12px;display:block;max-height:340px;object-fit:cover;}
#preview-clear,#avatar-preview-clear{position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:14px;}
input[type=file]{display:none;}

.style-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.style-card{background:var(--bg2);border:1.5px solid var(--card-b);border-radius:12px;padding:14px 12px;cursor:pointer;transition:all .15s;}
.style-card.sel{border-color:var(--gold);background:rgba(201,162,39,0.08);}
.style-emoji{font-size:20px;margin-bottom:4px;}
.style-label{font-size:13.5px;font-weight:600;margin-bottom:2px;}
.style-desc{font-size:11.5px;color:var(--text-l);line-height:1.4;}

textarea{width:100%;background:var(--bg2);border:1.5px solid var(--card-b);border-radius:10px;padding:12px 14px;color:var(--text);font-family:'Inter',sans-serif;font-size:13.5px;resize:vertical;min-height:56px;outline:none;margin-top:10px;}
textarea:focus{border-color:var(--gold);}
input.pin-input{width:100%;background:var(--bg2);border:1.5px solid var(--card-b);border-radius:10px;padding:12px 14px;color:var(--text);font-family:'Inter',sans-serif;font-size:13.5px;outline:none;margin-top:10px;}
input.pin-input:focus{border-color:var(--gold);}

.row{display:flex;gap:10px;}
.toggle-group{display:flex;gap:8px;flex:1;}
.toggle{flex:1;padding:10px;border-radius:10px;background:var(--bg2);border:1.5px solid var(--card-b);text-align:center;font-size:12.5px;cursor:pointer;color:var(--text-m);}
.toggle.sel{border-color:var(--gold);color:var(--gold-l);background:rgba(201,162,39,0.08);}

.btn-main{width:100%;background:linear-gradient(135deg,var(--gold-l),var(--gold));color:#1a1400;border:none;border-radius:100px;padding:16px;font-family:'Playfair Display',serif;font-weight:600;font-size:16px;cursor:pointer;margin-top:6px;}
.btn-main:disabled{opacity:0.5;cursor:not-allowed;}

.status-block{display:none;text-align:center;margin-top:16px;}
.status-block.show{display:block;}
.spinner{width:36px;height:36px;border:3px solid rgba(201,162,39,0.2);border-top-color:var(--gold);border-radius:50%;margin:0 auto 14px;animation:spin 0.9s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.status-text{font-size:13.5px;color:var(--text-m);}
#progress-track{width:100%;height:4px;border-radius:4px;background:var(--bg2);margin-top:14px;overflow:hidden;}
#progress-bar{height:100%;width:0%;background:var(--gold);transition:width .1s linear;}

#result-card{display:none;}
#result-card.show{display:block;}
#result-video{width:100%;border-radius:12px;display:block;}
.result-actions{display:flex;gap:10px;margin-top:14px;}
.btn-sec{flex:1;padding:12px;border-radius:100px;background:var(--bg2);border:1.5px solid var(--card-b);color:var(--text);font-size:13px;text-align:center;cursor:pointer;text-decoration:none;}
.btn-sec.sel{border-color:var(--gold);color:var(--gold-l);}

.gallery-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.gallery-item{border-radius:12px;overflow:hidden;position:relative;cursor:pointer;background:var(--bg2);aspect-ratio:1;}
.gallery-item img,.gallery-item video{width:100%;height:100%;object-fit:cover;}
.gallery-item .g-lbl{position:absolute;bottom:0;left:0;right:0;padding:8px;font-size:10.5px;background:linear-gradient(transparent,rgba(0,0,0,0.75));color:#fff;}
.empty-note{color:var(--text-l);font-size:12.5px;text-align:center;padding:20px 0;}
.hint{color:var(--text-l);font-size:11px;margin-top:10px;line-height:1.5;}
#section-avatar{display:none;}
#scene-result-wrap{display:none;margin-top:14px;}
#scene-result-wrap.show{display:block;}
#scene-result-img{width:100%;border-radius:12px;display:block;}
#shared-section{opacity:0.4;pointer-events:none;transition:opacity .2s;}
#shared-section.unlocked{opacity:1;pointer-events:auto;}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Ciné<em>Scènes</em> IA</h1>
    <p>Transformez une photo en scène vidéo cinématographique</p>
    <div class="badge" id="mode-badge">100% gratuit · tournage dans votre navigateur</div>
  </header>

  <div class="mode-tabs">
    <div class="mode-tab sel" data-mode="free">
      <div class="mode-tab-title">Photo unique</div>
      <span class="mode-tab-price">Gratuit</span>
    </div>
    <div class="mode-tab" data-mode="avatar">
      <div class="mode-tab-title">Avatar IA</div>
      <span class="mode-tab-price">~0,15 $ / scène</span>
    </div>
  </div>

  <div id="section-free">
    <div class="card">
      <div class="section-lbl">Votre photo</div>
      <div id="dropzone">
        <div class="dz-icon">📷</div>
        <div class="dz-text">Touchez pour choisir une photo</div>
      </div>
      <div id="preview-wrap">
        <img id="preview" alt="Aperçu">
        <button id="preview-clear">✕</button>
      </div>
      <input type="file" id="file-input" accept="image/jpeg,image/png,image/webp">
      <div class="hint">Votre photo reste sur votre appareil : elle n'est jamais envoyée à un serveur, sauf si vous choisissez de partager la scène finale dans la galerie.</div>
    </div>
  </div>

  <div id="section-avatar">
    <div class="card">
      <div class="section-lbl">Votre avatar de référence</div>
      <div id="avatar-dropzone">
        <div class="dz-icon">🧑</div>
        <div class="dz-text">Touchez pour choisir une photo de vous (ou d'un personnage)</div>
      </div>
      <div id="avatar-preview-wrap">
        <img id="avatar-preview" alt="Aperçu avatar">
        <button id="avatar-preview-clear">✕</button>
      </div>
      <input type="file" id="avatar-file-input" accept="image/jpeg,image/png,image/webp">
      <div class="hint">Cette photo est envoyée à fal.ai (fournisseur IA) pour générer la nouvelle scène. Utilisez une photo nette du visage.</div>
    </div>

    <div class="card">
      <div class="section-lbl">Décor souhaité</div>
      <div class="style-grid">${SCENE_CARDS}</div>
      <textarea id="scene-custom" maxlength="200" placeholder="Ou décrivez librement un décor : &quot;au sommet d'un gratte-ciel au coucher du soleil&quot;..."></textarea>
      <input type="password" class="pin-input" id="pin-input" placeholder="Code d'accès (si configuré par l'administrateur)">
      <button class="btn-main" id="scene-generate-btn" disabled style="margin-top:14px;">Générer la scène (~0,15 $)</button>
      <div class="status-block" id="scene-status">
        <div class="spinner"></div>
        <div class="status-text" id="scene-status-text">Génération de la scène...</div>
      </div>
      <div id="scene-result-wrap">
        <img id="scene-result-img" alt="Scène générée">
      </div>
    </div>
  </div>

  <div id="shared-section">
    <div class="card">
      <div class="section-lbl">Style cinématographique</div>
      <div class="style-grid">${STYLE_CARDS}</div>
    </div>

    <div class="card">
      <div class="section-lbl">Réglages</div>
      <div class="row" style="margin-bottom:10px;">
        <div class="toggle-group" id="duration-group">
          <div class="toggle sel" data-duration="5">5 secondes</div>
          <div class="toggle" data-duration="10">10 secondes</div>
        </div>
      </div>
      <div class="row">
        <div class="toggle-group" id="quality-group">
          <div class="toggle sel" data-quality="hd">HD (720p)</div>
          <div class="toggle" data-quality="fhd">Full HD (1080p)</div>
        </div>
      </div>
    </div>

    <button class="btn-main" id="generate-btn" disabled>Créer la scène</button>

    <div class="card status-block" id="status-card">
      <div class="spinner"></div>
      <div class="status-text" id="status-text">Préparation...</div>
      <div id="progress-track"><div id="progress-bar"></div></div>
    </div>
  </div>

  <div class="card" id="result-card">
    <div class="section-lbl">Votre scène</div>
    <video id="result-video" controls autoplay loop muted playsinline></video>
    <div class="result-actions">
      <a class="btn-sec" id="download-link" download="cine-scene.webm">Télécharger</a>
      <div class="btn-sec" id="save-gallery-btn">Partager dans la galerie</div>
    </div>
    <div class="result-actions">
      <div class="btn-sec" id="new-scene-btn">Nouvelle scène</div>
    </div>
  </div>

  <div class="card">
    <div class="section-lbl">Galerie</div>
    <div class="gallery-grid" id="gallery-grid"></div>
    <div class="empty-note" id="gallery-empty" style="display:none;">Aucune scène partagée pour le moment.</div>
  </div>
</div>

<script>
var STYLE_RECIPES = {
  drone:   { scaleFrom:1.15, scaleTo:1.00, panFrom:{x:-0.15,y:0.08}, panTo:{x:0.15,y:-0.05}, filter:'contrast(1.08) saturate(1.15) brightness(1.03)', vignette:0.15, grain:0.04, glow:0 },
  closeup: { scaleFrom:1.00, scaleTo:1.22, panFrom:{x:0,y:0.02}, panTo:{x:0,y:-0.02}, filter:'contrast(1.05) saturate(1.05) sepia(0.08) brightness(1.02)', vignette:0.35, grain:0.05, glow:0.15 },
  golden:  { scaleFrom:1.05, scaleTo:1.18, panFrom:{x:-0.08,y:0}, panTo:{x:0.08,y:-0.03}, filter:'sepia(0.25) saturate(1.3) contrast(1.05) brightness(1.08)', vignette:0.2, grain:0.03, glow:0.25 },
  noir:    { scaleFrom:1.10, scaleTo:1.00, panFrom:{x:0.1,y:0}, panTo:{x:-0.1,y:0.05}, filter:'grayscale(1) contrast(1.35) brightness(0.95)', vignette:0.45, grain:0.08, glow:0 },
  dream:   { scaleFrom:1.00, scaleTo:1.12, panFrom:{x:0,y:0.05}, panTo:{x:0,y:-0.05}, filter:'saturate(0.9) contrast(0.95) brightness(1.1)', vignette:0.15, grain:0.02, glow:0.4, particles:true },
  action:  { scaleFrom:1.00, scaleTo:1.30, panFrom:{x:-0.05,y:0}, panTo:{x:0.05,y:0}, filter:'contrast(1.25) saturate(1.35)', vignette:0.25, grain:0.06, glow:0, shake:0.01 }
};

var state = {
  mode: 'free',
  file: null,
  avatarPhotoKey: null,
  sceneImageUrl: null,
  sceneLabel: null,
  styleId: null,
  duration: 5,
  quality: 'hd',
  lastBlob: null,
  lastThumb: null,
  lastStyleLabel: null
};

var modeBadge = document.getElementById('mode-badge');
var sectionFree = document.getElementById('section-free');
var sectionAvatar = document.getElementById('section-avatar');
var sharedSection = document.getElementById('shared-section');

var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('file-input');
var previewWrap = document.getElementById('preview-wrap');
var preview = document.getElementById('preview');
var previewClear = document.getElementById('preview-clear');

var avatarDropzone = document.getElementById('avatar-dropzone');
var avatarFileInput = document.getElementById('avatar-file-input');
var avatarPreviewWrap = document.getElementById('avatar-preview-wrap');
var avatarPreview = document.getElementById('avatar-preview');
var avatarPreviewClear = document.getElementById('avatar-preview-clear');
var sceneCustom = document.getElementById('scene-custom');
var pinInput = document.getElementById('pin-input');
var sceneGenerateBtn = document.getElementById('scene-generate-btn');
var sceneStatus = document.getElementById('scene-status');
var sceneStatusText = document.getElementById('scene-status-text');
var sceneResultWrap = document.getElementById('scene-result-wrap');
var sceneResultImg = document.getElementById('scene-result-img');

var generateBtn = document.getElementById('generate-btn');
var statusCard = document.getElementById('status-card');
var statusText = document.getElementById('status-text');
var progressBar = document.getElementById('progress-bar');
var resultCard = document.getElementById('result-card');
var resultVideo = document.getElementById('result-video');
var downloadLink = document.getElementById('download-link');
var saveGalleryBtn = document.getElementById('save-gallery-btn');

document.querySelectorAll('.mode-tab').forEach(function (el) {
  el.addEventListener('click', function () {
    document.querySelectorAll('.mode-tab').forEach(function (c) { c.classList.remove('sel'); });
    el.classList.add('sel');
    state.mode = el.dataset.mode;
    sectionFree.style.display = state.mode === 'free' ? 'block' : 'none';
    sectionAvatar.style.display = state.mode === 'avatar' ? 'block' : 'none';
    modeBadge.textContent = state.mode === 'free'
      ? '100% gratuit · tournage dans votre navigateur'
      : "~0,15 $ par scène générée (fal.ai) · tournage gratuit ensuite";
    updateGenerateState();
  });
});

dropzone.addEventListener('click', function () { fileInput.click(); });
fileInput.addEventListener('change', function () { if (fileInput.files[0]) selectPhoto(fileInput.files[0]); });
['dragover', 'dragleave', 'drop'].forEach(function (evt) {
  dropzone.addEventListener(evt, function (e) {
    e.preventDefault();
    dropzone.classList.toggle('drag', evt === 'dragover');
    if (evt === 'drop' && e.dataTransfer.files[0]) selectPhoto(e.dataTransfer.files[0]);
  });
});
previewClear.addEventListener('click', function (e) {
  e.stopPropagation();
  state.file = null;
  previewWrap.classList.remove('show');
  dropzone.style.display = 'block';
  updateGenerateState();
});

function selectPhoto(file) {
  if (!file.type || file.type.indexOf('image/') !== 0) {
    alert('Veuillez choisir une image (JPEG, PNG ou WebP).');
    return;
  }
  state.file = file;
  preview.src = URL.createObjectURL(file);
  previewWrap.classList.add('show');
  dropzone.style.display = 'none';
  updateGenerateState();
}

avatarDropzone.addEventListener('click', function () { avatarFileInput.click(); });
avatarFileInput.addEventListener('change', function () { if (avatarFileInput.files[0]) uploadAvatarPhoto(avatarFileInput.files[0]); });
['dragover', 'dragleave', 'drop'].forEach(function (evt) {
  avatarDropzone.addEventListener(evt, function (e) {
    e.preventDefault();
    avatarDropzone.classList.toggle('drag', evt === 'dragover');
    if (evt === 'drop' && e.dataTransfer.files[0]) uploadAvatarPhoto(e.dataTransfer.files[0]);
  });
});
avatarPreviewClear.addEventListener('click', function (e) {
  e.stopPropagation();
  state.avatarPhotoKey = null;
  avatarPreviewWrap.classList.remove('show');
  avatarDropzone.style.display = 'block';
  updateSceneGenerateState();
});

function uploadAvatarPhoto(file) {
  if (!file.type || file.type.indexOf('image/') !== 0) {
    alert('Veuillez choisir une image (JPEG, PNG ou WebP).');
    return;
  }
  var fd = new FormData();
  fd.append('photo', file);
  avatarDropzone.querySelector('.dz-text').textContent = 'Envoi en cours...';
  fetch('/api/avatar/upload', { method: 'POST', body: fd })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.error) throw new Error(data.error);
      state.avatarPhotoKey = data.photoKey;
      avatarPreview.src = data.previewUrl;
      avatarPreviewWrap.classList.add('show');
      avatarDropzone.style.display = 'none';
      updateSceneGenerateState();
    })
    .catch(function (err) { alert(err.message); })
    .finally(function () {
      avatarDropzone.querySelector('.dz-text').textContent = "Touchez pour choisir une photo de vous (ou d'un personnage)";
    });
}

document.querySelectorAll('.scene-card').forEach(function (el) {
  el.addEventListener('click', function () {
    document.querySelectorAll('.scene-card').forEach(function (c) { c.classList.remove('sel'); });
    el.classList.add('sel');
    updateSceneGenerateState();
  });
});
sceneCustom.addEventListener('input', updateSceneGenerateState);

function updateSceneGenerateState() {
  var sceneChosen = document.querySelector('.scene-card.sel') || sceneCustom.value.trim().length > 0;
  sceneGenerateBtn.disabled = !(state.avatarPhotoKey && sceneChosen);
}

sceneGenerateBtn.addEventListener('click', function () {
  sceneGenerateBtn.disabled = true;
  sceneResultWrap.classList.remove('show');
  sceneStatus.classList.add('show');
  sceneStatusText.textContent = 'Génération de la scène...';

  var selEl = document.querySelector('.scene-card.sel');
  var body = {
    photoKey: state.avatarPhotoKey,
    sceneId: selEl ? selEl.dataset.scene : null,
    customScene: sceneCustom.value.trim(),
  };

  fetch('/api/avatar/generate-scene', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-app-pin': pinInput.value },
    body: JSON.stringify(body),
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.error) throw new Error(data.error);
      return pollSceneStatus(data.jobId);
    })
    .catch(function (err) {
      sceneStatus.classList.remove('show');
      alert(err.message);
      sceneGenerateBtn.disabled = false;
    });
});

function pollSceneStatus(jobId) {
  var labels = { queued: 'En file d\\'attente...', processing: 'Composition de la scène...' };
  return fetch('/api/avatar/status/' + jobId).then(function (res) { return res.json(); }).then(function (data) {
    if (data.error) throw new Error(data.error);
    if (data.status === 'completed') {
      sceneStatus.classList.remove('show');
      state.sceneImageUrl = data.imageUrl;
      state.sceneLabel = data.sceneLabel;
      sceneResultImg.src = data.imageUrl;
      sceneResultWrap.classList.add('show');
      sceneGenerateBtn.disabled = false;
      sharedSection.classList.add('unlocked');
      updateGenerateState();
      sharedSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (data.status === 'failed') {
      sceneStatus.classList.remove('show');
      alert(data.error || 'La génération a échoué.');
      sceneGenerateBtn.disabled = false;
      return;
    }
    sceneStatusText.textContent = labels[data.status] || 'Traitement en cours...';
    return new Promise(function (resolve) { setTimeout(resolve, 2500); }).then(function () { return pollSceneStatus(jobId); });
  });
}

document.querySelectorAll('.style-card').forEach(function (el) {
  el.addEventListener('click', function () {
    document.querySelectorAll('.style-card').forEach(function (c) { c.classList.remove('sel'); });
    el.classList.add('sel');
    state.styleId = el.dataset.style;
    updateGenerateState();
  });
});
document.querySelectorAll('#duration-group .toggle').forEach(function (el) {
  el.addEventListener('click', function () {
    document.querySelectorAll('#duration-group .toggle').forEach(function (c) { c.classList.remove('sel'); });
    el.classList.add('sel');
    state.duration = parseInt(el.dataset.duration, 10);
  });
});
document.querySelectorAll('#quality-group .toggle').forEach(function (el) {
  el.addEventListener('click', function () {
    document.querySelectorAll('#quality-group .toggle').forEach(function (c) { c.classList.remove('sel'); });
    el.classList.add('sel');
    state.quality = el.dataset.quality;
  });
});

function updateGenerateState() {
  var hasSource = state.mode === 'free' ? !!state.file : !!state.sceneImageUrl;
  generateBtn.disabled = !(hasSource && state.styleId);
}

function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function createParticles(W, H) {
  var arr = [];
  for (var i = 0; i < 40; i++) {
    arr.push({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2.5, vy: -(8 + Math.random() * 15), phase: Math.random() * 1000 });
  }
  return arr;
}

function drawParticles(ctx, particles, elapsedMs, W, H) {
  ctx.save();
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    var y = ((p.y + p.vy * (elapsedMs / 1000)) % H + H) % H;
    var alpha = 0.25 + 0.25 * Math.sin((elapsedMs + p.phase) / 500);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = '#F2E6C9';
    ctx.beginPath();
    ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function makeGrainTile() {
  var c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  var gctx = c.getContext('2d');
  var data = gctx.createImageData(128, 128);
  for (var i = 0; i < data.data.length; i += 4) {
    var v = Math.random() * 255;
    data.data[i] = v; data.data[i + 1] = v; data.data[i + 2] = v; data.data[i + 3] = 255;
  }
  gctx.putImageData(data, 0, 0);
  return c;
}

function renderScene(img, styleId, durationSec, quality, onProgress, onDone, onError) {
  if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) {
    onError('Votre navigateur ne supporte pas l\\'enregistrement vidéo local. Essayez avec un navigateur récent (Chrome, Edge, Firefox).');
    return;
  }

  var recipe = STYLE_RECIPES[styleId];
  var W = quality === 'fhd' ? 1920 : 1280;
  var H = quality === 'fhd' ? 1080 : 720;

  var canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  var ctx = canvas.getContext('2d');

  var maxScale = Math.max(recipe.scaleFrom, recipe.scaleTo) * 1.15;
  var imgRatio = img.naturalWidth / img.naturalHeight;
  var canvasRatio = W / H;
  var baseW, baseH;
  if (imgRatio > canvasRatio) { baseH = H * maxScale; baseW = baseH * imgRatio; }
  else { baseW = W * maxScale; baseH = baseW / imgRatio; }
  var maxPanX = (baseW - W) / 2;
  var maxPanY = (baseH - H) / 2;

  var grainTile = makeGrainTile();
  var particles = recipe.particles ? createParticles(W, H) : null;

  var mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

  var stream = canvas.captureStream(30);
  var recorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType: mimeType, videoBitsPerSecond: quality === 'fhd' ? 8000000 : 4000000 });
  } catch (e) {
    onError('Impossible de démarrer l\\'enregistrement vidéo sur ce navigateur.');
    return;
  }

  var chunks = [];
  recorder.ondataavailable = function (e) { if (e.data.size > 0) chunks.push(e.data); };
  recorder.onstop = function () {
    var blob = new Blob(chunks, { type: 'video/webm' });
    canvas.toBlob(function (thumbBlob) { onDone(blob, thumbBlob); }, 'image/jpeg', 0.82);
  };

  var startTime = null;
  var durationMs = durationSec * 1000;

  function frame(ts) {
    if (!startTime) startTime = ts;
    var elapsed = ts - startTime;
    var t = Math.min(elapsed / durationMs, 1);
    var et = ease(t);
    onProgress(t);

    var scale = recipe.scaleFrom + (recipe.scaleTo - recipe.scaleFrom) * et;
    var scaleRatio = scale / maxScale;
    var panX = (recipe.panFrom.x + (recipe.panTo.x - recipe.panFrom.x) * et) * maxPanX;
    var panY = (recipe.panFrom.y + (recipe.panTo.y - recipe.panFrom.y) * et) * maxPanY;
    if (recipe.shake) {
      panX += (Math.random() - 0.5) * recipe.shake * W;
      panY += (Math.random() - 0.5) * recipe.shake * H;
    }

    var w = baseW * scaleRatio;
    var h = baseH * scaleRatio;
    var x = (W - w) / 2 + panX * scaleRatio;
    var y = (H - h) / 2 + panY * scaleRatio;

    ctx.save();
    ctx.filter = recipe.filter;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    if (recipe.glow) {
      ctx.save();
      ctx.globalAlpha = recipe.glow * 0.5;
      ctx.filter = 'blur(20px) brightness(1.3)';
      ctx.drawImage(img, x, y, w, h);
      ctx.restore();
    }

    if (particles) drawParticles(ctx, particles, elapsed, W, H);

    if (recipe.vignette) {
      var grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,' + recipe.vignette + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    if (recipe.grain) {
      ctx.save();
      ctx.globalAlpha = recipe.grain;
      ctx.globalCompositeOperation = 'overlay';
      var gx = Math.floor(Math.random() * 64), gy = Math.floor(Math.random() * 64);
      for (var py = -gy; py < H; py += 128) {
        for (var px = -gx; px < W; px += 128) ctx.drawImage(grainTile, px, py);
      }
      ctx.restore();
    }

    var bar = H * 0.06;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, bar);
    ctx.fillRect(0, H - bar, W, bar);

    if (t < 1) requestAnimationFrame(frame);
    else recorder.stop();
  }

  recorder.start();
  requestAnimationFrame(frame);
}

generateBtn.addEventListener('click', function () {
  generateBtn.disabled = true;
  resultCard.classList.remove('show');
  statusCard.classList.add('show');
  statusText.textContent = 'Le réalisateur IA prépare le tournage...';
  progressBar.style.width = '0%';

  var img = new Image();
  img.onload = function () {
    renderScene(img, state.styleId, state.duration, state.quality,
      function (t) {
        progressBar.style.width = Math.round(t * 100) + '%';
        statusText.textContent = 'Tournage en cours... ' + Math.round(t * 100) + '%';
      },
      function (videoBlob, thumbBlob) {
        statusCard.classList.remove('show');
        state.lastBlob = videoBlob;
        state.lastThumb = thumbBlob;
        state.lastStyleLabel = document.querySelector('.style-card.sel .style-label').textContent;
        var url = URL.createObjectURL(videoBlob);
        resultVideo.src = url;
        downloadLink.href = url;
        saveGalleryBtn.classList.remove('sel');
        saveGalleryBtn.textContent = 'Partager dans la galerie';
        resultCard.classList.add('show');
        generateBtn.disabled = false;
      },
      function (errMsg) {
        statusCard.classList.remove('show');
        alert(errMsg);
        generateBtn.disabled = false;
      }
    );
  };
  img.onerror = function () {
    statusCard.classList.remove('show');
    alert('Impossible de lire cette image.');
    generateBtn.disabled = false;
  };
  img.src = state.mode === 'free' ? URL.createObjectURL(state.file) : state.sceneImageUrl;
});

saveGalleryBtn.addEventListener('click', function () {
  if (!state.lastBlob) return;
  saveGalleryBtn.textContent = 'Envoi...';
  var fd = new FormData();
  fd.append('video', state.lastBlob, 'scene.webm');
  if (state.lastThumb) fd.append('thumb', state.lastThumb, 'thumb.jpg');
  fd.append('styleLabel', state.lastStyleLabel || 'Scène');
  fetch('/api/gallery-save', { method: 'POST', body: fd })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.ok) {
        saveGalleryBtn.textContent = 'Partagé ✓';
        saveGalleryBtn.classList.add('sel');
        loadGallery();
      } else {
        saveGalleryBtn.textContent = 'Échec, réessayer';
      }
    })
    .catch(function () { saveGalleryBtn.textContent = 'Échec, réessayer'; });
});

document.getElementById('new-scene-btn').addEventListener('click', function () {
  resultCard.classList.remove('show');
  previewWrap.classList.remove('show');
  dropzone.style.display = 'block';
  state.file = null;
  avatarPreviewWrap.classList.remove('show');
  avatarDropzone.style.display = 'block';
  state.avatarPhotoKey = null;
  state.sceneImageUrl = null;
  sceneResultWrap.classList.remove('show');
  sharedSection.classList.remove('unlocked');
  document.querySelectorAll('.style-card').forEach(function (c) { c.classList.remove('sel'); });
  document.querySelectorAll('.scene-card').forEach(function (c) { c.classList.remove('sel'); });
  sceneCustom.value = '';
  state.styleId = null;
  updateGenerateState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function loadGallery() {
  var grid = document.getElementById('gallery-grid');
  var empty = document.getElementById('gallery-empty');
  fetch('/api/gallery').then(function (res) { return res.json(); }).then(function (data) {
    grid.innerHTML = '';
    if (!data.items || !data.items.length) {
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    data.items.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'gallery-item';
      var video = document.createElement('video');
      video.src = item.videoUrl;
      video.muted = true; video.loop = true; video.playsInline = true;
      var lbl = document.createElement('div');
      lbl.className = 'g-lbl';
      lbl.textContent = item.styleLabel;
      div.appendChild(video);
      div.appendChild(lbl);
      div.addEventListener('mouseenter', function () { video.play(); });
      div.addEventListener('mouseleave', function () { video.pause(); });
      div.addEventListener('click', function () {
        resultVideo.src = item.videoUrl;
        downloadLink.href = item.videoUrl;
        resultCard.classList.add('show');
        resultCard.scrollIntoView({ behavior: 'smooth' });
      });
      grid.appendChild(div);
    });
  });
}

loadGallery();
</script>
</body>
</html>`;
