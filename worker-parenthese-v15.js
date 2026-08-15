export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#F5EFE6">
<title>Ma Parenthèse de Sérénité</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg:      #F5EFE6;
  --bg2:     #EDE5D8;
  --card:    #FFFFFF;
  --card2:   #FAF6F0;
  --terra:   #C4785A;
  --terra-l: #D9956F;
  --terra-d: #9A5A3E;
  --brown:   #5C4033;
  --brown-m: #8A6050;
  --brown-l: #B09080;
  --cream:   #F5EFE6;
  --sand:    #E8DDD0;
  --sand-l:  #F0EAE0;
  --text:    #3A2010;
  --text-m:  #7A5840;
  --text-l:  #A08070;
  --border:  rgba(196,120,90,0.15);
  --shadow:  0 4px 20px rgba(92,64,51,0.10);
  --shadow-sm: 0 2px 10px rgba(92,64,51,0.06);
  --nav-h:   76px;
  --r:       20px;
  --r-sm:    14px;
  --r-pill:  100px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{background:var(--bg);height:auto;min-height:100%;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;overflow-y:auto;padding-bottom:calc(var(--nav-h)+40px);}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 20% 0%,rgba(196,120,90,0.08) 0%,transparent 60%),radial-gradient(ellipse 60% 60% at 80% 100%,rgba(196,120,90,0.06) 0%,transparent 60%);pointer-events:none;z-index:0;}

/* ONBOARDING */
#onb{position:fixed;inset:0;background:var(--bg);z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 28px 40px;text-align:center;}
#onb.hidden{display:none;}
.onb-stones{display:flex;flex-direction:column;align-items:center;gap:5px;margin-bottom:32px;}
.onb-stone{border-radius:50%;background:linear-gradient(135deg,var(--terra-l),var(--terra-d));box-shadow:0 3px 12px rgba(196,120,90,0.30);}
.s1{width:72px;height:28px;}.s2{width:54px;height:22px;}.s3{width:38px;height:17px;}.s4{width:24px;height:12px;}
.onb-title{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:300;color:var(--text);line-height:1.2;margin-bottom:12px;}
.onb-title em{font-style:italic;color:var(--terra);}
.onb-sub{font-size:14px;color:var(--text-m);line-height:1.7;margin-bottom:32px;}
.onb-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:var(--terra);margin-bottom:10px;}
.onb-inp{width:100%;background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-sm);padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--text);outline:none;margin-bottom:20px;transition:border-color 0.2s;}
.onb-inp:focus{border-color:var(--terra);}
.onb-inp::placeholder{color:var(--text-l);}
.onb-roles{display:flex;gap:10px;margin-bottom:32px;width:100%;}
.onb-role{flex:1;padding:14px 10px;background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-sm);color:var(--text-m);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;}
.onb-role.sel{border-color:var(--terra);background:rgba(196,120,90,0.08);color:var(--terra);}
.onb-btn{width:100%;background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border:none;border-radius:var(--r-pill);padding:18px;font-family:'Cormorant Garamond',serif;font-size:18px;cursor:pointer;box-shadow:0 6px 24px rgba(196,120,90,0.30);}

/* SCREENS */
#app{position:relative;z-index:1;}
.screen{display:none;max-width:430px;margin:0 auto;flex-direction:column;}
.screen.active{display:flex;animation:fadeUp 0.3s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

/* HEADER */
.app-header{display:flex;align-items:center;justify-content:space-between;padding:54px 20px 12px;}
.header-brand{display:flex;flex-direction:column;line-height:1.1;}
.hb-top{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:17px;color:var(--text-m);}
.hb-bot{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:20px;color:var(--terra);}
.header-btns{display:flex;gap:10px;}
.hbtn{width:38px;height:38px;border-radius:50%;background:var(--card);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;box-shadow:var(--shadow-sm);}

/* GREETING */
.greeting{padding:4px 20px 16px;}
.g-hello{font-size:13px;color:var(--text-m);margin-bottom:2px;}
.g-name{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--text);margin-bottom:4px;}
.g-date{font-size:11px;color:var(--text-l);}

/* MOOD */
.mood-row{display:flex;gap:0;padding:0 16px 16px;overflow-x:auto;scrollbar-width:none;}
.mood-row::-webkit-scrollbar{display:none;}
.mood-chip{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 14px;cursor:pointer;border-radius:var(--r-sm);transition:all 0.18s;flex-shrink:0;}
.mood-chip.sel{background:rgba(196,120,90,0.10);}
.mood-emoji{font-size:26px;}
.mood-lbl{font-size:10px;color:var(--text-m);font-weight:500;white-space:nowrap;}
.mood-chip.sel .mood-lbl{color:var(--terra);}

/* SCROLL */
.scroll-pad{padding:0 16px 140px;display:flex;flex-direction:column;gap:14px;}

/* CARD */
.card{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);overflow:hidden;}
.card-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px 0;}
.card-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--terra);}
.card-link{font-size:11px;color:var(--text-m);cursor:pointer;}

/* COEUR DU JOUR */
.coeur-card{background:linear-gradient(135deg,var(--terra),var(--terra-d));border-radius:var(--r);padding:22px 20px;box-shadow:0 6px 24px rgba(196,120,90,0.28);position:relative;overflow:hidden;}
.coeur-card::before{content:'❤️';position:absolute;top:-10px;right:-10px;font-size:80px;opacity:0.10;}
.coeur-eyebrow{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.80);margin-bottom:10px;}
.coeur-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;color:#fff;line-height:1.65;margin-bottom:16px;}
.coeur-btn{background:rgba(255,255,255,0.20);color:#fff;border:1.5px solid rgba(255,255,255,0.40);border-radius:var(--r-pill);padding:11px 22px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;backdrop-filter:blur(4px);}

/* PLAN DU JOUR */
.plan-humeur{display:flex;gap:8px;padding:12px 18px;overflow-x:auto;scrollbar-width:none;}
.plan-humeur::-webkit-scrollbar{display:none;}
.ph-chip{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 12px;border-radius:var(--r-sm);border:1.5px solid var(--sand);cursor:pointer;flex-shrink:0;transition:all 0.18s;background:var(--card2);}
.ph-chip.sel{border-color:var(--terra);background:rgba(196,120,90,0.08);}
.ph-e{font-size:22px;}
.ph-l{font-size:10px;color:var(--text-m);white-space:nowrap;}
.ph-chip.sel .ph-l{color:var(--terra);}
.plan-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:var(--text-m);line-height:1.55;padding:0 18px 12px;}
.plan-list{display:flex;flex-direction:column;}
.plan-item{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--sand-l);cursor:pointer;transition:background 0.15s;}
.plan-item:last-child{border-bottom:none;}
.plan-item:active{background:var(--sand-l);}
.plan-item.done{opacity:0.55;}
.plan-item.done .pi-title{text-decoration:line-through;}
.pi-badge{width:40px;height:40px;border-radius:50%;background:rgba(196,120,90,0.10);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.pi-info{flex:1;}
.pi-title{font-size:13px;font-weight:500;color:var(--text);line-height:1.3;}
.pi-dur{font-size:10.5px;color:var(--terra);margin-top:2px;font-weight:500;}
.pi-check{font-size:18px;color:var(--sand);transition:color 0.2s;}
.plan-item.done .pi-check{color:var(--terra);}
.plan-btn{margin:14px 18px 18px;background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border:none;border-radius:var(--r-pill);padding:14px;font-family:'Cormorant Garamond',serif;font-size:16px;cursor:pointer;box-shadow:0 4px 16px rgba(196,120,90,0.25);width:calc(100% - 36px);}

/* ARBRE */
.arbre-body{display:flex;align-items:center;gap:16px;padding:12px 18px 18px;}
.arbre-emoji{font-size:52px;}
.arbre-count{font-family:'Cormorant Garamond',serif;font-size:34px;color:var(--terra);line-height:1;}
.arbre-unit{font-size:11px;color:var(--text-m);margin-bottom:6px;}
.arbre-msg{font-size:12px;color:var(--text-m);line-height:1.5;font-style:italic;}
.arbre-btn{display:block;margin:0 18px 18px;background:var(--bg2);color:var(--terra);border:1.5px solid var(--terra);border-radius:var(--r-pill);padding:11px;font-size:13px;font-weight:500;cursor:pointer;text-align:center;width:calc(100% - 36px);}

/* PAGE HEADER */
.page-header{display:flex;align-items:center;padding:54px 20px 16px;gap:14px;}
.back-btn{width:36px;height:36px;border-radius:50%;background:var(--card);border:1px solid var(--border);font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text);flex-shrink:0;box-shadow:var(--shadow-sm);}
.page-title{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--text);}

/* RESPIRER */
.resp-pad{padding:0 16px 140px;display:flex;flex-direction:column;gap:12px;}
.breath-hero{background:linear-gradient(135deg,var(--terra),var(--terra-d));border-radius:var(--r);padding:28px 20px;display:flex;flex-direction:column;align-items:center;box-shadow:0 6px 24px rgba(196,120,90,0.28);}
.breath-ring{width:150px;height:150px;border-radius:50%;border:3px solid rgba(255,255,255,0.50);display:flex;align-items:center;justify-content:center;flex-direction:column;margin-bottom:20px;transition:all 0.5s ease;box-shadow:0 0 30px rgba(255,255,255,0.15);}
.breath-word{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:20px;color:rgba(255,255,255,0.90);}
.breath-num{font-size:34px;font-weight:600;color:#fff;}
.breath-phase{font-size:11px;color:rgba(255,255,255,0.70);margin-top:2px;}
.breath-info{font-size:12px;color:rgba(255,255,255,0.80);text-align:center;line-height:1.6;margin-bottom:20px;font-style:italic;}
.breath-start{background:rgba(255,255,255,0.20);color:#fff;border:1.5px solid rgba(255,255,255,0.50);border-radius:var(--r-pill);padding:13px 32px;font-family:'Cormorant Garamond',serif;font-size:17px;cursor:pointer;backdrop-filter:blur(4px);}

/* FILTRES */
.filter-row{display:flex;gap:8px;padding:14px 18px;overflow-x:auto;scrollbar-width:none;}
.filter-row::-webkit-scrollbar{display:none;}
.filter-chip{padding:7px 16px;border-radius:var(--r-pill);background:var(--bg2);border:1px solid var(--border);font-size:12px;color:var(--text-m);cursor:pointer;white-space:nowrap;transition:all 0.18s;flex-shrink:0;}
.filter-chip.act{background:var(--terra);border-color:var(--terra);color:#fff;font-weight:500;}

/* MEDIA LIST */
.media-list{display:flex;flex-direction:column;}
.media-item{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid var(--sand-l);cursor:pointer;transition:background 0.15s;}
.media-item:last-child{border-bottom:none;}
.media-item:active{background:var(--bg2);}
.media-thumb{width:54px;height:54px;border-radius:12px;background:linear-gradient(135deg,var(--bg2),var(--sand));display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;}
.media-info{flex:1;}
.media-title{font-size:13px;font-weight:500;color:var(--text);margin-bottom:3px;}
.media-sub{font-size:11px;color:var(--text-m);}
.media-dur{font-size:11px;color:var(--terra);font-weight:500;white-space:nowrap;}
.media-play{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--terra),var(--terra-d));border:none;color:white;font-size:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}

/* SONS */
.sons-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 18px 18px;}
.son-card{background:var(--bg2);border-radius:var(--r-sm);padding:14px;cursor:pointer;transition:all 0.18s;border:1.5px solid transparent;text-align:center;}
.son-card.playing{border-color:var(--terra);background:rgba(196,120,90,0.08);}
.son-icon{font-size:28px;margin-bottom:6px;}
.son-title{font-size:11.5px;font-weight:500;color:var(--text);line-height:1.3;}
.son-artist{font-size:10px;color:var(--text-m);margin-top:2px;}

/* PLAYER OVERLAY */
.player-ov{position:fixed;inset:0;background:rgba(245,239,230,0.96);z-index:500;display:none;flex-direction:column;align-items:center;padding:0;overflow-y:auto;}
.player-ov.vis{display:flex;}
.player-top{width:100%;display:flex;align-items:center;justify-content:space-between;padding:54px 20px 16px;}
.player-close-btn{width:36px;height:36px;border-radius:50%;background:var(--card);border:1px solid var(--border);font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-sm);}
.player-meta{text-align:right;}
.player-meta-title{font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--text);}
.player-meta-sub{font-size:11px;color:var(--text-m);}
.player-thumb-big{width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,var(--terra),var(--terra-d));display:flex;align-items:center;justify-content:center;font-size:52px;margin:0 auto 20px;box-shadow:0 8px 28px rgba(196,120,90,0.30);}
.player-step-area{width:calc(100% - 32px);background:var(--card);border-radius:var(--r);border:1px solid var(--border);padding:20px;margin:0 16px 16px;min-height:140px;}
.player-step-num{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--terra);margin-bottom:10px;}
.player-step-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:var(--text);line-height:1.70;}
.player-timer-big{font-family:'Cormorant Garamond',serif;font-size:48px;color:var(--terra);text-align:center;margin:8px 0;}
.player-prog{width:calc(100% - 32px);height:4px;background:var(--sand);border-radius:2px;margin:0 16px 20px;overflow:hidden;}
.player-prog-fill{height:100%;background:linear-gradient(90deg,var(--terra),var(--terra-l));border-radius:2px;transition:width 1s linear;}
.player-ctrls{display:flex;gap:16px;align-items:center;justify-content:center;margin-bottom:24px;}
.player-main-btn{width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,var(--terra),var(--terra-d));border:none;color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 20px rgba(196,120,90,0.30);}
.player-sec-btn{width:46px;height:46px;border-radius:50%;background:var(--card);border:1px solid var(--border);color:var(--text-m);font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-sm);}
.player-done{text-align:center;padding:20px 24px 40px;display:none;}
.player-done-icon{font-size:52px;margin-bottom:14px;}
.player-done-title{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--text);margin-bottom:8px;}
.player-done-sub{font-size:13px;color:var(--text-m);line-height:1.65;margin-bottom:24px;}
.player-done-btn{background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border:none;border-radius:var(--r-pill);padding:14px 28px;font-family:'Cormorant Garamond',serif;font-size:17px;cursor:pointer;}

