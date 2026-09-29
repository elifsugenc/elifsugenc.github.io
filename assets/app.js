(async () => {
  const STORE = 'elifsu-local-traces';
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const marker = sessionStorage.getItem('elifsu-next-page');
  const nav = performance.getEntriesByType('navigation')[0];
  sessionStorage.removeItem('elifsu-next-page');
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
    const lines = e.points.slice(1).map((p,i) => { const a=e.points[i]; const speed=Math.hypot(p.x-a.x,p.y-a.y)/Math.max(40,p.t-a.t)*1000; return `<line x1="${a.x}" y1="${a.y}" x2="${p.x}" y2="${p.y}" stroke="currentColor" stroke-opacity=".42" stroke-width="${clamp(9-speed*.045,1.1,9)}" stroke-linecap="round"/>`; }).join('');
    const dwells = (e.dwells||[]).map(d => `<circle cx="${d.x}" cy="${d.y}" r="${clamp(d.duration/160,7,45)}" fill="currentColor" opacity=".04"/><circle cx="${d.x}" cy="${d.y}" r="${clamp(d.duration/300,3,24)}" fill="currentColor" opacity=".12"/>`).join('');
    const clicks = (e.clicks||[]).map(c => `<g transform="translate(${c.x} ${c.y})" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">${rays.map(([x,y,x2,y2])=>`<path d="M${x} ${y} L${x2} ${y2}"/>`).join('')}</g>`).join('');
    return lines+dwells+clicks;
  }
  
  function pdf(entry) {
    const pts = entry.points || [], cmds = ['0.12 0.12 0.12 RG 1 w'];
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

  function renderModalTraces() {
    const modalGrid = document.getElementById('modal-traces-grid');
    if (!modalGrid) return;
    modalGrid.innerHTML = '';
    let sorted = allEntries.slice();
    if (currentSort === 'newest') sorted.reverse();
    else if (currentSort === 'points') sorted.sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0));

    sorted.forEach(e => {
        modalGrid.appendChild(card(e, allEntries.indexOf(e)));
    });
  }

  function renderTraces(entries) {
    allEntries = entries;
    const isTr = document.documentElement.lang === 'tr';
    const collective=document.getElementById('collective');
    if (collective) {
      if (entries.length) collective.innerHTML=`<svg viewBox="0 0 1000 1000" preserveAspectRatio="none">${entries.map((e,i)=>`<g opacity="${Math.max(.005,.9*Math.pow(.85,entries.length-1-i)).toFixed(3)}">${drawing(e)}</g>`).join('')}</svg>`;
      else collective.innerHTML=`<div class="empty" data-en="The first trace has yet to arrive." data-tr="İlk iz henüz ulaşmadı.">${isTr ? 'İlk iz henüz ulaşmadı.' : 'The first trace has yet to arrive.'}</div>`;
      
      const tc = document.getElementById('trace-count');
      if (tc) tc.innerHTML=`${String(entries.length).padStart(2,'0')} <span data-en="TRACES" data-tr="İZ">${isTr ? 'İZ' : 'TRACES'}</span>`;
      
      const ic = document.getElementById('individual-count');
      if (ic) ic.innerHTML=`${String(entries.length).padStart(2,'0')} / <span data-en="TRACES" data-tr="İZ">${isTr ? 'İZ' : 'TRACES'}</span>`;
      
      const rt = document.getElementById('recent-traces');
      
      if (rt) {
        rt.innerHTML='';
        const recent = entries.slice(-6).reverse();
        recent.forEach((e)=>rt.appendChild(card(e, entries.indexOf(e))));
      }
    }

    const traceModal = document.getElementById('trace-modal');
    if (traceModal && !traceModal.hidden) renderModalTraces();
    
    const grid=document.getElementById('all-traces-grid');
    if (grid) {
      grid.innerHTML='';
      const list=entries.slice().reverse();
      let shown=0;
      const more=document.getElementById('more-traces');
      const ac = document.getElementById('archive-count');
      if (ac) ac.innerHTML=`${String(entries.length).padStart(2,'0')} <span data-en="TRACES" data-tr="İZ">${isTr ? 'İZ' : 'TRACES'}</span>`;
      
      const reveal=()=>{
        list.slice(shown,shown+12).forEach((e,i)=>grid.appendChild(card(e,entries.length-shown-i-1)));
        shown+=12;
        if (more) more.hidden=shown>=list.length;
      };
      if (more) {
        const newMore = more.cloneNode(true);
        more.replaceWith(newMore);
        newMore.addEventListener('click', reveal);
      }
      reveal();
      if (!entries.length) grid.innerHTML=`<p data-en="The first trace has yet to arrive." data-tr="İlk iz henüz ulaşmadı.">${isTr ? 'İlk iz henüz ulaşmadı.' : 'The first trace has yet to arrive.'}</p>`;
    }
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
  if (network) {
    const bases=[[175,172],[820,174],[190,545],[810,540],[500,90],[500,610],[120,350]];
    const nodes=[...network.querySelectorAll('[data-node]')];const lines=document.getElementById('network-lines');
    let start=performance.now(),frame=0;
    const animate=now=>{const t=(now-start)/1000;const coords=bases.map(([x,y],i)=>[x+Math.sin(t*.42+i*1.8)*23,y+Math.cos(t*.35+i*2.2)*17]);lines.innerHTML=coords.map(([x,y],i)=>`<line x1="500" y1="350" x2="${x}" y2="${y}" class="spoke"/><circle cx="${x}" cy="${y}" r="4" class="node-dot"/><line x1="${x}" y1="${y}" x2="${coords[(i+1)%bases.length][0]}" y2="${coords[(i+1)%bases.length][1]}" class="mesh"/>`).join('');nodes.forEach((el,i)=>{if(coords[i]){el.style.left=coords[i][0]/10+'%';el.style.top=coords[i][1]/7+'%'}});if (!matchMedia('(prefers-reduced-motion: reduce)').matches) frame=requestAnimationFrame(animate)};
    frame=requestAnimationFrame(animate);

    const pupil = document.getElementById('eye-pupil');
    if (pupil) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        pupil.style.transform = `translate(${x * 40}px, ${y * 25}px)`;
      });
    }
  }
  document.querySelectorAll('.top nav a').forEach(a=>{if ((new URL(a.href).pathname.replace(/\/+$/,'')||'/')===path) a.setAttribute('aria-current','page')});
    function setLanguage(lang) {
    try { localStorage.setItem('elifsu-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.dataset[lang]) {
        el.innerHTML = el.dataset[lang];
      }
    });
  }

  let savedLang = 'en';
  try { savedLang = localStorage.getItem('elifsu-lang') || 'en'; } catch (e) {}
  setLanguage(savedLang);

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });
})();
