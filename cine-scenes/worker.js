/**
 * CinéScènes IA — transforme une photo en scène vidéo cinématographique.
 *
 * Backend de génération : fal.ai (queue.fal.run), modèles Kling image-to-video.
 * Stockage : R2 (photos + vidéos), KV (état des jobs + index de galerie).
 *
 * Bindings requis (voir wrangler.toml) :
 *   - MEDIA    : bucket R2
 *   - JOBS_KV  : namespace KV
 *   - FAL_KEY  : secret (wrangler secret put FAL_KEY)
 */

const MODELS = {
  standard: { envKey: "FAL_MODEL_STANDARD", label: "Standard", fallback: "fal-ai/kling-video/v1.6/standard/image-to-video" },
  pro: { envKey: "FAL_MODEL_PRO", label: "Pro", fallback: "fal-ai/kling-video/v1.6/pro/image-to-video" },
};

const STYLES = {
  drone: {
    label: "Panoramique Drone",
    emoji: "🚁",
    desc: "Envolée aérienne ample, sensation d'échelle épique",
    prompt: "Sweeping aerial drone camera movement slowly rising and panning, epic cinematic scale, wide dynamic range, subtle motion parallax, film grain, professional color grading",
  },
  closeup: {
    label: "Gros Plan Émotion",
    emoji: "🎭",
    desc: "Lent travelling avant, profondeur de champ cinéma",
    prompt: "Slow emotional push-in camera movement, shallow depth of field, soft cinematic bokeh, subtle natural movement in hair and fabric, intimate mood, 35mm film look",
  },
  golden: {
    label: "Heure Dorée",
    emoji: "🌅",
    desc: "Lumière chaude, travelling doux, ambiance chaleureuse",
    prompt: "Warm golden hour lighting, gentle dolly camera movement, soft lens flare, glowing rim light, dreamy warm color grade, cinematic atmosphere",
  },
  noir: {
    label: "Noir & Mystère",
    emoji: "🕯️",
    desc: "Ombres dramatiques, ambiance film noir",
    prompt: "Dramatic film noir lighting with deep shadows, slow mysterious camera pan, high contrast black and white cinematic tones, subtle fog, suspenseful atmosphere",
  },
  dream: {
    label: "Rêve Éthéré",
    emoji: "✨",
    desc: "Mouvement flottant, lumière douce, particules en suspension",
    prompt: "Ethereal dreamlike slow motion, floating particles of light drifting through frame, soft diffused glow, gentle camera drift, otherworldly serene mood",
  },
  action: {
    label: "Action Dynamique",
    emoji: "⚡",
    desc: "Caméra vive, énergie et intensité",
    prompt: "Dynamic energetic camera movement with a subtle dramatic push, heightened contrast, punchy cinematic color grade, sense of tension and momentum",
  },
};

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const GALLERY_KEY = "gallery:index";
const GALLERY_LIMIT = 60;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === "/" && request.method === "GET") {
        return html(PAGE);
      }
      if (pathname === "/api/upload" && request.method === "POST") {
        return await handleUpload(request, env);
      }
      if (pathname.startsWith("/api/media/") && request.method === "GET") {
        return await handleMedia(pathname, env);
      }
      if (pathname === "/api/generate" && request.method === "POST") {
        return await handleGenerate(request, env, url);
      }
      if (pathname.startsWith("/api/status/") && request.method === "GET") {
        return await handleStatus(pathname, env);
      }
      if (pathname === "/api/gallery" && request.method === "GET") {
        return await handleGallery(env);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message || "Erreur interne" }, 500);
    }
  },
};

// ---------- Routes ----------

async function handleUpload(request, env) {
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
  const key = `uploads/${id}.${ext}`;

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return json({ photoKey: key, previewUrl: `/api/media/${key}` });
}

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