/* JOURNAL */
.journal-pad{padding:0 16px 140px;display:flex;flex-direction:column;gap:12px;}
.hj-date-lbl{font-size:12px;color:var(--terra);font-weight:600;margin-bottom:12px;}
.hj-emojis{display:flex;gap:8px;justify-content:center;margin-bottom:16px;}
.hj-e{width:44px;height:44px;border-radius:50%;background:var(--bg2);border:2px solid transparent;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;transition:all 0.18s;}
.hj-e.sel{border-color:var(--terra);background:rgba(196,120,90,0.10);}
.jq-lbl{font-size:12px;color:var(--terra);font-weight:500;margin-bottom:6px;font-style:italic;}
.jq-inp{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);resize:none;outline:none;transition:border-color 0.2s;min-height:60px;}
.jq-inp:focus{border-color:var(--terra);}
.jq-inp::placeholder{color:var(--text-l);}
.j-save{width:100%;background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border:none;border-radius:var(--r-pill);padding:15px;font-family:'Cormorant Garamond',serif;font-size:16px;cursor:pointer;margin-top:4px;box-shadow:0 4px 16px rgba(196,120,90,0.25);}
.jhist-item{padding:14px 18px;border-bottom:1px solid var(--sand-l);}
.jhist-item:last-child{border-bottom:none;}
.jhist-date{font-size:10px;color:var(--terra);font-weight:600;margin-bottom:5px;}
.jhist-txt{font-size:12.5px;color:var(--text-m);line-height:1.55;font-style:italic;}

/* COACH */
.coach-intro{padding:20px 20px 0;text-align:center;}
.coach-halo-wrap{position:relative;width:120px;height:120px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;}
.coach-halo{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(212,169,106,0.55) 0%,rgba(196,120,90,0.35) 45%,transparent 75%);filter:blur(2px);animation:haloGlow 3s ease-in-out infinite;}
@keyframes haloGlow{0%,100%{opacity:0.75;transform:scale(1);}50%{opacity:1;transform:scale(1.06);}}
.coach-av-illus{position:relative;width:92px;height:92px;border-radius:50%;background:linear-gradient(160deg,#F0D9B8,var(--terra-l) 55%,var(--terra-d));display:flex;align-items:center;justify-content:center;font-size:40px;box-shadow:0 4px 20px rgba(196,120,90,0.35),inset 0 2px 8px rgba(255,255,255,0.25);border:3px solid rgba(255,255,255,0.5);}
.coach-dot-row{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px;}
.coach-dot{width:7px;height:7px;border-radius:50%;background:#5A9A5A;animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.4;}}
.coach-dot-lbl{font-size:11px;color:#5A9A5A;font-weight:500;}
.coach-nm{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text);margin-bottom:10px;}
.coach-welcome-bubble{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);padding:16px 18px;font-size:13.5px;color:var(--text);line-height:1.7;text-align:left;margin:0 0 16px;border-left:3px solid var(--terra);}
.coach-quick-chips{display:flex;flex-direction:column;gap:8px;padding:0 20px 20px;}
.qchip{background:var(--card2);border:1.5px solid var(--border);border-radius:var(--r-sm);padding:12px 16px;font-size:13px;color:var(--text);cursor:pointer;transition:all 0.18s;text-align:left;}
.qchip:active{border-color:var(--terra);background:rgba(196,120,90,0.08);}
.coach-modes{display:flex;flex-direction:column;gap:10px;padding:0 20px 140px;}
.cmc{background:var(--card);border-radius:var(--r-sm);border:1.5px solid var(--border);padding:18px 16px;cursor:pointer;display:flex;align-items:flex-start;gap:14px;transition:all 0.2s;box-shadow:var(--shadow-sm);}
.cmc:active{border-color:var(--terra);}
.cmc-ic{font-size:28px;flex-shrink:0;}
.cmc-title{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--text);margin-bottom:4px;}
.cmc-desc{font-size:12px;color:var(--text-m);line-height:1.55;}
.cmc-tag{display:inline-block;background:rgba(196,120,90,0.10);color:var(--terra);font-size:10px;font-weight:500;padding:3px 8px;border-radius:10px;margin-top:8px;}
.chat-screen{display:flex;flex-direction:column;height:100vh;max-height:100vh;overflow:hidden;}
.chat-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 14px;background:var(--bg);border-bottom:1px solid var(--border);flex-shrink:0;}
.chat-av-sm{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--terra-l),var(--terra-d));display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
.chat-meta-name{font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--text);}
.chat-meta-st{font-size:11px;color:#5A9A5A;}
.msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}
.msgs::-webkit-scrollbar{display:none;}
.msg{max-width:82%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.6;animation:msgIn 0.3s ease;}
@keyframes msgIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.msg.bot{background:var(--card);color:var(--text);border-bottom-left-radius:4px;align-self:flex-start;box-shadow:var(--shadow-sm);}
.msg.user{background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}
.typing{align-self:flex-start;background:var(--card);border-radius:18px;border-bottom-left-radius:4px;padding:14px 18px;display:none;gap:5px;align-items:center;box-shadow:var(--shadow-sm);}
.typing.vis{display:flex;}
.td{width:7px;height:7px;border-radius:50%;background:var(--terra-l);animation:td 1.3s infinite;}
.td:nth-child(2){animation-delay:0.18s;}.td:nth-child(3){animation-delay:0.36s;}
@keyframes td{0%,60%,100%{transform:translateY(0);opacity:0.4;}30%{transform:translateY(-7px);opacity:1;}}
.chat-bar{display:flex;gap:10px;padding:12px 16px calc(env(safe-area-inset-bottom,8px)+80px);background:var(--bg);border-top:1px solid var(--border);flex-shrink:0;}
.chat-inp{flex:1;background:var(--card);border:1.5px solid var(--border);border-radius:22px;padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);outline:none;resize:none;transition:border-color 0.2s;}
.chat-inp:focus{border-color:var(--terra);}
.chat-inp::placeholder{color:var(--text-l);}
.chat-send{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--terra),var(--terra-d));border:none;color:#fff;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

