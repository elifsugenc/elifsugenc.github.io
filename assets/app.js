(async () => {
  const STORE = 'elifsu-local-traces';
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const marker = sessionStorage.getItem('elifsu-next-page');
  const nav = performance.getEntriesByType('navigation')[0];
  sessionStorage.removeItem('elifsu-next-page');
  if (nav?.type === 'reload') {
    sessionStorage.removeItem('elifsu-lang');
  }
  if (marker !== path || nav?.type === 'reload') {
    sessionStorage.removeItem('elifsu-choice');
    sessionStorage.removeItem('elifsu-current-trace');
  }
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || link.target === '_blank') return;
    const url = new URL(link.href);
    if (url.origin === location.origin && url.pathname !== location.pathname)
      sessionStorage.setItem('elifsu-next-page', url.pathname.replace(/\/+$/, '') || '/');
  }, true);

  // ── Language switching (runs first, before Firebase) ──
  function colorizeDots(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentNode.classList.contains('dot-blue')) return;
      const text = node.nodeValue;
      if (/[ijİ]/g.test(text)) {
        const template = document.createElement('template');
        template.innerHTML = text.replace(/([ijİ])/g, '<span class="dot-blue">$1</span>');
        node.parentNode.replaceChild(template.content, node);
      }
    });
  }

  function setLanguage(lang) {
    try { sessionStorage.setItem('elifsu-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.dataset[lang]) {
        el.innerHTML = el.dataset[lang];
      }
    });
    document.querySelectorAll('h1, h2, h3').forEach(el => {
      if (!el.closest('.project')) {
        colorizeDots(el);
      }
    });
  }

  let savedLang = 'en';
  try { savedLang = sessionStorage.getItem('elifsu-lang') || 'en'; } catch (e) {}
  setLanguage(savedLang);

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });
  // ── End language switching ──

  const choice = sessionStorage.getItem('elifsu-choice');
  const modal = document.getElementById('consent');
  const live = document.getElementById('live');
  let trace;
  try { trace = JSON.parse(sessionStorage.getItem('elifsu-current-trace') || 'null'); } catch {}
  if (!trace || !trace.id) trace = {id: crypto.randomUUID(), started: Date.now(), points: [], dwells: [], clicks: []};
  
  // Firebase Setup
  let db = null, doc_fn = null, setDoc_fn = null;
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const { getFirestore, doc, setDoc, onSnapshot, collection, query, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
    const firebaseConfig = {
      apiKey: "AIzaSyAfU5_2JMufKlGFa5WBDO_kpdp38jV6A5s",
      authDomain: "traces-together.firebaseapp.com",
      projectId: "traces-together",
      storageBucket: "traces-together.firebasestorage.app",
      messagingSenderId: "537119213522",
      appId: "1:537119213522:web:35ab67f62add69968e6a0b"
    };
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    doc_fn = doc;
    setDoc_fn = setDoc;
    
    // Canlı olarak verileri dinle (Geriye dönük 300 trace)
    const q = query(collection(db, "traces"), orderBy("date", "desc"), limit(300));
    onSnapshot(q, (snapshot) => {
      const fbEntries = [];
      snapshot.forEach(d => { fbEntries.push(d.data()); });
      renderTraces(fbEntries.reverse());
    }, (error) => {
      console.error("Firebase listen error:", error);
    });
  } catch (e) {
    console.warn("Firebase couldn't load, falling back to local storage.", e);
  }

  const read = () => { try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch { return []; } };
  
  // Eğer eski yerel izler varsa onları otomatik olarak Firebase'e yükle ve yereli temizle (Göç)
  if (db && setDoc_fn && doc_fn) {
    const localTraces = read();
    if (localTraces.length > 0) {
      localTraces.forEach(async t => {
        try { await setDoc_fn(doc_fn(db, "traces", t.id), t); } catch(e){}
      });
      localStorage.removeItem(STORE);
    }
  }

  const save = async () => {
    if (sessionStorage.getItem('elifsu-choice') !== 'yes') return;
    sessionStorage.setItem('elifsu-current-trace', JSON.stringify(trace));
    if (trace.points.length < 2 && !trace.clicks.length) return;
    const traceDoc = {id: trace.id, date: new Date().toISOString(), points: trace.points, dwells: trace.dwells, clicks: trace.clicks, duration: Date.now() - trace.started};
    
    const entries = read().filter(entry => entry.id !== trace.id);
    entries.push(traceDoc);
    try { localStorage.setItem(STORE, JSON.stringify(entries.slice(-100))); } catch {}

    if (db && setDoc_fn && doc_fn) {
      try {
        await setDoc_fn(doc_fn(db, "traces", trace.id), traceDoc);
      } catch (e) {
        console.error("Firebase save error:", e);
      }
    }
  };

  const begin = value => { sessionStorage.setItem('elifsu-choice', value); modal.hidden = true; if (value === 'yes') {live.hidden = false; activate();} };
  const allowBtn = document.getElementById('allow');
  const declineBtn = document.getElementById('decline');
  if (allowBtn) allowBtn.addEventListener('click', () => begin('yes'));
  if (declineBtn) declineBtn.addEventListener('click', () => begin('no'));
  if (modal) {
    if (!choice) modal.hidden = false;
    else if (choice === 'yes') { live.hidden = false; activate(); }
  }

  let last = 0, anchor = null, anchorAt = 0;
  function activate() {
    document.getElementById('point-count').textContent = trace.points.length;
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || Date.now() - last < 80 || trace.points.length >= 3000) return;
      last = Date.now();
      const p = {x: clamp(Math.round(event.clientX / innerWidth * 1000), 0, 1000), y: clamp(Math.round(event.clientY / innerHeight * 1000), 0, 1000), t: Date.now() - trace.started};
      trace.points.push(p); document.getElementById('point-count').textContent = trace.points.length;
      if (!anchor || Math.hypot(p.x - anchor.x, p.y - anchor.y) > 8) {anchor = p; anchorAt = Date.now();}
    });
    window.addEventListener('click', event => {
      const p = {x: clamp(Math.round(event.clientX / innerWidth * 1000), 0, 1000), y: clamp(Math.round(event.clientY / innerHeight * 1000), 0, 1000), t: Date.now() - trace.started};
      trace.clicks.push(p);
    });
    setInterval(() => { if (!anchor || Date.now() - anchorAt < 420) return; const d = { ...anchor, duration: Date.now() - anchorAt }; const prev = trace.dwells.at(-1); if (prev?.t === d.t) prev.duration = d.duration; else trace.dwells.push(d); }, 160);
    setInterval(save, 5000); // reduced from 12s to 5s for better live feel
  }
  window.addEventListener('pagehide', save);
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const rays = [[-9,-7,-13,-10],[-3,-11,-4,-16],[5,-9,10,-14],[11,-2,16,-3],[8,8,14,11],[-2,11,-2,16],[-11,5,-16,8]];
  
  function drawing(e) {
    if (!e || !e.points) return '';
    const lines = e.points.slice(1).map((p,i) => { const a=e.points[i]; const speed=Math.hypot(p.x-a.x,p.y-a.y)/Math.max(40,p.t-a.t)*1000; return `<line x1="${a.x}" y1="${a.y}" x2="${p.x}" y2="${p.y}" stroke="#3157d7" stroke-opacity=".42" stroke-width="${clamp(9-speed*.045,1.1,9)}" stroke-linecap="round"/>`; }).join('');
    const dwells = (e.dwells||[]).map(d => `<circle cx="${d.x}" cy="${d.y}" r="${clamp(d.duration/160,7,45)}" fill="#3157d7" opacity=".04"/><circle cx="${d.x}" cy="${d.y}" r="${clamp(d.duration/300,3,24)}" fill="#3157d7" opacity=".12"/>`).join('');
    const clicks = (e.clicks||[]).map(c => `<g transform="translate(${c.x} ${c.y})" stroke="#3157d7" stroke-width="2.2" stroke-linecap="round">${rays.map(([x,y,x2,y2])=>`<path d="M${x} ${y} L${x2} ${y2}"/>`).join('')}</g>`).join('');
    return lines+dwells+clicks;
  }
  
  function pdf(entry) {
    const pts = entry.points || [], cmds = ['0.192 0.341 0.843 RG 1 w'];
    pts.slice(1).forEach((p,i) => { const a=pts[i]; cmds.push(`${(a.x*.52+35).toFixed(1)} ${(770-a.y*.66).toFixed(1)} m ${(p.x*.52+35).toFixed(1)} ${(770-p.y*.66).toFixed(1)} l S`); });
    const stream=cmds.join('\n')+'\n';
    const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R >>',`<< /Length ${stream.length} >>\nstream\n${stream}endstream`];
    let out='%PDF-1.4\n';const offsets=[0];objects.forEach((obj,i)=>{offsets.push(out.length);out+=`${i+1} 0 obj\n${obj}\nendobj\n`});const x=out.length;out+=`xref\n0 5\n0000000000 65535 f \n`;offsets.slice(1).forEach(n=>out+=`${String(n).padStart(10,'0')} 00000 n \n`);out+=`trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;const blob=new Blob([out],{type:'application/pdf'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`trace-${entry.id.slice(0,8)}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  
  function card(entry,index) {
    const isTr = document.documentElement.lang === 'tr';
    const div=document.createElement('div'); div.className='entry';
    const stamp=new Date(entry.date);
    div.innerHTML=`<div class="entry-canvas"><svg viewBox="0 0 1000 1000" preserveAspectRatio="none">${drawing(entry)}</svg></div><div class="entry-meta"><span data-en="TRACE / ${String(index+1).padStart(3,'0')}" data-tr="İZ / ${String(index+1).padStart(3,'0')}">${isTr ? 'İZ' : 'TRACE'} / ${String(index+1).padStart(3,'0')}</span><button type="button" data-en="DOWNLOAD PDF ↗" data-tr="PDF İNDİR ↗">${isTr ? 'PDF İNDİR' : 'DOWNLOAD PDF'} ↗</button></div><div class="entry-details"><time>${esc(stamp.toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'}))}</time><span data-en="${(entry.points||[]).length} points" data-tr="${(entry.points||[]).length} nokta">${(entry.points||[]).length} ${isTr ? 'nokta' : 'points'}</span></div>`;
    div.querySelector('button').addEventListener('click',()=>pdf(entry));return div;
  }
  let currentSort = 'newest';
  let allEntries = [];

  
  function renderTraces(entries) {
    allEntries = entries;
    const isTr = document.documentElement.lang === 'tr';
    const collective = document.getElementById('collective');
    const isArchivePage = !!document.getElementById('all-traces-grid');

    let filteredEntries = entries;
    let selectedYear = 'all';
    let selectedMonth = 'all';

    if (!isArchivePage) {
      const now = new Date();
      selectedYear = String(now.getFullYear());
      selectedMonth = String(now.getMonth());
      filteredEntries = entries.filter(e => {
        const d = new Date(e.date);
        return String(d.getFullYear()) === selectedYear && String(d.getMonth()) === selectedMonth;
      });
    } else {
      const yearSelect = document.getElementById('archive-filter-year');
      const monthSelect = document.getElementById('archive-filter-month');

      if (yearSelect && yearSelect.options.length === 1 && entries.length > 0) {
        const years = [...new Set(entries.map(e => new Date(e.date).getFullYear()))].sort((a,b)=>a-b);
        years.forEach(y => {
          const opt = document.createElement('option');
          opt.value = y;
          opt.textContent = y;
          yearSelect.appendChild(opt);
        });
      }

      if (yearSelect) selectedYear = yearSelect.value;
      if (monthSelect) selectedMonth = monthSelect.value;

      if (selectedYear !== 'all') {
        filteredEntries = filteredEntries.filter(e => String(new Date(e.date).getFullYear()) === selectedYear);
      }
      if (selectedMonth !== 'all') {
        filteredEntries = filteredEntries.filter(e => String(new Date(e.date).getMonth()) === selectedMonth);
      }
    }

    if (collective) {
      if (filteredEntries.length) collective.innerHTML = `<svg viewBox="0 0 1000 1000" preserveAspectRatio="none">${filteredEntries.map((e,i)=>`<g opacity="${Math.max(0, 1 - 0.02 * (filteredEntries.length - 1 - i)).toFixed(3)}">${drawing(e)}</g>`).join('')}</svg>`;
      else collective.innerHTML = `<div class="empty" data-en="No traces found for this period." data-tr="Bu döneme ait iz bulunamadı.">${isTr ? 'Bu döneme ait iz bulunamadı.' : 'No traces found for this period.'}</div>`;
      
      const tc = document.getElementById('trace-count');
      if (tc) tc.innerHTML = `${String(filteredEntries.length).padStart(2,'0')} <span data-en="TRACES" data-tr="İZ">${isTr ? 'İZ' : 'TRACES'}</span>`;
      
      const ic = document.getElementById('individual-count');
      if (ic) ic.innerHTML = `${String(filteredEntries.length).padStart(2,'0')} / <span data-en="TRACES" data-tr="İZ">${isTr ? 'İZ' : 'TRACES'}</span>`;
      
      const rt = document.getElementById('recent-traces');
      if (rt) {
        rt.innerHTML = '';
        const recent = filteredEntries.slice(-6).reverse();
        recent.forEach((e) => rt.appendChild(card(e, filteredEntries.indexOf(e))));
      }
    }

    const traceModalBody = document.getElementById('modal-traces-grid');
    if (traceModalBody && !document.getElementById('trace-modal').hidden) {
       traceModalBody.innerHTML = '';
       let sorted = filteredEntries.slice();
       if (currentSort === 'newest') sorted.reverse();
       else if (currentSort === 'points') sorted.sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0));
       sorted.forEach(e => {
           traceModalBody.appendChild(card(e, filteredEntries.indexOf(e)));
       });
    }

    const grid = document.getElementById('all-traces-grid');
    if (grid) {
      grid.innerHTML = '';
      const list = filteredEntries.slice().reverse();
      let shown = 0;
      const more = document.getElementById('more-traces');
      const ac = document.getElementById('archive-count');
      if (ac) ac.innerHTML = `${String(filteredEntries.length).padStart(2,'0')} <span data-en="TRACES" data-tr="İZ">${isTr ? 'İZ' : 'TRACES'}</span>`;
      
      const reveal = () => {
        list.slice(shown, shown + 12).forEach((e, i) => grid.appendChild(card(e, filteredEntries.length - shown - i - 1)));
        shown += 12;
        if (more) more.hidden = shown >= list.length;
      };
      
      if (more) {
        const newMore = more.cloneNode(true);
        more.replaceWith(newMore);
        newMore.addEventListener('click', reveal);
      }
      reveal();
      if (!filteredEntries.length) grid.innerHTML = `<p data-en="No traces found for this period." data-tr="Bu döneme ait iz bulunamadı.">${isTr ? 'Bu döneme ait iz bulunamadı.' : 'No traces found for this period.'}</p>`;
    }
  }

  const setupArchiveFilters = () => {
    const yearSelect = document.getElementById('archive-filter-year');
    const monthSelect = document.getElementById('archive-filter-month');
    if (yearSelect && !yearSelect.hasListener) {
      yearSelect.addEventListener('change', () => renderTraces(allEntries));
      yearSelect.hasListener = true;
    }
    if (monthSelect && !monthSelect.hasListener) {
      monthSelect.addEventListener('change', () => renderTraces(allEntries));
      monthSelect.hasListener = true;
    }
  };
  setupArchiveFilters();

  function renderModalTraces() {
    renderTraces(allEntries);
  }

  const traceModal = document.getElementById('trace-modal');
  const btnSeeMore = document.getElementById('btn-see-more-traces');
  const btnSeeTop = document.getElementById('btn-see-traces-top');
  const btnCloseModal = document.getElementById('btn-close-trace-modal');
  const sortSelect = document.getElementById('trace-sort-select');

  if (traceModal) {
      const openModal = (e) => { e.preventDefault(); traceModal.hidden = false; renderModalTraces(); };
      if (btnSeeMore) btnSeeMore.addEventListener('click', openModal);
      if (btnSeeTop) btnSeeTop.addEventListener('click', openModal);
      if (btnCloseModal) btnCloseModal.addEventListener('click', () => traceModal.hidden = true);
      if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; renderModalTraces(); });
  }

  // İlk render (veri Firebase'den gelene kadar ekranda boş kalmasın diye locali göster)
  renderTraces(read());

  const network=document.getElementById('eye-network');
  if (network && !window.projectsJsLoaded) {
    // Moved to projects.js for dynamic category modes
  }
  document.querySelectorAll('.top nav a').forEach(a=>{if ((new URL(a.href).pathname.replace(/\/+$/,'')||'/')===path) a.setAttribute('aria-current','page')});

  // Interactive peeling skin grid effect following cursor with safe text sampling
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(hover: hover)').matches) {
    const canvas = document.createElement('canvas');
    canvas.id = 'skin-grid-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Offscreen canvas for sampling underlying text/content
    const textCanvas = document.createElement('canvas');
    const tCtx = textCanvas.getContext('2d');

    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      lastSampleTarget = null;
    }
    resize();
    window.addEventListener('resize', resize);

    const CELL = 15;
    const RADIUS = 75;
    let mx = -9999, my = -9999;
    let curX = -9999, curY = -9999;
    let active = false;
    let globalOpacity = 0;
    let rafId = null;

    let lastSampleTarget = null;
    let hasSampleContent = false;

    function sampleContent(x, y) {
      try {
        if (x < 0 || y < 0 || x > width || y > height) return;
        const el = document.elementFromPoint(x, y);
        if (!el || el === document.body || el === document.documentElement || el.id === 'skin-grid-canvas') {
          if (lastSampleTarget) {
            lastSampleTarget = null;
            tCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            hasSampleContent = false;
          }
          return;
        }

        const target = el.closest('h1, h2, h3, p, a, button, span, img, li, time') || el;
        if (target === lastSampleTarget) return;
        lastSampleTarget = target;

        tCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        hasSampleContent = false;

        const r = target.getBoundingClientRect();
        if (!r.width || !r.height) return;

        tCtx.save();
        tCtx.scale(dpr, dpr);

        if (target.tagName === 'IMG' && target.complete && target.naturalWidth > 0) {
          tCtx.drawImage(target, r.left, r.top, r.width, r.height);
          hasSampleContent = true;
        } else {
          const comp = window.getComputedStyle(target);
          const text = (target.innerText || '').trim();
          if (text) {
            tCtx.font = `${comp.fontStyle || 'normal'} ${comp.fontWeight || '400'} ${comp.fontSize || '16px'} ${comp.fontFamily || 'sans-serif'}`;
            tCtx.fillStyle = comp.color || '#171717';
            tCtx.textBaseline = 'top';
            const align = comp.textAlign || 'left';
            tCtx.textAlign = align;

            let drawX = r.left;
            if (align === 'center') drawX = r.left + r.width / 2;
            else if (align === 'right') drawX = r.right;

            // Draw line by line if multi-line
            const lines = text.split('\n');
            const lineHeight = parseFloat(comp.lineHeight) || (parseFloat(comp.fontSize) * 1.3) || 20;
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].trim()) {
                tCtx.fillText(lines[i].trim(), drawX, r.top + i * lineHeight);
                hasSampleContent = true;
              }
            }
          }
        }
        tCtx.restore();
      } catch (e) {
        hasSampleContent = false;
      }
    }

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!active) {
        if (curX < -5000) { curX = mx; curY = my; }
        active = true;
      }
      if (!rafId) rafId = requestAnimationFrame(render);
    });

    document.addEventListener('mouseleave', () => {
      active = false;
      lastSampleTarget = null;
    });

    function render() {
      try {
        curX += (mx - curX) * 0.2;
        curY += (my - curY) * 0.2;

        if (active) {
          globalOpacity = Math.min(1, globalOpacity + 0.1);
          sampleContent(curX, curY);
        } else {
          globalOpacity = Math.max(0, globalOpacity - 0.05);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (globalOpacity > 0.001) {
          ctx.save();
          ctx.scale(dpr, dpr);

          const minCol = Math.max(0, Math.floor((curX - RADIUS) / CELL));
          const maxCol = Math.min(Math.ceil(width / CELL) - 1, Math.ceil((curX + RADIUS) / CELL));
          const minRow = Math.max(0, Math.floor((curY - RADIUS) / CELL));
          const maxRow = Math.min(Math.ceil(height / CELL) - 1, Math.ceil((curY + RADIUS) / CELL));

          for (let c = minCol; c <= maxCol; c++) {
            for (let r = minRow; r <= maxRow; r++) {
              const bx = c * CELL;
              const by = r * CELL;
              const cx = bx + CELL / 2;
              const cy = by + CELL / 2;
              const dist = Math.hypot(curX - cx, curY - cy);

              if (dist > RADIUS) continue;

              const norm = dist / RADIUS;
              const p = 1 - norm;
              const factor = p * p * (3 - 2 * p);
              const tileAlpha = factor * globalOpacity;

              // 1. UNDERNEATH: Exposed electric blue layer where skin lifts
              ctx.fillStyle = '#3157d7';
              ctx.globalAlpha = tileAlpha * 0.92;
              ctx.fillRect(bx + 0.5, by + 0.5, CELL - 1, CELL - 1);

              // 2. SURROUNDING MESH: subtle grid lines around field
              ctx.strokeStyle = `rgba(49, 87, 215, ${tileAlpha * 0.28})`;
              ctx.lineWidth = 0.8;
              ctx.strokeRect(bx, by, CELL, CELL);

              // 3. LIFTED GRID TILE: pulls toward mouse, rotates slightly & rises
              const angleToMouse = Math.atan2(curY - cy, curX - cx);
              const pull = factor * 8;
              const dx = Math.cos(angleToMouse) * pull;
              const dy = Math.sin(angleToMouse) * pull - factor * 2;
              const rot = ((c + r) % 2 === 0 ? 1 : -1) * factor * 0.16 + angleToMouse * 0.03 * factor;
              const s = Math.max(0.78, 1 - factor * 0.08);

              ctx.save();
              ctx.translate(cx + dx, cy + dy);
              ctx.rotate(rot);
              ctx.scale(s, s);

              // Shadow
              ctx.shadowColor = `rgba(0, 0, 0, ${tileAlpha * 0.25})`;
              ctx.shadowBlur = 3 * factor;
              ctx.shadowOffsetX = dx * 0.25;
              ctx.shadowOffsetY = dy * 0.25 + 1.2 * factor;

              // Tile surface
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = Math.min(1, tileAlpha * 1.3);
              ctx.fillRect(-CELL / 2 + 0.5, -CELL / 2 + 0.5, CELL - 1, CELL - 1);

              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;

              // 4. CONTENT ON TILE: Draw underlying sampled text / image chunk
              if (hasSampleContent) {
                const sx = Math.floor(bx * dpr);
                const sy = Math.floor(by * dpr);
                const sw = Math.floor(CELL * dpr);
                const sh = Math.floor(CELL * dpr);
                if (sx >= 0 && sy >= 0 && sx + sw <= textCanvas.width && sy + sh <= textCanvas.height) {
                  ctx.drawImage(
                    textCanvas,
                    sx,
                    sy,
                    sw,
                    sh,
                    -CELL / 2 + 0.5,
                    -CELL / 2 + 0.5,
                    CELL - 1,
                    CELL - 1
                  );
                }
              }

              // Tile border
              ctx.strokeStyle = `rgba(23, 23, 23, ${Math.min(0.85, 0.25 + factor * 0.65)})`;
              ctx.lineWidth = 1;
              ctx.strokeRect(-CELL / 2 + 0.5, -CELL / 2 + 0.5, CELL - 1, CELL - 1);

              ctx.restore();
            }
          }

          ctx.restore();
          rafId = requestAnimationFrame(render);
        } else {
          rafId = null;
        }
      } catch (err) {
        // Even if anything fails, continue rendering
        rafId = requestAnimationFrame(render);
      }
    }
  }
})();