async function handleGenerate(request, env, url) {
  if (!env.FAL_KEY) {
    return json({ error: "FAL_KEY n'est pas configuré côté serveur." }, 500);
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.photoKey) {
    return json({ error: "Requête invalide." }, 400);
  }

  const style = STYLES[body.styleId];
  if (!style) {
    return json({ error: "Style inconnu." }, 400);
  }

  const modelChoice = MODELS[body.model] ? body.model : "standard";
  const modelId = env[MODELS[modelChoice].envKey] || MODELS[modelChoice].fallback;

  const duration = body.duration === "10" ? "10" : "5";

  const photoObj = await env.MEDIA.head(body.photoKey);
  if (!photoObj) {
    return json({ error: "Photo introuvable, veuillez la re-uploader." }, 404);
  }

  const customPrompt = (body.customPrompt || "").trim().slice(0, 300);
  const prompt = [style.prompt, customPrompt].filter(Boolean).join(". ");
  const imageUrl = `${url.origin}/api/media/${body.photoKey}`;

  const submitRes = await fetch(`https://queue.fal.run/${modelId}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, image_url: imageUrl, duration }),
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
    photoKey: body.photoKey,
    styleId: body.styleId,
    styleLabel: style.label,
    model: modelChoice,
    duration,
    prompt,
    falRequestId: submitData.request_id,
    falStatusUrl: submitData.status_url,
    falResponseUrl: submitData.response_url,
    createdAt: now,
    updatedAt: now,
  };

  await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
  return json({ jobId, status: job.status });
}

async function handleStatus(pathname, env) {
  const jobId = pathname.replace("/api/status/", "");
  const raw = await env.JOBS_KV.get(`job:${jobId}`);
  if (!raw) return json({ error: "Génération introuvable." }, 404);

  let job = JSON.parse(raw);
  if (job.status === "completed" || job.status === "failed") {
    return json(publicJob(job));
  }

  const statusRes = await fetch(job.falStatusUrl, {
    headers: { Authorization: `Key ${env.FAL_KEY}` },
  });

  if (!statusRes.ok) {
    return json(publicJob(job));
  }

  const statusData = await statusRes.json();

  if (statusData.status === "COMPLETED") {
    const resultRes = await fetch(job.falResponseUrl, {
      headers: { Authorization: `Key ${env.FAL_KEY}` },
    });
    if (!resultRes.ok) {
      job = { ...job, status: "failed", error: "Échec de récupération du résultat.", updatedAt: Date.now() };
      await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
      return json(publicJob(job));
    }
    const resultData = await resultRes.json();
    const videoUrl = resultData?.video?.url;
    if (!videoUrl) {
      job = { ...job, status: "failed", error: "Aucune vidéo dans le résultat.", updatedAt: Date.now() };
      await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
      return json(publicJob(job));
    }

    const videoRes = await fetch(videoUrl);
    const videoKey = `videos/${jobId}.mp4`;
    await env.MEDIA.put(videoKey, videoRes.body, {
      httpMetadata: { contentType: "video/mp4" },
    });

    job = { ...job, status: "completed", videoKey, updatedAt: Date.now() };
    await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
    await addToGallery(env, job);
    return json(publicJob(job));
  }

  if (statusData.status === "ERROR" || statusData.status === "FAILED") {
    job = { ...job, status: "failed", error: "La génération a échoué.", updatedAt: Date.now() };
    await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
    return json(publicJob(job));
  }

  job = {
    ...job,
    status: statusData.status === "IN_PROGRESS" ? "processing" : "queued",
    updatedAt: Date.now(),
  };
  await env.JOBS_KV.put(`job:${jobId}`, JSON.stringify(job));
  return json(publicJob(job));
}

async function handleGallery(env) {
  const raw = await env.JOBS_KV.get(GALLERY_KEY);
  const entries = raw ? JSON.parse(raw) : [];
  return json({ items: entries });
}

// ---------- Helpers ----------

function publicJob(job) {
  return {
    id: job.id,
    status: job.status,
    styleLabel: job.styleLabel,
    error: job.error || null,
    videoUrl: job.videoKey ? `/api/media/${job.videoKey}` : null,
  };
}

async function addToGallery(env, job) {
  const raw = await env.JOBS_KV.get(GALLERY_KEY);
  const entries = raw ? JSON.parse(raw) : [];
  entries.unshift({
    id: job.id,
    styleLabel: job.styleLabel,
    photoUrl: `/api/media/${job.photoKey}`,
    videoUrl: `/api/media/${job.videoKey}`,
    createdAt: job.createdAt,
  });
  await env.JOBS_KV.put(GALLERY_KEY, JSON.stringify(entries.slice(0, GALLERY_LIMIT)));
}

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
header{padding:44px 0 24px;text-align:center;}
header h1{font-family:'Playfair Display',serif;font-weight:600;font-size:30px;letter-spacing:0.01em;}
header h1 em{color:var(--gold);font-style:italic;}
header p{color:var(--text-m);font-size:13.5px;margin-top:8px;line-height:1.6;}

.card{background:var(--card);border:1px solid var(--card-b);border-radius:var(--r);box-shadow:var(--shadow);padding:20px;margin-bottom:16px;}
.section-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:var(--gold);margin-bottom:12px;}

#dropzone{border:1.5px dashed rgba(255,255,255,0.15);border-radius:12px;padding:28px 16px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;}
#dropzone:hover,#dropzone.drag{border-color:var(--gold);background:rgba(201,162,39,0.06);}
#dropzone .dz-icon{font-size:30px;margin-bottom:8px;}
#dropzone .dz-text{font-size:13.5px;color:var(--text-m);}
#preview-wrap{display:none;position:relative;}
#preview-wrap.show{display:block;}
#preview{width:100%;border-radius:12px;display:block;max-height:340px;object-fit:cover;}
#preview-clear{position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:14px;}
input[type=file]{display:none;}

.style-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.style-card{background:var(--bg2);border:1.5px solid var(--card-b);border-radius:12px;padding:14px 12px;cursor:pointer;transition:all .15s;}
.style-card.sel{border-color:var(--gold);background:rgba(201,162,39,0.08);}
.style-emoji{font-size:20px;margin-bottom:4px;}
.style-label{font-size:13.5px;font-weight:600;margin-bottom:2px;}
.style-desc{font-size:11.5px;color:var(--text-l);line-height:1.4;}

textarea{width:100%;background:var(--bg2);border:1.5px solid var(--card-b);border-radius:10px;padding:12px 14px;color:var(--text);font-family:'Inter',sans-serif;font-size:13.5px;resize:vertical;min-height:60px;outline:none;}
textarea:focus{border-color:var(--gold);}

.row{display:flex;gap:10px;}
.toggle-group{display:flex;gap:8px;flex:1;}
.toggle{flex:1;padding:10px;border-radius:10px;background:var(--bg2);border:1.5px solid var(--card-b);text-align:center;font-size:12.5px;cursor:pointer;color:var(--text-m);}
.toggle.sel{border-color:var(--gold);color:var(--gold-l);background:rgba(201,162,39,0.08);}

#generate-btn{width:100%;background:linear-gradient(135deg,var(--gold-l),var(--gold));color:#1a1400;border:none;border-radius:100px;padding:16px;font-family:'Playfair Display',serif;font-weight:600;font-size:16px;cursor:pointer;margin-top:6px;}
#generate-btn:disabled{opacity:0.5;cursor:not-allowed;}

#status-card{display:none;text-align:center;}
#status-card.show{display:block;}
.spinner{width:36px;height:36px;border:3px solid rgba(201,162,39,0.2);border-top-color:var(--gold);border-radius:50%;margin:0 auto 14px;animation:spin 0.9s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
#status-text{font-size:13.5px;color:var(--text-m);}

#result-card{display:none;}
#result-card.show{display:block;}
#result-video{width:100%;border-radius:12px;display:block;}
.result-actions{display:flex;gap:10px;margin-top:14px;}
.btn-sec{flex:1;padding:12px;border-radius:100px;background:var(--bg2);border:1.5px solid var(--card-b);color:var(--text);font-size:13px;text-align:center;cursor:pointer;text-decoration:none;}

.gallery-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.gallery-item{border-radius:12px;overflow:hidden;position:relative;cursor:pointer;background:var(--bg2);aspect-ratio:1;}
.gallery-item img,.gallery-item video{width:100%;height:100%;object-fit:cover;}
.gallery-item .g-lbl{position:absolute;bottom:0;left:0;right:0;padding:8px;font-size:10.5px;background:linear-gradient(transparent,rgba(0,0,0,0.75));color:#fff;}
.empty-note{color:var(--text-l);font-size:12.5px;text-align:center;padding:20px 0;}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Ciné<em>Scènes</em> IA</h1>
    <p>Transformez une photo en scène vidéo cinématographique grâce à l'IA</p>
  </header>

  <div class="card">
    <div class="section-lbl">Votre photo</div>
    <div id="dropzone">
      <div class="dz-icon">📷</div>
      <div class="dz-text">Touchez pour choisir une photo<br>JPEG, PNG ou WebP · 12 Mo max</div>
    </div>
    <div id="preview-wrap">
      <img id="preview" alt="Aperçu">
      <button id="preview-clear">✕</button>
    </div>
    <input type="file" id="file-input" accept="image/jpeg,image/png,image/webp">
  </div>

  <div class="card">
    <div class="section-lbl">Style cinématographique</div>
    <div class="style-grid">${STYLE_CARDS}</div>
  </div>

  <div class="card">
    <div class="section-lbl">Touche personnelle (optionnel)</div>
    <textarea id="custom-prompt" maxlength="300" placeholder="Ex : ambiance mer et vent léger, robe qui flotte..."></textarea>
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
      <div class="toggle-group" id="model-group">
        <div class="toggle sel" data-model="standard">Standard</div>
        <div class="toggle" data-model="pro">Pro (qualité +)</div>
      </div>
    </div>
  </div>

  <button id="generate-btn" disabled>Créer la scène</button>

  <div class="card" id="status-card">
    <div class="spinner"></div>
    <div id="status-text">Préparation...</div>
  </div>

  <div class="card" id="result-card">
    <div class="section-lbl">Votre scène</div>
    <video id="result-video" controls autoplay loop muted playsinline></video>
    <div class="result-actions">
      <a class="btn-sec" id="download-link" download>Télécharger</a>
      <div class="btn-sec" id="new-scene-btn">Nouvelle scène</div>
    </div>
  </div>

  <div class="card">
    <div class="section-lbl">Galerie</div>
    <div class="gallery-grid" id="gallery-grid"></div>
    <div class="empty-note" id="gallery-empty" style="display:none;">Aucune scène pour le moment.</div>
  </div>
</div>

<script>
const state = { photoKey: null, styleId: null, duration: "5", model: "standard" };

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const previewWrap = document.getElementById('preview-wrap');
const preview = document.getElementById('preview');
const previewClear = document.getElementById('preview-clear');
const generateBtn = document.getElementById('generate-btn');
const statusCard = document.getElementById('status-card');
const statusText = document.getElementById('status-text');
const resultCard = document.getElementById('result-card');
const resultVideo = document.getElementById('result-video');
const downloadLink = document.getElementById('download-link');

dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files[0]) uploadPhoto(fileInput.files[0]); });
['dragover','dragleave','drop'].forEach(evt => {
  dropzone.addEventListener(evt, e => {
    e.preventDefault();
    dropzone.classList.toggle('drag', evt === 'dragover');
    if (evt === 'drop' && e.dataTransfer.files[0]) uploadPhoto(e.dataTransfer.files[0]);
  });
});
previewClear.addEventListener('click', e => {
  e.stopPropagation();
  state.photoKey = null;
  previewWrap.classList.remove('show');
  dropzone.style.display = 'block';
  updateGenerateState();
});

async function uploadPhoto(file) {
  const fd = new FormData();
  fd.append('photo', file);
  dropzone.querySelector('.dz-text').textContent = 'Envoi en cours...';
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Échec de l\\'envoi');
    state.photoKey = data.photoKey;
    preview.src = data.previewUrl;
    previewWrap.classList.add('show');
    dropzone.style.display = 'none';
  } catch (err) {
    alert(err.message);
  } finally {
    dropzone.querySelector('.dz-text').textContent = 'Touchez pour choisir une photo\\nJPEG, PNG ou WebP · 12 Mo max';
  }
  updateGenerateState();
}

document.querySelectorAll('.style-card').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.style-card').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    state.styleId = el.dataset.style;
    updateGenerateState();
  });
});

document.querySelectorAll('#duration-group .toggle').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('#duration-group .toggle').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    state.duration = el.dataset.duration;
  });
});
document.querySelectorAll('#model-group .toggle').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('#model-group .toggle').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    state.model = el.dataset.model;
  });
});

function updateGenerateState() {
  generateBtn.disabled = !(state.photoKey && state.styleId);
}

generateBtn.addEventListener('click', async () => {
  generateBtn.disabled = true;
  resultCard.classList.remove('show');
  statusCard.classList.add('show');
  statusText.textContent = 'Le réalisateur IA prépare votre scène...';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoKey: state.photoKey,
        styleId: state.styleId,
        customPrompt: document.getElementById('custom-prompt').value,
        duration: state.duration,
        model: state.model,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Échec de la génération');
    await pollStatus(data.jobId);
  } catch (err) {
    statusCard.classList.remove('show');
    alert(err.message);
    generateBtn.disabled = false;
  }
});

async function pollStatus(jobId) {
  const labels = { queued: 'En file d\\'attente...', processing: 'Génération de la scène en cours...' };
  for (;;) {
    const res = await fetch('/api/status/' + jobId);
    const data = await res.json();
    if (data.status === 'completed') {
      statusCard.classList.remove('show');
      resultVideo.src = data.videoUrl;
      downloadLink.href = data.videoUrl;
      resultCard.classList.add('show');
      generateBtn.disabled = false;
      loadGallery();
      return;
    }
    if (data.status === 'failed') {
      statusCard.classList.remove('show');
      alert(data.error || 'La génération a échoué.');
      generateBtn.disabled = false;
      return;
    }
    statusText.textContent = labels[data.status] || 'Traitement en cours...';
    await new Promise(r => setTimeout(r, 3000));
  }
}

document.getElementById('new-scene-btn').addEventListener('click', () => {
  resultCard.classList.remove('show');
  previewWrap.classList.remove('show');
  dropzone.style.display = 'block';
  state.photoKey = null;
  document.querySelectorAll('.style-card').forEach(c => c.classList.remove('sel'));
  state.styleId = null;
  document.getElementById('custom-prompt').value = '';
  updateGenerateState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

async function loadGallery() {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  const res = await fetch('/api/gallery');
  const data = await res.json();
  grid.innerHTML = '';
  if (!data.items || !data.items.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  data.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = '<video src="' + item.videoUrl + '" muted loop playsinline></video><div class="g-lbl">' + item.styleLabel + '</div>';
    div.addEventListener('mouseenter', () => div.querySelector('video').play());
    div.addEventListener('mouseleave', () => div.querySelector('video').pause());
    div.addEventListener('click', () => {
      resultVideo.src = item.videoUrl;
      downloadLink.href = item.videoUrl;
      resultCard.classList.add('show');
      resultCard.scrollIntoView({ behavior: 'smooth' });
    });
    grid.appendChild(div);
  });
}

loadGallery();
</script>
</body>
</html>`;