/* PROFIL */
.profil-pad{padding:0 16px 140px;display:flex;flex-direction:column;gap:12px;}
.profil-hero{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);padding:24px 20px;display:flex;flex-direction:column;align-items:center;}
.pav-wrap{position:relative;margin-bottom:14px;}
.pav{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,var(--terra),var(--terra-d));display:flex;align-items:center;justify-content:center;font-size:36px;border:3px solid rgba(196,120,90,0.20);box-shadow:0 4px 16px rgba(196,120,90,0.20);overflow:hidden;}
.pav img{width:100%;height:100%;object-fit:cover;display:none;}
.pav-edit{position:absolute;bottom:0;right:0;width:26px;height:26px;border-radius:50%;background:var(--terra);border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;}
.pnm{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text);margin-bottom:4px;}
.psince{font-size:11px;color:var(--terra);margin-bottom:6px;}
.pbadge{background:linear-gradient(135deg,#D4A96A,var(--terra-d));color:#fff;font-size:11px;font-weight:600;padding:4px 14px;border-radius:var(--r-pill);}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.stat-card{background:var(--card);border-radius:var(--r-sm);padding:14px 10px;text-align:center;box-shadow:var(--shadow-sm);}
.stat-val{font-family:'Cormorant Garamond',serif;font-size:26px;color:var(--terra);}
.stat-lbl{font-size:9.5px;color:var(--text-l);margin-top:3px;font-weight:500;}
.p-section{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);overflow:hidden;}
.p-sec-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--terra);padding:14px 18px 10px;}
.p-row{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--sand-l);cursor:pointer;}
.p-row:last-child{border-bottom:none;}
.p-row-lbl{font-size:13px;color:var(--text);}
.p-row-val{font-size:12px;color:var(--text-m);}
.toggle{width:42px;height:24px;background:var(--sand);border-radius:12px;position:relative;cursor:pointer;transition:background 0.2s;}
.toggle.on{background:var(--terra);}
.toggle::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.15);}
.toggle.on::after{left:21px;}
.p-inp{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);outline:none;margin-bottom:10px;}
.p-inp::placeholder{color:var(--text-l);}
.p-save{width:100%;background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border:none;border-radius:var(--r-pill);padding:14px;font-family:'Cormorant Garamond',serif;font-size:16px;cursor:pointer;}
.obj-chip{padding:8px 14px;border-radius:var(--r-pill);background:var(--bg2);border:1.5px solid var(--border);font-size:12px;color:var(--text-m);cursor:pointer;transition:all 0.18s;}
.obj-chip.sel{background:var(--terra);border-color:var(--terra);color:#fff;font-weight:500;}
.recompense-card{background:var(--card);border-radius:var(--r-sm);padding:14px;text-align:center;box-shadow:var(--shadow-sm);border:1.5px solid var(--border);}
.recompense-card.locked{opacity:0.55;}
.rwd-icon{font-size:30px;margin-bottom:6px;}
.rwd-title{font-size:11px;font-weight:600;color:var(--text);margin-bottom:3px;}
.rwd-sub{font-size:10px;color:var(--text-m);margin-bottom:8px;}
.rwd-badge{font-size:10px;font-weight:600;padding:3px 8px;border-radius:10px;}
.rwd-badge.unlocked{background:rgba(196,120,90,0.15);color:var(--terra);}
.rwd-badge.locked-badge{background:var(--bg2);color:var(--text-l);}

/* SOS */
.sos-pad{padding:0 16px 140px;display:flex;flex-direction:column;gap:12px;}
.sos-hero{background:linear-gradient(135deg,#8A2020,#C04040);border-radius:var(--r);padding:24px 20px;text-align:center;box-shadow:0 6px 24px rgba(192,64,64,0.25);}
.sos-icon{font-size:44px;margin-bottom:12px;}
.sos-title{font-family:'Cormorant Garamond',serif;font-size:24px;color:#fff;margin-bottom:8px;}
.sos-sub{font-size:13px;color:rgba(255,255,255,0.80);line-height:1.6;}
.sos-opt{display:flex;align-items:center;gap:14px;padding:16px 18px;background:var(--card);border-radius:var(--r-sm);box-shadow:var(--shadow-sm);cursor:pointer;transition:all 0.18s;border:1.5px solid transparent;}
.sos-opt:active{border-color:var(--terra);}
.sos-opt-ic{font-size:28px;width:40px;text-align:center;}
.sos-opt-title{font-size:14px;font-weight:500;color:var(--text);margin-bottom:3px;}
.sos-opt-sub{font-size:11px;color:var(--text-m);}
.sos-arrow{font-size:16px;color:var(--text-l);margin-left:auto;}
.mots-box{background:var(--card);border-radius:var(--r-sm);padding:20px;border:1px solid rgba(196,120,90,0.20);display:none;}
.mots-box.vis{display:block;}
.mots-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:var(--text);line-height:1.65;margin-bottom:14px;}
.mots-btn{background:rgba(196,120,90,0.10);color:var(--terra);border:1px solid var(--terra);border-radius:var(--r-pill);padding:10px 20px;font-size:12px;font-weight:500;cursor:pointer;}

/* NAV */
.nav{position:fixed;bottom:0;left:0;right:0;height:var(--nav-h);background:var(--card);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-around;padding:0 4px 12px;z-index:200;box-shadow:0 -2px 16px rgba(92,64,51,0.08);}
.nav-btn{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:var(--r-sm);flex:1;}
.nav-icon{font-size:22px;}
.nav-lbl{font-size:9px;font-weight:500;color:var(--text-l);}
.nav-btn.act .nav-lbl{color:var(--terra);font-weight:600;}
.nav-center{width:52px;height:52px;background:linear-gradient(135deg,var(--terra),var(--terra-d));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 16px rgba(196,120,90,0.30);cursor:pointer;border:none;flex-shrink:0;margin-bottom:10px;}
.sos-fab{position:fixed;bottom:calc(var(--nav-h)+14px);right:18px;width:50px;height:50px;background:linear-gradient(135deg,#C04040,#8A2020);border-radius:50%;border:none;color:#fff;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(192,64,64,0.35);cursor:pointer;z-index:100;animation:psos 2.5s infinite;}
@keyframes psos{0%,100%{box-shadow:0 4px 20px rgba(192,64,64,0.35);}50%{box-shadow:0 4px 32px rgba(192,64,64,0.60);}}
.hidden{display:none!important;}
</style>
</head>
<body>

<!-- ONBOARDING -->
<div id="onb">
  <div class="onb-stones">
    <div class="onb-stone s4"></div><div class="onb-stone s3"></div>
    <div class="onb-stone s2"></div><div class="onb-stone s1"></div>
  </div>
  <h1 class="onb-title">Ma Parenthèse<br><em>de Sérénité</em></h1>
  <p class="onb-sub">Un espace rien que pour toi.<br>Sans jugement. Sans pression. Juste toi.</p>
  <p class="onb-lbl">Comment tu veux qu'on t'appelle ?</p>
  <input class="onb-inp" id="onbName" placeholder="Ton prénom..." type="text">
  <p class="onb-lbl">Tu es ?</p>
  <div class="onb-roles">
    <button class="onb-role sel" data-r="Maman" onclick="pickR(this)">🌸 Maman</button>
    <button class="onb-role" data-r="Papa" onclick="pickR(this)">🌱 Papa</button>
    <button class="onb-role" data-r="Parent" onclick="pickR(this)">💛 Parent</button>
  </div>
  <button class="onb-btn" onclick="finishOnb()">Commencer ma parenthèse 🌿</button>
</div>

<div id="app">

<!-- ACCUEIL -->
<div class="screen active" id="s-accueil">
  <div class="app-header">
    <div class="header-brand"><span class="hb-top">Ma Parenthèse</span><span class="hb-bot">de Sérénité</span></div>
    <div class="header-btns">
      <button class="hbtn" onclick="navTo('sos')">🤍</button>
      <button class="hbtn" onclick="navTo('profil')">🔔</button>
    </div>
  </div>
  <div class="greeting">
    <div class="g-hello">Bonjour,</div>
    <div class="g-name" id="gName">🌸</div>
    <div class="g-date" id="gDate"></div>
  </div>
  <div class="mood-row">
    <div class="mood-chip" data-m="0" onclick="pickMood(this)"><span class="mood-emoji">😌</span><span class="mood-lbl">Je vais bien</span></div>
    <div class="mood-chip" data-m="1" onclick="pickMood(this)"><span class="mood-emoji">😔</span><span class="mood-lbl">Fatiguée</span></div>
    <div class="mood-chip" data-m="2" onclick="pickMood(this)"><span class="mood-emoji">😤</span><span class="mood-lbl">Stressée</span></div>
    <div class="mood-chip" data-m="3" onclick="pickMood(this)"><span class="mood-emoji">😢</span><span class="mood-lbl">Triste</span></div>
    <div class="mood-chip" data-m="4" onclick="pickMood(this)"><span class="mood-emoji">⚡</span><span class="mood-lbl">Énergie</span></div>
  </div>
  <div class="scroll-pad">
    <div class="coeur-card">
      <div class="coeur-eyebrow">❤️ Mon Cœur du Jour</div>
      <div class="coeur-text" id="coeurText">"Tu n'as pas besoin d'être parfaite. Tu as seulement besoin d'être présente."</div>
      <button class="coeur-btn" onclick="newCoeur()">Lire mon message du jour</button>
    </div>
    <div class="card">
      <div class="card-head"><span class="card-lbl">✨ Pour toi aujourd'hui</span><span class="card-link" onclick="navTo('respirer')">Voir tout</span></div>
      <div class="plan-humeur" id="planHumeur">
        <div class="ph-chip sel" data-h="0" onclick="selH(this)"><span class="ph-e">😌</span><span class="ph-l">Je vais bien</span></div>
        <div class="ph-chip" data-h="1" onclick="selH(this)"><span class="ph-e">😔</span><span class="ph-l">Fatiguée</span></div>
        <div class="ph-chip" data-h="2" onclick="selH(this)"><span class="ph-e">😤</span><span class="ph-l">Stressée</span></div>
        <div class="ph-chip" data-h="3" onclick="selH(this)"><span class="ph-e">😢</span><span class="ph-l">Triste</span></div>
        <div class="ph-chip" data-h="4" onclick="selH(this)"><span class="ph-e">⚡</span><span class="ph-l">Énergie</span></div>
      </div>
      <div class="plan-sub" id="planSub">"Un parcours doux, rien que pour toi aujourd'hui."</div>
      <div class="plan-list" id="planList"></div>
      <button class="plan-btn" onclick="navTo('respirer')">Commencer mon plan du jour 🌿</button>
    </div>
    <div class="card">
      <div class="card-head"><span class="card-lbl">🌳 Mon arbre de vie</span><span class="card-link" onclick="navTo('profil')">Voir mon évolution</span></div>
      <div class="arbre-body">
        <div id="arbreEmoji" style="font-size:52px">🌱</div>
        <div>
          <div class="arbre-count" id="arbreCount">0</div>
          <div class="arbre-unit">feuilles aujourd'hui 🍃</div>
          <div class="arbre-msg">Continue, tu fais un travail incroyable !</div>
        </div>
      </div>
      <button class="arbre-btn" onclick="navTo('profil')">Voir mon évolution</button>
    </div>
  </div>
</div>

<!-- RESPIRER -->
<div class="screen" id="s-respirer">
  <div class="page-header"><button class="back-btn" onclick="navTo('accueil')">←</button><div class="page-title">Respire & Médite</div></div>
  <div class="resp-pad">
    <div class="breath-hero">
      <div class="breath-ring" id="bRing"><div class="breath-word" id="bWord">Prête ?</div><div class="breath-num" id="bNum">🌿</div><div class="breath-phase" id="bPhase"></div></div>
      <div class="breath-info">Inspire 4s · Retiens 4s · Expire 6s<br><em>Cohérence cardiaque — 5 minutes</em></div>
      <button class="breath-start" id="bBtn" onclick="startBreath()">Commencer</button>
    </div>
    <div class="card">
      <div class="card-head" style="padding-bottom:4px"><span class="card-lbl">Médiathèque</span></div>
      <div class="filter-row" id="filterRow">
        <div class="filter-chip act" onclick="filterM('tous',this)">Toutes</div>
        <div class="filter-chip" onclick="filterM('sommeil',this)">Sommeil</div>
        <div class="filter-chip" onclick="filterM('stress',this)">Stress</div>
        <div class="filter-chip" onclick="filterM('energie',this)">Énergie</div>
        <div class="filter-chip" onclick="filterM('confiance',this)">Confiance</div>
        <div class="filter-chip" onclick="filterM('maternite',this)">Maternité</div>
        <div class="filter-chip" onclick="filterM('amour',this)">Amour de soi</div>
        <div class="filter-chip" onclick="filterM('aidant',this)">Aidant</div>
      </div>
      <div class="media-list" id="mediaList"></div>
    </div>
    <div class="card">
      <div class="card-head" style="padding-bottom:4px"><span class="card-lbl">Sons apaisants</span></div>
      <div style="padding:12px 18px 18px;">
        <div style="display:flex;align-items:center;gap:14px;background:var(--card2);border-radius:var(--r-sm);padding:14px 16px;">
          <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--terra-l),var(--terra-d));display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🌙</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:var(--text);">Musique pour dormir</div>
            <div style="font-size:11px;color:var(--text-m);">Musique douce en boucle</div>
          </div>
          <button id="ambientSoundBtn" onclick="toggleAmbientSound()" style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--terra),var(--terra-d));border:none;color:white;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">▶</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- JOURNAL -->
<div class="screen" id="s-journal">
  <div class="page-header"><button class="back-btn" onclick="navTo('accueil')">←</button><div class="page-title">Journal émotionnel</div></div>
  <div class="journal-pad">
    <div class="card" style="padding:18px">
      <div class="hj-date-lbl" id="hjDate"></div>
      <div class="hj-emojis">
        <div class="hj-e" onclick="pickHJ(this)">😊</div>
        <div class="hj-e" onclick="pickHJ(this)">😌</div>
        <div class="hj-e" onclick="pickHJ(this)">😔</div>
        <div class="hj-e" onclick="pickHJ(this)">😤</div>
        <div class="hj-e" onclick="pickHJ(this)">🥺</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div><div class="jq-lbl">Qu'est-ce qui t'a fait sourire ?</div><textarea class="jq-inp" id="jq1" placeholder="Écris ici..." rows="2"></textarea></div>
        <div><div class="jq-lbl">Qu'est-ce qui t'a pesé ?</div><textarea class="jq-inp" id="jq2" placeholder="Écris ici..." rows="2"></textarea></div>
        <div><div class="jq-lbl">De quoi es-tu fière aujourd'hui ?</div><textarea class="jq-inp" id="jq3" placeholder="Écris ici..." rows="2"></textarea></div>
      </div>
      <button class="j-save" onclick="saveJournal()" style="margin-top:16px">Enregistrer ma journée 🌿</button>
    </div>
    <div class="card" style="padding:18px">
      <div class="card-lbl" style="margin-bottom:12px">Ce que je porte en silence</div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:var(--text-m);line-height:1.6;margin-bottom:12px" id="silencePrompt">"Qu'est-ce que tu portes en silence aujourd'hui ?"</div>
      <textarea class="jq-inp" id="silenceText" placeholder="Pose tes mots ici, sans te juger..." rows="3"></textarea>
      <button class="j-save" onclick="saveSilence()" style="margin-top:12px">Poser mes mots 🌿</button>
    </div>
    <div class="card" id="histCard">
      <div class="card-head" style="padding-bottom:10px"><span class="card-lbl">Mes entrées récentes</span></div>
      <div id="journalEntries"></div>
    </div>
  </div>
</div>

<!-- COACH -->
<div class="screen" id="s-coach">
  <div id="coachIntro">
    <div class="page-header"><button class="back-btn" onclick="navTo('accueil')">←</button><div class="page-title">Coach Liberty</div></div>
    <div class="coach-intro">
      <div class="coach-halo-wrap">
        <div class="coach-halo"></div>
        <div class="coach-av-illus">🌿</div>
      </div>
      <div class="coach-dot-row"><div class="coach-dot"></div><span class="coach-dot-lbl">En ligne</span></div>
      <div class="coach-nm">Liberty</div>
      <div class="coach-welcome-bubble">
        Coucou <span id="coachUserName">toi</span>, je suis Liberty 🌙<br>
        Je suis là pour t'écouter, te soutenir<br>
        et t'accompagner chaque jour.<br>
        Dis-moi, comment puis-je t'aider aujourd'hui ?
      </div>
    </div>
    <div class="coach-quick-chips">
      <div class="qchip" data-mode="ecoute" data-msg="Je suis stressée" onclick="quickStartFromChip(this)">Je suis stressée</div>
      <div class="qchip" data-mode="ecoute" data-msg="Je n'ai pas d'énergie" onclick="quickStartFromChip(this)">Je n'ai pas d'énergie</div>
      <div class="qchip" data-mode="ecoute" data-msg="J'ai besoin de parler" onclick="quickStartFromChip(this)">J'ai besoin de parler</div>
      <div class="qchip" data-mode="avancer" data-msg="Je veux avancer sur quelque chose" onclick="quickStartFromChip(this)">Je veux avancer</div>
    </div>
    <div class="coach-modes">
      <div class="cmc" onclick="startCoach('ecoute')"><div class="cmc-ic">🤍</div><div><div class="cmc-title">Être entendue</div><div class="cmc-desc">Tu n'as pas besoin de solution. Juste un espace pour poser ce que tu portes.</div><span class="cmc-tag">Espace d'écoute</span></div></div>
      <div class="cmc" onclick="startCoach('avancer')"><div class="cmc-ic">🌱</div><div><div class="cmc-title">Avancer doucement</div><div class="cmc-desc">Tu voudrais débloquer quelque chose. Liberty t'accompagne avec bienveillance.</div><span class="cmc-tag">Coach Liberty</span></div></div>
    </div>
  </div>
  <div class="chat-screen hidden" id="coachChat">
    <div class="chat-topbar">
      <button class="back-btn" onclick="backCoach()">←</button>
      <div class="chat-av-sm">🌿</div>
      <div><div class="chat-meta-name" id="chatName">Liberty</div><div class="chat-meta-st">À ton écoute 🌿</div></div>
    </div>
    <div class="msgs" id="coachMsgs"><div class="typing" id="coachTyping"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>
    <div class="chat-bar">
      <textarea class="chat-inp" id="coachInp" placeholder="Écris ce que tu ressens..." rows="1"></textarea>
      <button class="chat-send" onclick="sendCoach()">➤</button>
    </div>
  </div>
</div>

<!-- PROFIL -->
<div class="screen" id="s-profil">
  <div class="page-header"><button class="back-btn" onclick="navTo('accueil')">←</button><div class="page-title">Mon profil</div></div>
  <div class="profil-pad">

    <!-- Hero -->
    <div class="profil-hero">
      <div class="pav-wrap">
        <div class="pav"><span id="pavEmoji">🌸</span><img id="pavImg" alt=""></div>
        <div class="pav-edit" onclick="document.getElementById('pavFile').click()">✏️</div>
        <input type="file" id="pavFile" accept="image/*" style="display:none">
      </div>
      <div class="pnm" id="profilName">Ton prénom</div>
      <div class="psince" id="profilSince"></div>
      <div class="pbadge">🌿 Sérénité Premium</div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card"><div class="stat-val" id="sPierres">0</div><div class="stat-lbl">🪨 Pierres</div></div>
      <div class="stat-card"><div class="stat-val" id="sJours">1</div><div class="stat-lbl">📅 Jours actifs</div></div>
      <div class="stat-card"><div class="stat-val" id="sStreak">1</div><div class="stat-lbl">🔥 Série</div></div>
    </div>

    <!-- Mes statistiques détaillées -->
    <div class="p-section">
      <div class="p-sec-title">📊 Mes statistiques</div>
      <div class="p-row"><span class="p-row-lbl">🧘 Méditations complétées</span><span class="p-row-val" id="statMedits">0</span></div>
      <div class="p-row"><span class="p-row-lbl">🫁 Minutes de respiration</span><span class="p-row-val" id="statBreath">0 min</span></div>
      <div class="p-row"><span class="p-row-lbl">📓 Entrées journal</span><span class="p-row-val" id="statJournal">0</span></div>
      <div class="p-row"><span class="p-row-lbl">💬 Sessions Coach Liberty</span><span class="p-row-val" id="statCoach">0</span></div>
    </div>

    <!-- Mes objectifs -->
    <div class="p-section">
      <div class="p-sec-title">🎯 Mes objectifs</div>
      <div style="padding:12px 18px 16px;display:flex;flex-wrap:wrap;gap:8px;" id="objectifsWrap">
        <div class="obj-chip" data-obj="Charge mentale" onclick="toggleObj(this)">🧠 Charge mentale</div>
        <div class="obj-chip" data-obj="Sommeil" onclick="toggleObj(this)">🌙 Sommeil</div>
        <div class="obj-chip" data-obj="Confiance" onclick="toggleObj(this)">⭐ Confiance</div>
        <div class="obj-chip" data-obj="Stress" onclick="toggleObj(this)">🦋 Stress</div>
        <div class="obj-chip" data-obj="Énergie" onclick="toggleObj(this)">⚡ Énergie</div>
        <div class="obj-chip" data-obj="Amour de soi" onclick="toggleObj(this)">🌸 Amour de soi</div>
        <div class="obj-chip" data-obj="Lâcher prise" onclick="toggleObj(this)">🌊 Lâcher prise</div>
        <div class="obj-chip" data-obj="Parentalité" onclick="toggleObj(this)">🤱 Parentalité</div>
      </div>
    </div>

    <!-- Mes récompenses -->
    <div class="p-section">
      <div class="p-sec-title">🏆 Mes récompenses</div>
      <div style="padding:0 18px 16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="recompense-card" id="rwrd-1">
            <div class="rwd-icon">🌱</div>
            <div class="rwd-title">Première graine</div>
            <div class="rwd-sub">1er jour complété</div>
            <div class="rwd-badge unlocked">✓ Débloquée</div>
          </div>
          <div class="recompense-card locked" id="rwrd-2">
            <div class="rwd-icon">🌿</div>
            <div class="rwd-title">Pousse verte</div>
            <div class="rwd-sub">7 jours consécutifs</div>
            <div class="rwd-badge locked-badge">🔒 7 jours</div>
          </div>
          <div class="recompense-card locked" id="rwrd-3">
            <div class="rwd-icon">🌳</div>
            <div class="rwd-title">Arbre de sérénité</div>
            <div class="rwd-sub">30 jours consécutifs</div>
            <div class="rwd-badge locked-badge">🔒 30 jours</div>
          </div>
          <div class="recompense-card locked" id="rwrd-4">
            <div class="rwd-icon">💎</div>
            <div class="rwd-title">Pierre précieuse</div>
            <div class="rwd-sub">100 pierres accumulées</div>
            <div class="rwd-badge locked-badge">🔒 100 🪨</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mes affirmations favorites -->
    <div class="p-section">
      <div class="p-sec-title">🌟 Mes affirmations favorites</div>
      <div id="affirmationsWrap" style="padding:0 18px 16px">
        <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;color:var(--text-m);text-align:center;padding:16px 0">Ajoute des citations en appuyant sur ❤️ depuis l'accueil 🌿</div>
      </div>
    </div>

    <!-- Lettre à moi-même -->
    <div class="p-section">
      <div class="p-sec-title">💌 Lettre à moi-même</div>
      <div style="padding:0 18px 16px">
        <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;color:var(--text-m);line-height:1.6;margin-bottom:12px">"Écris une lettre à la version de toi dans 3 mois. Qu'est-ce que tu lui souhaites ?"</div>
        <textarea class="jq-inp" id="lettreText" placeholder="Chère moi..." rows="4" style="min-height:90px"></textarea>
        <button class="j-save" onclick="saveLettre()" style="margin-top:10px">Sceller ma lettre 💌</button>
        <div id="lettreConfirm" style="display:none;margin-top:10px;background:rgba(196,120,90,0.08);border-radius:var(--r-sm);padding:12px;border-left:3px solid var(--terra)">
          <div style="font-size:12px;color:var(--terra);font-weight:500;margin-bottom:4px">💌 Lettre scellée</div>
          <div style="font-size:12px;color:var(--text-m)">Ta lettre t'attend. Tu pourras la rouvrir dans 3 mois.</div>
        </div>
      </div>
    </div>

    <!-- Aller plus loin -->
    <div class="p-section">
      <div class="p-sec-title">✨ Aller plus loin</div>
      <div style="padding:12px 18px 16px;display:flex;flex-direction:column;gap:10px;">
        <div style="background:linear-gradient(135deg,rgba(196,120,90,0.12),rgba(196,120,90,0.06));border-radius:var(--r-sm);border:1px solid rgba(196,120,90,0.25);padding:14px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="font-size:28px;">🪨</div>
            <div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--text);font-weight:600;">Mon Cairn Du Jour</div>
              <div style="font-size:11px;color:var(--text-m);">Ton espace de bien-être quotidien</div>
            </div>
          </div>
          <div style="margin-bottom:10px;">
            <span style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--terra);font-weight:600;">19€</span>
            <span style="font-size:11px;color:var(--text-m);text-decoration:line-through;margin-left:6px;">27€</span>
            <span style="display:inline-block;background:var(--terra);color:#fff;font-size:9px;font-weight:600;padding:2px 7px;border-radius:10px;margin-left:6px;">Pré-lancement</span>
          </div>
          <a href="https://shop.beacons.ai/liberty_serenity" target="_blank" style="display:block;background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border-radius:var(--r-pill);padding:11px;font-family:'Cormorant Garamond',serif;font-size:14px;text-align:center;text-decoration:none;box-shadow:0 4px 14px rgba(196,120,90,0.25);">Découvrir 🌿</a>
        </div>
        <div style="background:linear-gradient(135deg,rgba(196,120,90,0.12),rgba(196,120,90,0.06));border-radius:var(--r-sm);border:1px solid rgba(196,120,90,0.25);padding:14px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="font-size:28px;">📋</div>
            <div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--text);font-weight:600;">La Maman Qui Respire</div>
              <div style="font-size:11px;color:var(--text-m);">Le workbook interactif</div>
            </div>
          </div>
          <div style="margin-bottom:10px;">
            <span style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--terra);font-weight:600;">19€</span>
            <span style="font-size:11px;color:var(--text-m);text-decoration:line-through;margin-left:6px;">27€</span>
            <span style="display:inline-block;background:var(--terra);color:#fff;font-size:9px;font-weight:600;padding:2px 7px;border-radius:10px;margin-left:6px;">Pré-lancement</span>
          </div>
          <a href="https://shop.beacons.ai/liberty_serenity" target="_blank" style="display:block;background:linear-gradient(135deg,var(--terra),var(--terra-d));color:#fff;border-radius:var(--r-pill);padding:11px;font-family:'Cormorant Garamond',serif;font-size:14px;text-align:center;text-decoration:none;box-shadow:0 4px 14px rgba(196,120,90,0.25);">Découvrir 🌿</a>
        </div>
      </div>
    </div>

    <!-- Paramètres -->
    <div class="p-section">
      <div class="p-sec-title">⚙️ Paramètres</div>
      <div style="padding:0 18px 16px">
        <input class="p-inp" id="pPrenom" placeholder="Prénom" type="text">
        <input class="p-inp" id="pEmail" placeholder="Email" type="email">
        <button class="p-save" onclick="saveProfil()">Enregistrer 🌿</button>
      </div>
    </div>

    <!-- Notifications -->
    <div class="p-section">
      <div class="p-sec-title">🔔 Notifications</div>
      <div class="p-row"><span class="p-row-lbl">Rappel quotidien</span><div class="toggle" onclick="this.classList.toggle('on')"></div></div>
      <div class="p-row"><span class="p-row-lbl">Citation du matin</span><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
      <div class="p-row"><span class="p-row-lbl">Rappel habitudes</span><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
    </div>

    <!-- À propos -->
    <div class="p-section">
      <div class="p-sec-title">À propos</div>
      <div class="p-row"><span class="p-row-lbl">Liberty Sérénity</span><span class="p-row-val">@liberty.serenity</span></div>
      <div class="p-row" onclick="if(confirm('Réinitialiser ?'))resetApp()"><span class="p-row-lbl" style="color:#C04040">Réinitialiser mes données</span><span class="p-row-val">›</span></div>
    </div>

  </div>
