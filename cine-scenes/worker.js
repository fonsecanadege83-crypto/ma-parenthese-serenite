/**
 * CinéScènes IA — transforme une photo en scène vidéo cinématographique.
 *
 * 100% gratuit : le "tournage" (travelling/zoom façon Ken Burns, étalonnage
 * couleur, grain, vignette, format cinéma) est calculé et enregistré
 * directement dans le navigateur de l'utilisateur (Canvas + MediaRecorder).
 * Aucune API IA payante, aucune clé requise.
 *
 * Le Worker ne fait que servir la page et, en option, sauvegarder la vidéo
 * finale dans R2 pour l'afficher dans la galerie publique.
 *
 * Binding requis (voir wrangler.toml) :
 *   - MEDIA : bucket R2
 */

const STYLES = {
  drone: { label: "Panoramique Drone", emoji: "🚁", desc: "Envolée large, sensation d'échelle épique" },
  closeup: { label: "Gros Plan Émotion", emoji: "🎭", desc: "Lent travelling avant, ambiance intime" },
  golden: { label: "Heure Dorée", emoji: "🌅", desc: "Lumière chaude, travelling doux" },
  noir: { label: "Noir & Mystère", emoji: "🕯️", desc: "Ombres dramatiques, noir et blanc contrasté" },
  dream: { label: "Rêve Éthéré", emoji: "✨", desc: "Mouvement flottant, particules de lumière" },
  action: { label: "Action Dynamique", emoji: "⚡", desc: "Caméra vive, énergie et intensité" },
};

const GALLERY_PREFIX = "gallery/";
const GALLERY_LIMIT = 60;

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
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message || "Erreur interne" }, 500);
    }
  },
};

// ---------- Routes ----------

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
header .free-badge{display:inline-block;margin-top:12px;padding:5px 14px;border-radius:100px;background:rgba(201,162,39,0.12);border:1px solid rgba(201,162,39,0.3);color:var(--gold-l);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;}

.card{background:var(--card);border:1px solid var(--card-b);border-radius:var(--r);box-shadow:var(--shadow);padding:20px;margin-bottom:16px;}
.section-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:var(--gold);margin-bottom:12px;}

#dropzone{border:1.5px dashed rgba(255,255,255,0.15);border-radius:12px;padding:28px 16px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;}
#dropzone:hover,#dropzone.drag{border-color:var(--gold);background:rgba(201,162,39,0.06);}
#dropzone .dz-icon{font-size:30px;margin-bottom:8px;}
#dropzone .dz-text{font-size:13.5px;color:var(--text-m);white-space:pre-line;}
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
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Ciné<em>Scènes</em> IA</h1>
    <p>Transformez une photo en scène vidéo cinématographique</p>
    <div class="free-badge">100% gratuit · tournage dans votre navigateur</div>
  </header>

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

  <button id="generate-btn" disabled>Créer la scène</button>

  <div class="card" id="status-card">
    <div class="spinner"></div>
    <div id="status-text">Préparation...</div>
    <div id="progress-track"><div id="progress-bar"></div></div>
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

var state = { file: null, styleId: null, duration: 5, quality: 'hd', lastBlob: null, lastStyleLabel: null };

var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('file-input');
var previewWrap = document.getElementById('preview-wrap');
var preview = document.getElementById('preview');
var previewClear = document.getElementById('preview-clear');
var generateBtn = document.getElementById('generate-btn');
var statusCard = document.getElementById('status-card');
var statusText = document.getElementById('status-text');
var progressBar = document.getElementById('progress-bar');
var resultCard = document.getElementById('result-card');
var resultVideo = document.getElementById('result-video');
var downloadLink = document.getElementById('download-link');
var saveGalleryBtn = document.getElementById('save-gallery-btn');

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
  generateBtn.disabled = !(state.file && state.styleId);
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
    alert('Impossible de lire cette photo.');
    generateBtn.disabled = false;
  };
  img.src = URL.createObjectURL(state.file);
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
  document.querySelectorAll('.style-card').forEach(function (c) { c.classList.remove('sel'); });
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