</div>

<!-- ESPACE DOUCEUR -->
<div class="screen" id="s-sos">
  <div class="page-header"><button class="back-btn" onclick="navTo('accueil')">←</button><div class="page-title">Espace douceur</div></div>
  <div class="sos-pad">
    <div class="sos-hero"><div class="sos-icon">🤍</div><div class="sos-title">Tu n'es pas seule</div><div class="sos-sub">Ce moment difficile va passer.<br>Choisis ce dont tu as besoin maintenant.</div></div>
    <div class="sos-opt" onclick="navTo('respirer')"><div class="sos-opt-ic">🫁</div><div><div class="sos-opt-title">Respirer avec moi</div><div class="sos-opt-sub">3 minutes de cohérence cardiaque</div></div><div class="sos-arrow">›</div></div>
    <div class="sos-opt" onclick="startCoach('ecoute');navTo('coach')"><div class="sos-opt-ic">💬</div><div><div class="sos-opt-title">Parler à Liberty</div><div class="sos-opt-sub">Être écoutée sans jugement</div></div><div class="sos-arrow">›</div></div>
    <div class="sos-opt" onclick="showMotsDoux()"><div class="sos-opt-ic">🌿</div><div><div class="sos-opt-title">Des mots doux</div><div class="sos-opt-sub">Une pensée rien que pour toi</div></div><div class="sos-arrow">›</div></div>
    <div class="sos-opt" onclick="navTo('journal')"><div class="sos-opt-ic">📓</div><div><div class="sos-opt-title">Écrire ce que je ressens</div><div class="sos-opt-sub">Vider ce que je porte</div></div><div class="sos-arrow">›</div></div>
    <div class="mots-box" id="motsBox"><div class="mots-text" id="motsTxt"></div><button class="mots-btn" onclick="newMotDoux()">Un autre 🌿</button></div>
  </div>
</div>

</div><!-- /app -->

<!-- PLAYER -->
<div class="player-ov" id="playerOv">
  <div class="player-top" style="max-width:430px;width:100%;">
    <button class="player-close-btn" onclick="closePlayer()">←</button>
    <div class="player-meta"><div class="player-meta-title" id="pTitle">Méditation</div><div class="player-meta-sub" id="pSub">Guidée</div></div>
  </div>
  <div style="max-width:430px;width:100%;display:flex;flex-direction:column;align-items:center;">
    <div class="player-thumb-big" id="pThumb">🌙</div>
    <div id="pMain" style="width:100%">
      <div class="player-step-area"><div class="player-step-num" id="pStepNum"></div><div class="player-step-text" id="pStepTxt"></div></div>
      <div class="player-timer-big" id="pTimer">0:00</div>
      <div class="player-prog"><div class="player-prog-fill" id="pFill" style="width:0%"></div></div>
      <div class="player-ctrls">
        <button class="player-sec-btn" onclick="prevStep()">⏮</button>
        <button class="player-main-btn" id="pPlayBtn" onclick="togglePlay()">▶</button>
        <button class="player-sec-btn" onclick="nextStep()">⏭</button>
        <button class="player-sec-btn" id="voiceToggleBtn" onclick="toggleVoice()">🔊</button>
      </div>
    </div>
    <div class="player-done" id="pDone">
      <div class="player-done-icon">🌿</div>
      <div class="player-done-title">Bien fait !</div>
      <div class="player-done-sub">Tu viens de t'offrir un moment rien que pour toi.<br>C'est déjà un acte d'amour envers toi-même.</div>
      <button class="player-done-btn" onclick="closePlayer()">Fermer 🌿</button>
    </div>
  </div>
</div>

<button class="sos-fab" onclick="navTo('sos')">🤍</button>

<nav class="nav">
  <button class="nav-btn act" id="n-accueil" onclick="navTo('accueil')"><span class="nav-icon">🏠</span><span class="nav-lbl">Accueil</span></button>
  <button class="nav-btn" id="n-respirer" onclick="navTo('respirer')"><span class="nav-icon">🫁</span><span class="nav-lbl">Respire</span></button>
  <button class="nav-center" onclick="startCoach('ecoute');navTo('coach')">💬</button>
  <button class="nav-btn" id="n-journal" onclick="navTo('journal')"><span class="nav-icon">📓</span><span class="nav-lbl">Journal</span></button>
  <button class="nav-btn" id="n-profil" onclick="navTo('profil')"><span class="nav-icon">👤</span><span class="nav-lbl">Profil</span></button>
</nav>

<script>
const S={g:(k,d)=>{try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):d;}catch(e){return d;}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};

// DATA
const COEURS=["Tu n'as pas besoin d'être parfaite. Tu as seulement besoin d'être présente.","Être forte n'est pas un compliment, c'est une prison. Tu as le droit de poser le poids.","Tenir debout ne veut pas dire ne jamais tomber. Ça veut dire se relever encore, même à genoux.","Prendre soin de toi n'est pas un luxe. C'est la condition pour prendre soin des autres.","Ta fatigue est réelle. Tes limites sont légitimes. Tu mérites du repos sans culpabilité.","Ce que tu fais chaque jour, en silence, est immense. Tu n'as pas à le prouver.","La douceur que tu donnes aux autres, apprends à te l'offrir.","Tu n'as pas à tout porter. Poser un fardeau, c'est parfois l'acte le plus courageux.","Ta valeur ne dépend pas de ta productivité. Tu mérites d'exister sans rien produire.","Il est ok de ne pas avoir toutes les réponses. Tu fais de ton mieux avec ce que tu as."];

const SILENCE_PROMPTS=["Qu'est-ce que tu portes en silence aujourd'hui ?","Qu'est-ce qui t'a épuisée cette semaine ?","Ce dont j'aurais besoin mais que je n'ose pas demander...","Une chose que j'aimerais lâcher...","Ce que personne ne voit de ma journée...","Si tu pouvais te dire une chose avec douceur, ce serait...","Qu'est-ce qui te manque en ce moment ?"];

const MOTS_DOUX=["Tu es une maman extraordinaire, même les jours où tu ne te sens pas à la hauteur.","Ce que tu traverses est difficile. Tu n'as pas à faire semblant que ça va.","Tu mérites autant de soin que tu en donnes aux autres.","Ton épuisement est la preuve de tout ce que tu donnes. Il est temps de recevoir.","Tu n'es pas seule, même quand ça semble le cas.","Respire. Ce moment difficile a une fin. Tu es plus forte que tu ne le crois.","Il est normal de ne pas avoir toujours la force. C'est humain. Tu es humaine.","Tu es une bonne maman. Les bonnes mamans doutent aussi.","Ton amour pour tes enfants est visible dans chaque geste, même quand tu es épuisée.","Aujourd'hui tu as tenu. C'est déjà énorme."];

const PLANS={
  0:{sub:"Tu vas bien — profitons-en pour nourrir ton énergie.",items:[{i:"🌿",t:"Respiration du matin",d:"Cohérence cardiaque · 3 min"},{i:"✍️",t:"Écrire 3 choses positives",d:"Journal de gratitude · 5 min"},{i:"🎵",t:"Écouter & me recentrer",d:"Musique apaisante · 6 min"},{i:"⭐",t:"Ma mission du jour",d:"Intention positive · 1 min"}]},
  1:{sub:"Tu es fatiguée — sois douce avec toi. Rien que le nécessaire.",items:[{i:"🫁",t:"Respiration douce",d:"Anti-fatigue · 3 min"},{i:"💧",t:"Boire un grand verre d'eau",d:"Geste de soin · 1 min"},{i:"🌙",t:"Méditation sommeil",d:"Récupération · 10 min"},{i:"🤍",t:"Un mot doux pour moi",d:"Bienveillance · 2 min"}]},
  2:{sub:"Tu es stressée — on va respirer ensemble et poser ce qui t'agite.",items:[{i:"🫁",t:"Cohérence cardiaque",d:"Anti-stress immédiat · 5 min"},{i:"✍️",t:"Vider ma tête sur papier",d:"Ce que je porte · 5 min"},{i:"🦋",t:"Méditation anxiété",d:"Apaiser l'anxiété · 15 min"},{i:"☕",t:"Pause sans écran",d:"Déconnexion douce · 5 min"}]},
  3:{sub:"Tu es triste — c'est ok. Tu as le droit d'être là où tu es.",items:[{i:"🤍",t:"Respirer avec moi",d:"Présence douce · 3 min"},{i:"💬",t:"Parler à Coach Liberty",d:"Être entendue · 10 min"},{i:"🌊",t:"Méditation lâcher prise",d:"Libérer ce qui pèse · 18 min"},{i:"📓",t:"Ce que je porte en silence",d:"Poser mes mots · 5 min"}]},
  4:{sub:"Tu as de l'énergie — capitalisons dessus pour ce qui compte.",items:[{i:"⚡",t:"Booster mon énergie",d:"Méditation dynamisante · 12 min"},{i:"🎯",t:"Ma priorité du jour",d:"Clarifier mon intention · 2 min"},{i:"💪",t:"Méditation confiance",d:"Renforcer ma confiance · 14 min"},{i:"✍️",t:"Écrire mes intentions",d:"Journal positif · 5 min"}]}
};

const MEDIAS=[
  {id:1,cat:"sommeil",icon:"🌙",title:"Retrouver le sommeil",sub:"Méditation guidée",dur:"20 min",voice:"https://pub-54dad2dc7a724379a8018610e7180ec4.r2.dev/Retrouver%20le%20sommeil.mp3",steps:[
    {n:"Étape 1/5",t:"Allonge-toi confortablement. Ferme les yeux. Sens ton corps qui s'enfonce doucement. Tu n'as rien à faire, nulle part où aller. Laisse chaque expiration te rapprocher du repos.",sec:120},
    {n:"Étape 2/5",t:"Inspire lentement par le nez en comptant jusqu'à 4. Retiens doucement jusqu'à 4. Expire par la bouche jusqu'à 6. Répète ce cycle 5 fois. Laisse ton corps se détendre à chaque expiration.",sec:150},
    {n:"Étape 3/5",t:"Visualise un endroit où tu te sens en sécurité et en paix. Peut-être une plage au coucher du soleil, une forêt calme, ou ta pièce préférée. Observe les détails — les couleurs, les sons. Tu es en sécurité ici.",sec:180},
    {n:"Étape 4/5",t:"Scanne ton corps de la tête aux pieds. Chaque partie que tu touches avec ton attention se détend. Front... épaules... bras... ventre... jambes... pieds. Tu laisses partir toutes les tensions.",sec:180},
    {n:"Étape 5/5",t:"Tu es dans ton espace de sécurité. Ton corps est lourd et détendu. Tes pensées s'éloignent comme des nuages. Laisse le sommeil venir à toi naturellement. Tu mérites ce repos.",sec:180}
  ]},
  {id:2,cat:"stress",icon:"🦋",title:"Apaiser l'anxiété",sub:"Méditation guidée",dur:"15 min",steps:[
    {n:"Étape 1/4",t:"Assieds-toi confortablement. Pose tes deux pieds à plat sur le sol. Sens le contact avec la terre. Tu es ici. Tu es présente. Rien ne peut t'atteindre dans cet espace.",sec:90},
    {n:"Étape 2/4",t:"Nomme 5 choses que tu vois autour de toi. 4 choses que tu peux toucher. 3 sons que tu entends. 2 odeurs que tu perçois. 1 chose que tu ressens dans ton corps. Tu reviens au présent.",sec:150},
    {n:"Étape 3/4",t:"Imagine ton anxiété comme un nuage gris dans ta poitrine. À chaque expiration, ce nuage devient un peu plus petit. Il se dissout doucement, respiration après respiration.",sec:180},
    {n:"Étape 4/4",t:"Répète intérieurement : 'Je suis en sécurité maintenant. Ce moment difficile va passer. J'ai déjà traversé des tempêtes. Je suis plus forte que je ne le crois.'",sec:180}
  ]},
  {id:3,cat:"stress",icon:"🌊",title:"Lâcher prise",sub:"Méditation guidée",dur:"18 min",steps:[
    {n:"Étape 1/4",t:"Ferme les yeux. Prends 3 grandes respirations. À chaque expiration, laisse partir une tension. La première : tes épaules. La deuxième : ta mâchoire. La troisième : tout ce que tu essaies de contrôler.",sec:120},
    {n:"Étape 2/4",t:"Pense à quelque chose que tu portes — une inquiétude, une responsabilité. Imagine que tu déposes ce poids dans un fleuve qui coule devant toi. Tu le regardes partir doucement.",sec:200},
    {n:"Étape 3/4",t:"Tu ne peux pas tout contrôler. Et c'est ok. Ton seul travail en ce moment, c'est de respirer. Répète : 'Je fais de mon mieux. Ça suffit. Je me fais confiance.'",sec:180},
    {n:"Étape 4/4",t:"Reste dans ce silence quelques instants. Remarque comme tu te sens un peu plus légère. Tu as posé le poids un moment. Tu peux toujours le reprendre plus tard. Mais pour l'instant, tu souffles.",sec:160}
  ]},
  {id:4,cat:"confiance",icon:"⭐",title:"Retrouver confiance",sub:"Méditation guidée",dur:"14 min",steps:[
    {n:"Étape 1/3",t:"Pose une main sur ton cœur. Sens les battements — ce cœur qui bat pour toi sans jamais s'arrêter. Tu es vivante. Tu es là. C'est déjà extraordinaire.",sec:120},
    {n:"Étape 2/3",t:"Pense à un moment dans ta vie où tu as été forte — même une petite chose. Où tu as tenu bon. Cette force existe en toi. Elle est toujours là, même quand tu ne la vois pas.",sec:200},
    {n:"Étape 3/3",t:"Dis-toi ces mots : 'Je mérite d'être heureuse. Je mérite d'être aimée. Je suis capable. Je suis assez. Je suis suffisante, exactement comme je suis.'",sec:160}
  ]},
  {id:5,cat:"energie",icon:"⚡",title:"Booster mon énergie",sub:"Méditation guidée",dur:"12 min",steps:[
    {n:"Étape 1/3",t:"Assieds-toi bien droite. Redresse les épaules. Lève légèrement le menton. Cette posture envoie un message à ton cerveau : tu es prête. Prends 5 grandes respirations profondes et dynamiques.",sec:100},
    {n:"Étape 2/3",t:"Visualise une lumière dorée qui entre dans ton corps à chaque inspiration. Elle remplit tes poumons, ton ventre, tes bras, tes jambes. À chaque expiration, tu évacues la fatigue et le doute.",sec:180},
    {n:"Étape 3/3",t:"Affirme : 'Aujourd'hui j'ai de l'énergie. Je suis capable d'accomplir ce qui compte. Je choisis de me concentrer sur ce qui me fait du bien. Je suis prête.'",sec:120}
  ]},
  {id:6,cat:"sommeil",icon:"🌙",title:"Rituel du soir",sub:"Méditation apaisante",dur:"10 min",steps:[
    {n:"Étape 1/3",t:"La journée se termine. Tu as fait de ton mieux avec ce que tu avais. Quelle que soit cette journée, elle t'appartient. Maintenant il est temps de la lâcher.",sec:120},
    {n:"Étape 2/3",t:"Pense à une seule chose pour laquelle tu es reconnaissante aujourd'hui. Même minuscule. Un café chaud. Un rayon de soleil. Un sourire. Ce moment existe. Il compte.",sec:150},
    {n:"Étape 3/3",t:"Demain est un nouveau jour. Tu n'as pas à le résoudre ce soir. Pour l'instant, ton seul travail est de dormir. Ferme les yeux. Tu l'as mérité.",sec:150}
  ]},
  {id:7,cat:"maternite",icon:"🤱",title:"La maman que je suis",sub:"Méditation pour mamans",dur:"12 min",steps:[
    {n:"Étape 1/3",t:"Tu es maman. C'est le rôle le plus exigeant qui soit — et aussi le plus invisible. Aujourd'hui, on va prendre le temps de reconnaître tout ce que tu fais, souvent sans que personne ne le remarque.",sec:120},
    {n:"Étape 2/3",t:"Pense à un moment cette semaine où tu as été là pour ton enfant. Pas parfaitement — juste là. Cette présence, c'est de l'amour. Et cet amour, il suffit. Tu es suffisante.",sec:180},
    {n:"Étape 3/3",t:"Rappelle-toi : une bonne maman n'est pas une maman parfaite. C'est une maman qui essaie, qui aime, qui se relève. Tu es cette maman. Chaque jour. Même fatigué.",sec:150}
  ]},
  {id:8,cat:"maternite",icon:"👶",title:"Pour les papas aussi",sub:"Méditation pour parents",dur:"10 min",steps:[
    {n:"Étape 1/3",t:"Tu es parent. Et comme tous les parents, tu portes parfois plus que tu ne le montres. Cette méditation est pour toi aussi — parce que prendre soin de soi, c'est mieux prendre soin des autres.",sec:120},
    {n:"Étape 2/3",t:"Pense à quelque chose que tu as fait pour ta famille cette semaine. Même petit. Un repas, une présence, un câlin donné malgré la fatigue. C'est de l'amour sous toutes ses formes.",sec:180},
    {n:"Étape 3/3",t:"Répète : 'Je fais de mon mieux. Mon amour est réel même quand je suis épuisé. Je mérite aussi de prendre soin de moi.' Inspire. Expire. Tu es assez.",sec:150}
  ]},
  {id:9,cat:"amour",icon:"🌸",title:"M'aimer comme j'aime",sub:"Amour de soi guidé",dur:"16 min",steps:[
    {n:"Étape 1/4",t:"Ferme les yeux. Pense à quelqu'un que tu aimes profondément — un enfant, un proche. Ressens cet amour dans ta poitrine. Cette douceur, cette bienveillance, cette patience.",sec:120},
    {n:"Étape 2/4",t:"Maintenant retourne cet amour vers toi. Avec la même douceur. La même patience. La même bienveillance. Tu mérites cet amour autant que les personnes que tu aimes.",sec:180},
    {n:"Étape 3/4",t:"Pose une main sur ton cœur. Dis-toi : 'Je m'aime. Je me pardonne. Je prends soin de moi.' Ces mots peuvent sembler difficiles — c'est normal. Répète-les quand même.",sec:160},
    {n:"Étape 4/4",t:"L'amour de soi n'est pas de l'égoïsme. C'est la fondation de tout. Quand tu t'aimes, tu as plus à donner. Commence par toi. Tu en as le droit.",sec:140}
  ]},
  {id:10,cat:"amour",icon:"💗",title:"Mon corps, mon alliée",sub:"Bienveillance corporelle",dur:"14 min",steps:[
    {n:"Étape 1/3",t:"Ferme les yeux. Prends conscience de ton corps en ce moment. Sans le juger. Sans le comparer. Juste le remarquer. Ce corps qui respire, qui bat, qui te porte chaque jour.",sec:120},
    {n:"Étape 2/3",t:"Parcours ton corps avec de la reconnaissance. Tes pieds qui te portent. Tes mains qui créent et donnent. Ton ventre qui a peut-être porté la vie. Chaque partie mérite ta gratitude.",sec:200},
    {n:"Étape 3/3",t:"Répète : 'Mon corps fait de son mieux. Je l'accueille tel qu'il est. Je ne le compare pas. Je le respecte. Il est mon foyer.' Inspire doucement. Tu es chez toi.",sec:160}
  ]},
  {id:11,cat:"aidant",icon:"🤲",title:"Accompagner sans s'oublier",sub:"Méditation proche aidant",dur:"14 min",voice:"https://pub-54dad2dc7a724379a8018610e7180ec4.r2.dev/Accompagner%20sans%20s%E2%80%99oublier.mp3",steps:[
    {n:"Étape 1/3",t:"Tu accompagnes quelqu'un que tu aimes. Cette place n'est pas facile — on te demande d'être forte pour deux, souvent sans que personne ne prenne soin de toi en retour. Aujourd'hui, on prend soin de toi.",sec:130},
    {n:"Étape 2/3",t:"Tu peux aimer profondément et être épuisée en même temps. Les deux ne s'annulent pas. Ta fatigue ne dit rien de la qualité de ton amour — elle dit juste que tu es humaine, avec des limites.",sec:190},
    {n:"Étape 3/3",t:"Répète : 'Prendre soin de moi n'est pas abandonner l'autre. C'est ce qui me permet de continuer. Je mérite aussi d'être portée, parfois.' Respire. Tu as le droit d'exister en dehors de ce rôle.",sec:150}
  ]},
  {id:12,cat:"maternite",icon:"😤",title:"Poser la frustration",sub:"Pour parents à bout",dur:"10 min",steps:[
    {n:"Étape 1/3",t:"Quelque chose t'a frustrée. C'est ok. Tu as le droit d'être frustrée. Ce n'est pas de la faiblesse — c'est de l'humanité. Commence par reconnaître ce que tu ressens sans le juger.",sec:120},
    {n:"Étape 2/3",t:"Prends une grande inspiration et sur l'expiration, laisse sortir la frustration. Visualise-la quitter ton corps comme une vapeur. Elle sort. Elle se disperse. Tu retrouves de l'espace.",sec:160},
    {n:"Étape 3/3",t:"Après la frustration, qu'y a-t-il ? Souvent une attente déçue, un besoin non comblé. Qu'est-ce dont tu avais besoin ? Peux-tu te l'offrir toi-même aujourd'hui ?",sec:140}
  ]},
  {id:13,cat:"confiance",icon:"💪",title:"Je me fais confiance",sub:"Renforcement intérieur",dur:"12 min",steps:[
    {n:"Étape 1/3",t:"Tu prends des décisions chaque jour. Des centaines. Grandes et petites. Et la plupart du temps, tu fais de ton mieux. Cette femme qui décide, qui agit — c'est toi. Et elle est compétente.",sec:120},
    {n:"Étape 2/3",t:"Pense à une décision que tu as prise dont tu es fière. Une fois que tu as dit non. Une fois où tu as tenu bon. Cette capacité est en toi. Elle ne t'a pas quittée.",sec:180},
    {n:"Étape 3/3",t:"Répète : 'Je me fais confiance. Je sais ce qui est bon pour moi. Je n'ai pas besoin de la validation de tout le monde. Mon instinct est fiable. Je m'écoute.'",sec:150}
  ]},
  {id:14,cat:"stress",icon:"🧘",title:"Pleine conscience",sub:"Ancrage dans le présent",dur:"15 min",steps:[
    {n:"Étape 1/4",t:"Installe-toi confortablement. Sens le poids de ton corps. Le contact de tes pieds avec le sol. La texture de ce sur quoi tu es assis. Tu es ici. Tu es présente. C'est suffisant.",sec:120},
    {n:"Étape 2/4",t:"Observe ta respiration sans la contrôler. L'air qui entre. L'air qui sort. Le léger mouvement de ta poitrine. Tu n'as rien à faire d'autre que remarquer.",sec:180},
    {n:"Étape 3/4",t:"Des pensées arrivent ? Observe-les sans les suivre. Comme des nuages dans le ciel. Tu es le ciel — pas les nuages. Laisse-les passer et reviens doucement à ta respiration.",sec:180},
    {n:"Étape 4/4",t:"Tu viens de t'offrir un moment de présence pure. Dans un monde qui va vite, s'arrêter est un acte courageux. Tu peux revenir à cet espace à tout moment. Il est toujours là.",sec:120}
  ]},
  {id:15,cat:"maternite",icon:"🌿",title:"La charge mentale",sub:"Pour les esprits surchargés",dur:"14 min",voice:"https://pub-54dad2dc7a724379a8018610e7180ec4.r2.dev/La%20charge%20mentale.mp3",steps:[
    {n:"Étape 1/3",t:"Ta tête est pleine. Les listes, les rendez-vous, les inquiétudes, ce qui reste à faire. C'est réel et c'est épuisant. Cette méditation ne va pas tout résoudre — mais elle va t'aider à souffler.",sec:120},
    {n:"Étape 2/3",t:"Imagine un tableau blanc. Tout ce qui encombre ton esprit, note-le mentalement sur ce tableau. Chaque tâche, chaque souci. Maintenant efface tout d'un coup. Ton esprit est vide, blanc, calme. Juste pour maintenant.",sec:200},
    {n:"Étape 3/3",t:"La charge mentale reviendra. Mais tu sais maintenant que tu peux faire une pause. Que ton cerveau peut se reposer. Répète : 'Je n'ai pas à tout gérer seule. Je peux demander de l'aide. Je mérite du soutien.'",sec:160}
  ]},
  {id:16,cat:"amour",icon:"🦋",title:"Me pardonner",sub:"Libération de la culpabilité",dur:"16 min",steps:[
    {n:"Étape 1/4",t:"La culpabilité. Cette vieille compagne que tu connais bien. Aujourd'hui on va lui parler différemment. La culpabilité n'est pas une preuve que tu es mauvaise — c'est la preuve que tu tiens à faire bien.",sec:120},
    {n:"Étape 2/4",t:"Pense à quelque chose qui te pèse. Une chose que tu regrettes. Accueille ce sentiment sans le combattre. Il est là parce que tu aimes. C'est une forme de conscience.",sec:180},
    {n:"Étape 3/4",t:"Maintenant dis-toi : 'J'ai fait de mon mieux avec ce que j'avais à ce moment-là. J'avais moins d'énergie, moins d'information, moins de ressources. Je me pardonne.' Ces mots sont vrais.",sec:180},
    {n:"Étape 4/4",t:"Te pardonner ne veut pas dire que c'était parfait. Ça veut dire que tu te donnes la permission d'avancer. D'être humaine. D'essayer encore. Tu mérites ce pardon.",sec:140}
  ]},
  {id:17,cat:"sommeil",icon:"⭐",title:"Méditation de gratitude",sub:"Rituel du soir",dur:"8 min",steps:[
    {n:"Étape 1/2",t:"Ce soir, avant de dormir, rappelle-toi trois choses pour lesquelles tu es reconnaissante. Pas des grandes choses — les petites aussi comptent. Un moment de calme. Une personne qui a souri. Un repas partagé.",sec:180},
    {n:"Étape 2/2",t:"La gratitude change notre regard sans changer notre situation. Elle ne nie pas les difficultés — elle leur donne une proportion. Tu as traversé cette journée. Tu es là. C'est déjà quelque chose.",sec:180}
  ]},
  {id:18,cat:"energie",icon:"🌅",title:"Rituel du matin",sub:"Démarrer avec douceur",dur:"8 min",steps:[
    {n:"Étape 1/2",t:"La journée commence. Avant de te lever, prends 2 minutes pour toi. Prends 3 grandes respirations. Étire-toi doucement. Remercie ton corps d'avoir récupéré pendant la nuit. Tu es prête.",sec:180},
    {n:"Étape 2/2",t:"Pose une intention pour ta journée. Pas une liste de tâches — une intention. 'Aujourd'hui je serai douce avec moi.' 'Aujourd'hui je demanderai de l'aide.' 'Aujourd'hui je remarquerai les belles choses.' Une intention, c'est une direction.",sec:180}
  ]},
  {id:19,cat:"confiance",icon:"🌟",title:"Je suis assez",sub:"Anti-syndrome de l'imposteur",dur:"12 min",steps:[
    {n:"Étape 1/3",t:"Tu doutes de toi. Tu te compares. Tu penses que les autres font mieux, sont mieux, ont mieux. Cette voix intérieure qui minimise tout ce que tu fais — c'est le syndrome de l'imposteur. Et il ment.",sec:120},
    {n:"Étape 2/3",t:"Fais la liste de ce que tu sais faire. De ce que tu as accompli. De ce que tu apportes — à tes proches, à ton travail, à ceux qui t'entourent. Cette liste est réelle. Elle te définit autant que tes doutes.",sec:200},
    {n:"Étape 3/3",t:"Répète avec conviction : 'Je suis assez. Je mérite ma place. Mes réalisations sont réelles. Je n'ai pas à me justifier d'exister et de prendre de la place.' Dis-le jusqu'à ce que ça résonne.",sec:150}
  ]},
  {id:20,cat:"aidant",icon:"💛",title:"Ce que personne ne voit",sub:"Pour les maladies invisibles",dur:"12 min",steps:[
    {n:"Étape 1/2",t:"Tu portes, ou tu accompagnes quelqu'un qui porte, quelque chose que les autres ne voient pas. Pas de plâtre, pas de béquilles — juste une fatigue, une douleur, une lutte silencieuse qu'on te demande de prouver sans cesse.",sec:180},
    {n:"Étape 2/2",t:"Tu n'as rien à prouver ici. Ce que tu vis est réel, même invisible. Répète : 'Je n'ai pas besoin qu'on me croie pour que ce soit vrai. Ma réalité m'appartient.' Respire. Tu es entendue, ici, maintenant.",sec:180}
  ]}
];

// ONBOARDING
let onbR='Maman';
function pickR(btn){document.querySelectorAll('.onb-role').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');onbR=btn.dataset.r;}
function finishOnb(){const n=document.getElementById('onbName').value.trim();if(!n){document.getElementById('onbName').focus();return;}S.s('u:prenom',n);S.s('u:role',onbR);S.s('u:since',new Date().toISOString().split('T')[0]);document.getElementById('onb').classList.add('hidden');initApp();}

// INIT
function initApp(){
  const p=S.g('u:prenom',null);if(!p)return;
  const role=S.g('u:role','Maman');const emoji=role==='Papa'?'🌱':'🌸';
  document.getElementById('gName').textContent=emoji+' '+p;
  document.getElementById('coachUserName').textContent=p;
  const now=new Date();
  document.getElementById('gDate').textContent=now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  document.getElementById('hjDate').textContent=now.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
  const ci=Math.floor(Date.now()/86400000)%COEURS.length;
  document.getElementById('coeurText').textContent='"'+COEURS[ci]+'"';
  const si=Math.floor(Date.now()/86400000)%SILENCE_PROMPTS.length;
  document.getElementById('silencePrompt').textContent='"'+SILENCE_PROMPTS[si]+'"';
  buildPlan(0);buildMediaList(MEDIAS);updatePierres();loadProfil();loadJournal();
}

// NAV
function navTo(p){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('act'));
  document.getElementById('s-'+p)?.classList.add('active');
  document.getElementById('n-'+p)?.classList.add('act');
  window.scrollTo(0,0);
}

// MOOD
function pickMood(el){document.querySelectorAll('.mood-chip').forEach(m=>m.classList.remove('sel'));el.classList.add('sel');S.s('mood:today',el.dataset.m);addPierre(1);}

// COEUR
function newCoeur(){const i=(S.g('ci',0)+1)%COEURS.length;S.s('ci',i);document.getElementById('coeurText').textContent='"'+COEURS[i]+'"';addPierre(1);}

// PLAN
function selH(el){document.querySelectorAll('.ph-chip').forEach(c=>c.classList.remove('sel'));el.classList.add('sel');buildPlan(parseInt(el.dataset.h));}
function buildPlan(idx){
  const p=PLANS[idx];
  document.getElementById('planSub').textContent='"'+p.sub+'"';
  var html_items = '';
  for(var i=0;i<p.items.length;i++){
    var it=p.items[i];
    html_items += '<div class="plan-item" id="pi'+i+'" onclick="togglePI(this)"><div class="pi-badge">'+it.i+'</div><div class="pi-info"><div class="pi-title">'+it.t+'</div><div class="pi-dur">'+it.d+'</div></div><div class="pi-check">&#x25CB;</div></div>';
  }
  document.getElementById('planList').innerHTML=html_items;
}
function togglePI(el){el.classList.toggle('done');el.querySelector('.pi-check').textContent=el.classList.contains('done')?'✓':'○';if(el.classList.contains('done'))addPierre(2);}

// PIERRES
function addPierre(n){S.s('pierres',S.g('pierres',0)+n);updatePierres();}
function updatePierres(){
  const p=S.g('pierres',0);
  document.getElementById('sPierres').textContent=p;
  document.getElementById('arbreCount').textContent=p;
  document.getElementById('arbreEmoji').textContent=p>=50?'🌳':p>=20?'🌲':p>=10?'🌿':'🌱';
}

// JOURNAL
function pickHJ(el){document.querySelectorAll('.hj-e').forEach(e=>e.classList.remove('sel'));el.classList.add('sel');}
function saveJournal(){const q1=document.getElementById('jq1').value.trim(),q2=document.getElementById('jq2').value.trim(),q3=document.getElementById('jq3').value.trim();if(!q1&&!q2&&!q3)return;const e=S.g('j:entries',[]);e.push({date:new Date().toLocaleDateString('fr-FR'),q1,q2,q3});S.s('j:entries',e);document.getElementById('jq1').value='';document.getElementById('jq2').value='';document.getElementById('jq3').value='';addPierre(5);loadJournal();alert('Journee enregistree!');}
function saveSilence(){const t=document.getElementById('silenceText').value.trim();if(!t)return;const e=S.g('s:entries',[]);e.push({date:new Date().toLocaleDateString('fr-FR'),text:t});S.s('s:entries',e);document.getElementById('silenceText').value='';addPierre(3);alert('Mots poses!');}
function loadJournal(){const e=S.g('j:entries',[]);const c=document.getElementById('journalEntries');if(!e.length){c.innerHTML='<div style="padding:14px 18px;font-size:12px;color:var(--text-l);font-style:italic">Tes premi&#232;res lignes t&#39;attendent &#x1F33F;</div>';return;}c.innerHTML=e.slice(-3).reverse().map(function(en){return '<div class="jhist-item"><div class="jhist-date">'+en.date+'</div><div class="jhist-txt">'+(en.q1||en.q2||en.q3||'—')+'</div></div>';}).join('');}

// RESPIRATION
let bT=null,bPi=0,bCy=0;
const BP=[{l:'Inspire...',d:4,s:'190px'},{l:'Retiens...',d:4,s:'190px'},{l:'Expire...',d:6,s:'150px'}];
function startBreath(){bCy=0;bPi=0;document.getElementById('bBtn').textContent='En cours... 🌿';document.getElementById('bBtn').disabled=true;runB();}
function runB(){if(bCy>=6){document.getElementById('bWord').textContent='Bien fait 🌿';document.getElementById('bNum').textContent='';document.getElementById('bPhase').textContent='';document.getElementById('bBtn').textContent='Recommencer';document.getElementById('bBtn').disabled=false;addPierre(5);return;}const p=BP[bPi];document.getElementById('bWord').textContent=p.l;document.getElementById('bRing').style.width=p.s;document.getElementById('bRing').style.height=p.s;let c=p.d;document.getElementById('bNum').textContent=c;document.getElementById('bPhase').textContent='Cycle '+(Math.floor(bCy/3)+1)+'/2';bT=setInterval(()=>{c--;document.getElementById('bNum').textContent=c;if(c<=0){clearInterval(bT);bPi=(bPi+1)%3;if(bPi===0)bCy++;runB();}},1000);}
// SONS AMBIANTS - générés avec Web Audio API (pas de fichiers externes)
let audioCtx=null,activeSounds={};
function getAudioCtx(){if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)();}return audioCtx;}

function toggleSon(el){
  try{
    const soundType=el.dataset.sound;
    const wasPlaying=el.classList.contains('playing');
    document.querySelectorAll('.son-card').forEach(c=>{c.classList.remove('playing');stopSound(c.dataset.sound);});
    if(!wasPlaying){
      el.classList.add('playing');
      const ctx=getAudioCtx();
      playSound(soundType);
      if(ctx.state==='suspended'){ctx.resume();}
    }
  }catch(err){
    alert('Son indisponible: '+err.message);
  }
}

function playSound(type){
  const ctx=getAudioCtx();
  stopSound(type);
  const gain=ctx.createGain();gain.gain.value=0.35;gain.connect(ctx.destination);
  let nodes=[];

  if(type==='vagues'){
    const bufferSize=2*ctx.sampleRate;
    const noiseBuffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);
    const output=noiseBuffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++)output[i]=Math.random()*2-1;
    const noise=ctx.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=400;
    const lfo=ctx.createOscillator();lfo.frequency.value=0.15;
    const lfoGain=ctx.createGain();lfoGain.gain.value=200;
    lfo.connect(lfoGain);lfoGain.connect(filter.frequency);
    noise.connect(filter);filter.connect(gain);
    noise.start();lfo.start();
    nodes=[noise,lfo];
  } else if(type==='pluie'){
    const bufferSize=2*ctx.sampleRate;
    const noiseBuffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);
    const output=noiseBuffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++)output[i]=(Math.random()*2-1)*0.5;
    const noise=ctx.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='highpass';filter.frequency.value=2000;
    noise.connect(filter);filter.connect(gain);
    noise.start();
    nodes=[noise];
  } else if(type==='foret'){
    const osc1=ctx.createOscillator();osc1.type='sine';osc1.frequency.value=220;
    const osc2=ctx.createOscillator();osc2.type='sine';osc2.frequency.value=330;
    const lfo=ctx.createOscillator();lfo.frequency.value=0.08;
    const lfoGain=ctx.createGain();lfoGain.gain.value=15;
    lfo.connect(lfoGain);lfoGain.connect(osc1.frequency);
    const g1=ctx.createGain();g1.gain.value=0.3;
    const g2=ctx.createGain();g2.gain.value=0.2;
    osc1.connect(g1);g1.connect(gain);
    osc2.connect(g2);g2.connect(gain);
    osc1.start();osc2.start();lfo.start();
    nodes=[osc1,osc2,lfo];
  } else if(type==='feu'){
    const bufferSize=2*ctx.sampleRate;
    const noiseBuffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);
    const output=noiseBuffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++)output[i]=Math.random()*2-1;
    const noise=ctx.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=800;filter.Q.value=0.5;
    const lfo=ctx.createOscillator();lfo.frequency.value=3;
    const lfoGain=ctx.createGain();lfoGain.gain.value=300;
    lfo.connect(lfoGain);lfoGain.connect(filter.frequency);
    noise.connect(filter);filter.connect(gain);
    noise.start();lfo.start();
    nodes=[noise,lfo];
  } else if(type==='nuit'){
    const osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=4200;
    const g=ctx.createGain();g.gain.value=0;
    osc.connect(g);g.connect(gain);
    osc.start();
    let chirping=true;
    const chirp=()=>{
      if(!chirping)return;
      g.gain.setValueAtTime(0,ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.4,ctx.currentTime+0.02);
      g.gain.linearRampToValueAtTime(0,ctx.currentTime+0.08);
      setTimeout(chirp,150+Math.random()*400);
    };
    chirp();
    nodes=[osc];
    activeSounds[type+'_stop']=()=>{chirping=false;};
  } else if(type==='tibetains'){
    const freqs=[136.1,144,163];
    freqs.forEach(f=>{
      const osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=f;
      const g=ctx.createGain();g.gain.value=0.12;
      osc.connect(g);g.connect(gain);
      osc.start();
      nodes.push(osc);
    });
  } else if(type==='ruisseau'){
    const bufferSize=2*ctx.sampleRate;
    const noiseBuffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);
    const output=noiseBuffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++)output[i]=Math.random()*2-1;
    const noise=ctx.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=1400;filter.Q.value=0.7;
    const lfo=ctx.createOscillator();lfo.frequency.value=0.6;
    const lfoGain=ctx.createGain();lfoGain.gain.value=500;
    lfo.connect(lfoGain);lfoGain.connect(filter.frequency);
    noise.connect(filter);filter.connect(gain);
    noise.start();lfo.start();
    nodes=[noise,lfo];
  } else if(type==='vent'){
    const bufferSize=2*ctx.sampleRate;
    const noiseBuffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);
    const output=noiseBuffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++)output[i]=Math.random()*2-1;
    const noise=ctx.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=700;
    const lfo=ctx.createOscillator();lfo.frequency.value=0.09;
    const lfoGain=ctx.createGain();lfoGain.gain.value=350;
    lfo.connect(lfoGain);lfoGain.connect(filter.frequency);
    noise.connect(filter);filter.connect(gain);
    noise.start();lfo.start();
    nodes=[noise,lfo];
  } else if(type==='carillon'){
    const freqs=[523.25,659.25,783.99,987.77];
    let idx=0;let ringing=true;
    const ring=()=>{
      if(!ringing)return;
      const osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=freqs[idx%freqs.length];
      const g=ctx.createGain();g.gain.setValueAtTime(0.18,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.8);
      osc.connect(g);g.connect(gain);
      osc.start();osc.stop(ctx.currentTime+1.8);
      idx++;
      setTimeout(ring,900+Math.random()*1400);
    };
    ring();
    nodes=[];
    activeSounds[type+'_stop']=()=>{ringing=false;};
  } else if(type==='ronron'){
    const osc=ctx.createOscillator();osc.type='sawtooth';osc.frequency.value=26;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=180;
    const lfo=ctx.createOscillator();lfo.frequency.value=4.2;
    const lfoGain=ctx.createGain();lfoGain.gain.value=8;
    lfo.connect(lfoGain);lfoGain.connect(osc.frequency);
    const g=ctx.createGain();g.gain.value=0.35;
    osc.connect(filter);filter.connect(g);g.connect(gain);
    osc.start();lfo.start();
    nodes=[osc,lfo];
  }

  activeSounds[type]={nodes,gain};
}

function stopSound(type){
  if(activeSounds[type]){
    activeSounds[type].nodes.forEach(n=>{try{n.stop();}catch(e){}});
    if(activeSounds[type+'_stop'])activeSounds[type+'_stop']();
    delete activeSounds[type];
  }
}

// MEDIA
function filterM(cat,el){document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('act'));el.classList.add('act');buildMediaList(cat==='tous'?MEDIAS:MEDIAS.filter(m=>m.cat===cat));}
function buildMediaList(list){document.getElementById('mediaList').innerHTML=list.map(function(m){return '<div class="media-item" onclick="openPlayer('+m.id+')"><div class="media-thumb">'+m.icon+'</div><div class="media-info"><div class="media-title">'+m.title+'</div><div class="media-sub">'+m.sub+'</div></div><div class="media-dur">'+m.dur+'</div><button class="media-play">&#9658;</button></div>';}).join('');}

// PLAYER
let pMedia=null,pStep=0,pIsPlaying=false,pTimer=null,pStepTime=0,pTotal=0;
const MEDIA_BG_SOUND={sommeil:'nuit',stress:'vagues',energie:'foret',confiance:'carillon',maternite:'ronron',amour:'ruisseau',aidant:'pluie'};
// VOIX GUIDÉE (synthèse vocale)
let voiceEnabled=true;
let frenchVoice=null;
function loadFrenchVoice(){
  if(!window.speechSynthesis)return;
  const voices=speechSynthesis.getVoices();
  frenchVoice=voices.find(v=>v.lang==='fr-FR'&&/female|femme|amelie|audrey|marie/i.test(v.name))
    ||voices.find(v=>v.lang==='fr-FR')
    ||voices.find(v=>v.lang.startsWith('fr'))
    ||null;
}
if(window.speechSynthesis){
  loadFrenchVoice();
  speechSynthesis.onvoiceschanged=loadFrenchVoice;
}
let realVoiceAudio=null;
function speakStep(text){
  if(!voiceEnabled)return;
  if(pMedia&&pMedia.voice){
    return;
  }
  if(!window.speechSynthesis)return;
  speechSynthesis.cancel();
  const utter=new SpeechSynthesisUtterance(text);
  utter.lang='fr-FR';
  if(frenchVoice)utter.voice=frenchVoice;
  utter.rate=0.85;
  utter.pitch=1.0;
  utter.volume=1.0;
  speechSynthesis.speak(utter);
}
function startRealVoice(){
  stopRealVoice();
  if(!pMedia||!pMedia.voice||!voiceEnabled)return;
  realVoiceAudio=new Audio(pMedia.voice);
  realVoiceAudio.addEventListener('loadedmetadata',()=>{
    computeSyncedTimings(realVoiceAudio.duration);
  });
  realVoiceAudio.addEventListener('timeupdate',()=>{
    if(pMedia.syncedTimings)updateStepFromAudioTime(realVoiceAudio.currentTime);
  });
  realVoiceAudio.addEventListener('ended',()=>{
    onMeditationEnd();
  });
  realVoiceAudio.play().catch(()=>{});
}
function computeSyncedTimings(totalDuration){
  const totalChars=pMedia.steps.reduce((a,s)=>a+s.t.length,0);
  let acc=0;
  pMedia.syncedTimings=pMedia.steps.map(s=>{
    const dur=(s.t.length/totalChars)*totalDuration;
    const start=acc;
    acc+=dur;
    return{start,end:acc};
  });
  pTotal=totalDuration;
}
function updateStepFromAudioTime(t){
  const timings=pMedia.syncedTimings;
  let idx=timings.findIndex(tm=>t>=tm.start&&t<tm.end);
  if(idx===-1)idx=t>=timings[timings.length-1].end?timings.length-1:0;
  if(idx!==pStep){
    pStep=idx;
    const s=pMedia.steps[pStep];
    document.getElementById('pStepNum').textContent=s.n;
    document.getElementById('pStepTxt').textContent=s.t;
  }
  const m=Math.floor((pTotal-t)/60),sc=Math.floor((pTotal-t)%60);
  document.getElementById('pTimer').textContent=m+':'+(sc<10?'0':'')+sc;
  document.getElementById('pFill').style.width=(t/pTotal*100)+'%';
}
function onMeditationEnd(){
  clearInterval(pTimer);pIsPlaying=false;
  document.getElementById('pMain').style.display='none';
  document.getElementById('pDone').style.display='block';
  addPierre(10);
}
function stopRealVoice(){
  if(realVoiceAudio){
    realVoiceAudio.pause();
    realVoiceAudio.currentTime=0;
    realVoiceAudio=null;
  }
}
let ambientAudio=null;
function toggleAmbientSound(){
  const btn=document.getElementById('ambientSoundBtn');
  if(ambientAudio&&!ambientAudio.paused){
    ambientAudio.pause();
    btn.textContent='▶';
    return;
  }
  if(!ambientAudio){
    ambientAudio=new Audio('https://pub-54dad2dc7a724379a8018610e7180ec4.r2.dev/Musicsommeil.mp3');
    ambientAudio.loop=true;
  }
  ambientAudio.play().catch(()=>{});
  btn.textContent='⏸';
}
function stopAmbientSound(){
  if(ambientAudio&&!ambientAudio.paused){
    ambientAudio.pause();
    const btn=document.getElementById('ambientSoundBtn');
    if(btn)btn.textContent='▶';
  }
}
function stopSpeaking(){
  if(window.speechSynthesis)speechSynthesis.cancel();
  stopRealVoice();
}
function toggleVoice(){
  voiceEnabled=!voiceEnabled;
  document.getElementById('voiceToggleBtn').textContent=voiceEnabled?'🔊':'🔇';
  if(!voiceEnabled){stopSpeaking();}
  else if(pMedia){
    if(pMedia.voice)startRealVoice();
    else speakStep(pMedia.steps[pStep].t);
  }
}

function openPlayer(id){pMedia=MEDIAS.find(m=>m.id===id);if(!pMedia)return;pStep=0;pIsPlaying=false;pStepTime=0;document.getElementById('pThumb').textContent=pMedia.icon;document.getElementById('pTitle').textContent=pMedia.title;document.getElementById('pSub').textContent=pMedia.sub;document.getElementById('pMain').style.display='block';document.getElementById('pDone').style.display='none';document.getElementById('pPlayBtn').textContent='▶';pTotal=pMedia.steps.reduce((a,s)=>a+s.sec,0);showStep();document.getElementById('pFill').style.width='0%';document.getElementById('playerOv').classList.add('vis');
  stopAmbientSound();
  if(pMedia.voice)startRealVoice();
}
function showStep(){const s=pMedia.steps[pStep];document.getElementById('pStepNum').textContent=s.n;document.getElementById('pStepTxt').textContent=s.t;updatePTimer();speakStep(s.t);}
function updatePTimer(){const s=pMedia.steps[pStep];const rem=s.sec-pStepTime;const m=Math.floor(rem/60),sc=rem%60;document.getElementById('pTimer').textContent=m+':'+(sc<10?'0':'')+sc;const el=pMedia.steps.slice(0,pStep).reduce((a,s)=>a+s.sec,0)+pStepTime;document.getElementById('pFill').style.width=(el/pTotal*100)+'%';}
function togglePlay(){pIsPlaying=!pIsPlaying;document.getElementById('pPlayBtn').textContent=pIsPlaying?'⏸':'▶';if(pIsPlaying){if(voiceEnabled&&window.speechSynthesis&&speechSynthesis.paused)speechSynthesis.resume();if(voiceEnabled&&realVoiceAudio&&realVoiceAudio.paused)realVoiceAudio.play().catch(()=>{});if(!pMedia.voice){pTimer=setInterval(()=>{pStepTime++;const s=pMedia.steps[pStep];if(pStepTime>=s.sec){pStepTime=0;nextStep();}else updatePTimer();},1000);}}else{clearInterval(pTimer);if(window.speechSynthesis&&speechSynthesis.speaking)speechSynthesis.pause();if(realVoiceAudio&&!realVoiceAudio.paused)realVoiceAudio.pause();}}
function nextStep(){
  if(pMedia.voice&&realVoiceAudio&&pMedia.syncedTimings){
    if(pStep<pMedia.steps.length-1){realVoiceAudio.currentTime=pMedia.syncedTimings[pStep+1].start+0.1;}
    return;
  }
  if(pStep<pMedia.steps.length-1){pStep++;pStepTime=0;showStep();}else{onMeditationEnd();}
}
function prevStep(){
  if(pMedia.voice&&realVoiceAudio&&pMedia.syncedTimings){
    if(pStep>0){realVoiceAudio.currentTime=pMedia.syncedTimings[pStep-1].start+0.1;}
    return;
  }
  if(pStep>0){pStep--;pStepTime=0;showStep();}
}
function closePlayer(){clearInterval(pTimer);pIsPlaying=false;document.getElementById('playerOv').classList.remove('vis');document.getElementById('pPlayBtn').textContent='▶';stopSpeaking();
  // if(pMedia){const bg=MEDIA_BG_SOUND[pMedia.cat];if(bg)stopSound(bg);}
}

// SOS
function showMotsDoux(){const el=document.getElementById('motsBox');el.classList.add('vis');newMotDoux();}
function newMotDoux(){document.getElementById('motsTxt').textContent='"'+MOTS_DOUX[Math.floor(Math.random()*MOTS_DOUX.length)]+'"';}

// COACH
let cMode=null,cHistory=[];
function startCoach(mode){cMode=mode;document.getElementById('coachIntro').classList.add('hidden');document.getElementById('coachChat').classList.remove('hidden');document.getElementById('coachMsgs').innerHTML='<div class="typing" id="coachTyping"><div class="td"></div><div class="td"></div><div class="td"></div></div>';cHistory=[];const first=mode==='ecoute'?"Je suis là. 🌿 Qu'est-ce qui te pèse en ce moment ?":"Je suis là pour t'accompagner. 🌿 Sur quoi tu voudrais avancer aujourd'hui ?";addCMsg(first,'bot');}
function quickStartFromChip(el){quickStart(el.dataset.mode,el.dataset.msg);}
function quickStart(mode,userMsg){
  cMode=mode;
  document.getElementById('coachIntro').classList.add('hidden');
  document.getElementById('coachChat').classList.remove('hidden');
  document.getElementById('coachMsgs').innerHTML='<div class="typing" id="coachTyping"><div class="td"></div><div class="td"></div><div class="td"></div></div>';
  cHistory=[];
  addCMsg(userMsg,'user');
  cHistory.push({role:'user',content:userMsg});
  addPierre(2);
  showTyping(true);
  callCoachAPI();
}
function backCoach(){document.getElementById('coachIntro').classList.remove('hidden');document.getElementById('coachChat').classList.add('hidden');}
function addCMsg(text,who){const area=document.getElementById('coachMsgs');const typing=document.getElementById('coachTyping');const div=document.createElement('div');div.className='msg '+who;div.textContent=text;area.insertBefore(div,typing);area.scrollTop=area.scrollHeight;}
function showTyping(v){document.getElementById('coachTyping').classList.toggle('vis',v);document.getElementById('coachMsgs').scrollTop=99999;}
async function sendCoach(){const inp=document.getElementById('coachInp');const text=inp.value.trim();if(!text)return;inp.value='';inp.style.height='auto';addCMsg(text,'user');cHistory.push({role:'user',content:text});addPierre(2);showTyping(true);callCoachAPI();}
async function callCoachAPI(){
const sysEcoute="Tu es Coach Liberty, un espace d'ecoute bienveillant cree par Liberty Serenity pour les parents epuises. Tu ecoutes avec douceur, tu valides les emotions sans minimiser. Tu ne donnes pas de conseils non sollicites. Tu poses au maximum une question douce a la fois. Reponses courtes : 3-4 phrases. Tutoiement chaleureux. Tu utilises avec parcimonie. Jamais de culpabilite. Si detresse severe, invite a appeler le 3114.";const sysAvancer="Tu es Coach Liberty, un coach bienveillant cree par Liberty Serenity. Tu aides les parents epuises a avancer avec des questions douces et des pistes concretes simples. Tutoiement chaleureux. 4-5 phrases max. Jamais de culpabilite.";const sys=cMode==="ecoute"?sysEcoute:sysAvancer;
try{const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,system:sys,messages:cHistory})});const data=await res.json();const reply=data.content?.find(b=>b.type==='text')?.text||'Je suis là pour toi 🌿';cHistory.push({role:'assistant',content:reply});showTyping(false);addCMsg(reply,'bot');}catch(e){showTyping(false);addCMsg('Un petit souci de connexion. Tu peux réessayer 🌿','bot');}}
document.getElementById('coachInp').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendCoach();}});
document.getElementById('coachInp').addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,90)+'px';});

// PROFIL
function loadProfil(){const p=S.g('u:prenom','');const since=S.g('u:since','');const role=S.g('u:role','Maman');document.getElementById('profilName').textContent=p||'Ton prénom';document.getElementById('pPrenom').value=p;document.getElementById('pavEmoji').textContent=role==='Papa'?'🌱':'🌸';if(since){const d=new Date(since);document.getElementById('profilSince').textContent='🌿 Membre depuis le '+d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});}document.getElementById('sJours').textContent=S.g('stat:jours',1);document.getElementById('sStreak').textContent=S.g('stat:streak',1);const av=S.g('profil:av',null);if(av){const img=document.getElementById('pavImg');img.src=av;img.style.display='block';document.getElementById('pavEmoji').style.display='none';}loadObjectifs();loadLettre();updateDetailStats();}
function saveProfil(){const p=document.getElementById('pPrenom').value.trim();S.s('u:prenom',p);document.getElementById('profilName').textContent=p||'Ton prénom';document.getElementById('gName').textContent=(S.g('u:role','Maman')==='Papa'?'🌱 ':'🌸 ')+p;alert('Profil enregistre!');}
document.getElementById('pavFile').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{S.s('profil:av',ev.target.result);const img=document.getElementById('pavImg');img.src=ev.target.result;img.style.display='block';document.getElementById('pavEmoji').style.display='none';};r.readAsDataURL(f);});
function resetApp(){localStorage.clear();location.reload();}

// OBJECTIFS
function toggleObj(el){el.classList.toggle('sel');const objs=Array.from(document.querySelectorAll('.obj-chip.sel')).map(c=>c.dataset.obj);S.s('objectifs',objs);}
function loadObjectifs(){const objs=S.g('objectifs',[]);document.querySelectorAll('.obj-chip').forEach(c=>{if(objs.includes(c.dataset.obj))c.classList.add('sel');});}

// LETTRE
function saveLettre(){const t=document.getElementById('lettreText').value.trim();if(!t)return;S.s('lettre',{text:t,date:new Date().toISOString()});document.getElementById('lettreConfirm').style.display='block';document.getElementById('lettreText').style.display='none';addPierre(10);alert('Lettre scellee!');}
function loadLettre(){const l=S.g('lettre',null);if(l){document.getElementById('lettreText').style.display='none';document.getElementById('lettreConfirm').style.display='block';}}

// STATS DÉTAILLÉES
function updateDetailStats(){
  document.getElementById('statMedits').textContent=S.g('stat:medits',0);
  document.getElementById('statBreath').textContent=S.g('stat:breath',0)+' min';
  const jEntries=S.g('j:entries',[]);document.getElementById('statJournal').textContent=jEntries.length;
  document.getElementById('statCoach').textContent=S.g('stat:coach',0);
}

// DÉBLOCAGE AUDIO PRÉCOCE (obligatoire sur iOS Safari/Chrome)
function unlockAudioOnce(){
  try{
    const ctx=getAudioCtx();
    if(ctx.state==='suspended'){ctx.resume();}
  }catch(e){}
  try{
    if(window.speechSynthesis){
      const primer=new SpeechSynthesisUtterance(' ');
      primer.volume=0;
      speechSynthesis.speak(primer);
    }
  }catch(e){}
}
document.addEventListener('touchend',unlockAudioOnce,{once:true,passive:true});

// START
if(S.g('u:prenom',null)){document.getElementById('onb').classList.add('hidden');initApp();}
</script>
</body>
</html>`;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};